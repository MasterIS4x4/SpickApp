// Quiz generator
import {Lesson, Word} from "../model/lesson"
import {MatchQuiz, MultipleChoiceQuiz, Quiz, QuizType} from "../model/quiz"

const MULTIPLE_CHOICE_QUIZ_CHANCE = 0.3

const chooseRandomWords = (words: Word[]): Word[] => {
  let tries = 0
  let randomWords: Word[]
  while(tries < 10) {
    randomWords = words.sort(() => Math.random() - Math.random()).slice(0, 3)
    // check if a word includes another word
    const hasDuplicates = randomWords.some((word, index) => {
      return randomWords.some((otherWord, otherIndex) => {
        return index !== otherIndex && (
          word.nameRO.includes(otherWord.nameRO) ||
          word.nameEN.includes(otherWord.nameEN)
        )
      })
    })
    if (!hasDuplicates) {
      return randomWords
    }
    tries++
  }
  console.warn("Could not find unique random words after 10 tries")
  return randomWords
}

const generateMultipleChoiceQuiz = (lesson: Lesson, usedWords: string[], numberOfChoices = 3): MultipleChoiceQuiz => {
  const words = lesson.words.filter((word) => !usedWords.includes(word.id))
  if (words.length < numberOfChoices) {
    words.push(...lesson.words.filter((word) => usedWords.includes(word.id)))
    usedWords = []
  }
  const randomWords = chooseRandomWords(words)
  const correct = Math.floor(Math.random() * randomWords.length)
  usedWords.push(randomWords[correct].id)
  return {
    lessonId: lesson.id,
    words: randomWords,
    correct: correct,
  }
}

const generateMatchQuiz = (lesson: Lesson, usedWords: string[], numberOfElements = 3): MatchQuiz => {
  const words = lesson.words.filter((word) => !usedWords.includes(word.id))
  if (words.length < numberOfElements) {
    words.push(...lesson.words.filter((word) => usedWords.includes(word.id)))
    usedWords = []
  }
  const randomWords = chooseRandomWords(words)
  usedWords.push(...randomWords.map((word) => word.id))
  return {
    lessonId: lesson.id,
    words: randomWords,
  }
}

export const generateQuiz = (lesson: Lesson, usedWords: string[], quizType: QuizType): MultipleChoiceQuiz | MatchQuiz => {
  switch (quizType) {
    case QuizType.MultipleChoice:
      return generateMultipleChoiceQuiz(lesson, usedWords)
    case QuizType.Match:
      return generateMatchQuiz(lesson, usedWords)
    default:
      throw new Error("Invalid quiz type")
  }
}

export const generateQuizzes = (lesson: Lesson): Quiz[] => {
  if (lesson.words.length < 3)
    return []
  const usedWords: string[] = []
  const quizzes: Quiz[] = []
  const numberOfQuizzes = Math.floor(Math.random() * lesson.words.length * 3 / 4) + 1
  for (let i = 0; i < numberOfQuizzes; i++) {
    const quizType = Math.random() < MULTIPLE_CHOICE_QUIZ_CHANCE ? QuizType.MultipleChoice : QuizType.Match
    quizzes.push(generateQuiz(lesson, usedWords, quizType))
  }
  return quizzes
}