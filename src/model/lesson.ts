
export interface Word {
  id: string
  nameRO: string
  nameEN: string
  imageUrl: string | string[]
  audioUrl: string | string[]
}

export interface Lesson {
  id: string
  nameRO: string
  nameEN: string
  videoUrl: string
  words: Word[]
}