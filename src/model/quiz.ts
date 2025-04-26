import {Word} from "./lesson"

export enum QuizType {
  MultipleChoice = "multipleChoice",
  Match = "match",
}

export interface Quiz {
  lessonId: string
  words: Word[]
}

// interface WordTextElement {
//   nameRO: string
//   nameEN: string
// }
//
// interface MultipleQuizImageResponse extends Quiz {
//   input: WordTextElement | { audioUrl: string }
//   output: number // index of the correct answer
//   options: string[] // array of image URLs
// }
//
// interface MultipleQuizAudioResponse extends Quiz {
//   input: WordTextElement | { imageUrl: string }
//   output: number // index of the correct answer
//   options: string[] // array of audio URLs
// }
//
// interface MultipleQuizTextResponse extends Quiz {
//   input: {
//     audioUrl: string
//     imageUrl: string
//   }
//   output: number // index of the correct answer
//   options: WordTextElement[] // array of text options
// }
//
// interface MatchQuizImagesText extends Quiz {
//   imagesRow: string[] // array of image URLs
//   wordsRow: WordTextElement[] // array of image URLs
//   output: {
//     imageIndex: number
//     wordIndex: number
//   }[]
// }
//
// interface MatchQuizTextAudio extends Quiz {
//   textRow: WordTextElement[] // array of image URLs
//   audioRow: string[] // array of image URLs
//   output: {
//     textIndex: number
//     audioIndex: number
//   }[]
// }
//
// interface MatchQuizAudioImages extends Quiz {
//   audioRow: string[] // array of audio URLs
//   imagesRow: string[] // array of image URLs
//   output: {
//     audioIndex: number
//     imageIndex: number
//   }[]
// }

export interface MultipleChoiceQuiz extends Quiz {
  correct: number
}

export interface MatchQuiz extends Quiz {
}