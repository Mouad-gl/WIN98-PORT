/** The Hobbies window. Keep these short and fun. */

export interface Hobby {
  emoji: string
  title: string
  text: string
}

export const hobbies: Hobby[] = [
  {
    emoji: '📷',
    title: 'Film Photography',
    text: 'Shooting on an old 35mm camera. Grain over megapixels, always.',
  },
  {
    emoji: '🎮',
    title: 'Retro Gaming',
    text: 'Big reason this site exists. Minesweeper and Solitaire took years of my life.',
  },
  {
    emoji: '🎧',
    title: 'Making Playlists',
    text: 'Obsessively curated playlists for every possible mood and weather.',
  },
  {
    emoji: '✏️',
    title: 'Sketching',
    text: 'Sketchbook always within reach — usually fonts, logos, and bad doodles.',
  },
  {
    emoji: '☕',
    title: 'Coffee',
    text: 'Pretending to know the difference between beans. It works most of the time.',
  },
  {
    emoji: '🥾',
    title: 'Hiking',
    text: 'Going offline in the mountains whenever the city gets too loud.',
  },
]
