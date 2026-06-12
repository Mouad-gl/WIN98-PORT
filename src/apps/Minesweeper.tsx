import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

type Status = 'ready' | 'playing' | 'won' | 'lost'
type LevelKey = 'beginner' | 'intermediate' | 'expert'

const LEVELS: Record<LevelKey, { w: number; h: number; mines: number; label: string }> = {
  beginner: { w: 9, h: 9, mines: 10, label: 'Beginner' },
  intermediate: { w: 16, h: 16, mines: 40, label: 'Intermediate' },
  expert: { w: 30, h: 16, mines: 99, label: 'Expert' },
}

const emptyBoard = (w: number, h: number): Cell[] =>
  Array.from({ length: w * h }, () => ({
    mine: false,
    revealed: false,
    flagged: false,
    adjacent: 0,
  }))

function neighbors(index: number, w: number, h: number): number[] {
  const x = index % w
  const y = Math.floor(index / w)
  const out: number[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) out.push(ny * w + nx)
    }
  }
  return out
}

/** Place mines avoiding the first-clicked cell (and its neighbours) and compute counts. */
function placeMines(base: Cell[], w: number, h: number, mines: number, safe: number): Cell[] {
  const cells = base.map((c) => ({ ...c }))
  const forbidden = new Set<number>([safe, ...neighbors(safe, w, h)])
  const candidates = cells.map((_, i) => i).filter((i) => !forbidden.has(i))

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }
  for (let i = 0; i < mines && i < candidates.length; i++) cells[candidates[i]].mine = true

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].mine) continue
    cells[i].adjacent = neighbors(i, w, h).filter((n) => cells[n].mine).length
  }
  return cells
}

/** Flood-reveal from a cell, opening connected empty regions. Mutates a clone. */
function revealFrom(base: Cell[], start: number, w: number, h: number): Cell[] {
  const cells = base.map((c) => ({ ...c }))
  const stack = [start]
  while (stack.length) {
    const i = stack.pop()!
    const cell = cells[i]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (cell.adjacent === 0 && !cell.mine) {
      for (const n of neighbors(i, w, h)) {
        if (!cells[n].revealed && !cells[n].flagged) stack.push(n)
      }
    }
  }
  return cells
}

const fmt = (n: number) =>
  n < 0 ? `-${String(-n).padStart(2, '0')}` : String(Math.min(n, 999)).padStart(3, '0')

export default function Minesweeper() {
  const [level, setLevel] = useState<LevelKey>('beginner')
  const { w, h, mines } = LEVELS[level]

  const [board, setBoard] = useState<Cell[]>(() => emptyBoard(w, h))
  const [status, setStatus] = useState<Status>('ready')
  const [placed, setPlaced] = useState(false)
  const [time, setTime] = useState(0)

  const reset = useCallback(
    (lvl: LevelKey = level) => {
      const dims = LEVELS[lvl]
      setBoard(emptyBoard(dims.w, dims.h))
      setStatus('ready')
      setPlaced(false)
      setTime(0)
    },
    [level],
  )

  // Timer runs only while playing.
  useEffect(() => {
    if (status !== 'playing') return
    const id = window.setInterval(() => setTime((t) => Math.min(t + 1, 999)), 1000)
    return () => window.clearInterval(id)
  }, [status])

  const flagsUsed = useMemo(() => board.filter((c) => c.flagged).length, [board])

  const reveal = (i: number) => {
    if (status === 'won' || status === 'lost') return
    if (board[i].revealed || board[i].flagged) return

    let working = board
    if (!placed) {
      working = placeMines(board, w, h, mines, i)
      setPlaced(true)
      setStatus('playing')
    }

    if (working[i].mine) {
      const exploded = working.map((c) => ({ ...c, revealed: c.revealed || c.mine }))
      setBoard(exploded)
      setStatus('lost')
      return
    }

    const next = revealFrom(working, i, w, h)
    const safeLeft = next.filter((c) => !c.mine && !c.revealed).length
    if (safeLeft === 0) {
      setBoard(next.map((c) => (c.mine ? { ...c, flagged: true } : c)))
      setStatus('won')
    } else {
      setBoard(next)
    }
  }

  const toggleFlag = (e: MouseEvent, i: number) => {
    e.preventDefault()
    if (status === 'won' || status === 'lost') return
    if (board[i].revealed) return
    setBoard((b) => b.map((c, idx) => (idx === i ? { ...c, flagged: !c.flagged } : c)))
  }

  const face = status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂'

  return (
    <div className="app mines-app">
      <div className="mines-levels">
        {(Object.keys(LEVELS) as LevelKey[]).map((k) => (
          <button
            key={k}
            type="button"
            className={k === level ? 'active' : ''}
            onClick={() => {
              setLevel(k)
              reset(k)
            }}
          >
            {LEVELS[k].label}
          </button>
        ))}
      </div>

      <div className="mines-frame">
        <div className="mines-hud">
          <span className="mines-led">{fmt(mines - flagsUsed)}</span>
          <button
            type="button"
            className="mines-face"
            onClick={() => reset()}
            aria-label="New game"
          >
            {face}
          </button>
          <span className="mines-led">{fmt(time)}</span>
        </div>

        <div
          className="mines-grid"
          style={{ gridTemplateColumns: `repeat(${w}, var(--cell))` }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {board.map((cell, i) => {
            const classes = ['mine-cell']
            if (cell.revealed) classes.push('revealed')
            if (cell.revealed && cell.mine) classes.push('boom')
            if (cell.revealed && cell.adjacent > 0) classes.push(`num-${cell.adjacent}`)
            return (
              <button
                key={i}
                type="button"
                className={classes.join(' ')}
                onClick={() => reveal(i)}
                onContextMenu={(e) => toggleFlag(e, i)}
              >
                {cell.revealed
                  ? cell.mine
                    ? '💣'
                    : cell.adjacent || ''
                  : cell.flagged
                    ? '🚩'
                    : ''}
              </button>
            )
          })}
        </div>
      </div>

      <p className="mines-hint muted">Left-click to dig · right-click to flag</p>
    </div>
  )
}
