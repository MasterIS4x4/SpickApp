// Quiz generator
import { ILesson, IWord } from '../model/lesson'
import {
  IMatchQuiz,
  IMultipleChoiceQuiz,
  IQuiz,
  ISpeakingQuiz,
  QuizDataType,
  QuizType,
} from '../model/quiz'

const MATCH_WORD_COUNT = 3
const CHOICE_WORD_COUNT = 3
const CHOICE_PROBABILITY = 1 // TODO: back to 0.7 after implementing UI

interface GenerationContext {
  usedWordIds: Set<string>
  match: {
    count: number
    usedTypes: { a: QuizDataType; b: QuizDataType }[]
    currentIndex: number
  }
  multipleChoice: {
    count: number
    usedOutputTypes: QuizDataType[]
  }
}

const possibleTypes = Object.values(QuizDataType).flatMap((a, i, arr) =>
  arr.slice(i + 1).map(b => ({ a: a, b: b })),
)

const wordsIncludeEachOther = (w1: IWord, w2: IWord) =>
  w1.nameRO.includes(w2.nameRO) ||
  w1.nameEN.includes(w2.nameEN) ||
  w2.nameRO.includes(w1.nameRO) ||
  w2.nameEN.includes(w1.nameEN)

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

const getAvailableWords = (
  lesson: ILesson,
  context: GenerationContext,
  needed: number,
): IWord[] => {
  const unused = lesson.words.filter(word => !context.usedWordIds.has(word.id))
  if (unused.length >= needed) return unused

  const extras = lesson.words
    .filter(word => context.usedWordIds.has(word.id))
    .filter(word => !unused.some(unused => wordsIncludeEachOther(word, unused)))

  return [...unused, ...shuffle(extras).slice(0, needed - unused.length)]
}

const selectUniqueWords = (words: IWord[], count: number): IWord[] => {
  for (let i = 0; i < 10; i++) {
    const selected = shuffle(words).slice(0, count)
    const hasDuplicates = selected.some((w1, idx) =>
      selected.some((w2, jdx) => idx != jdx && wordsIncludeEachOther(w1, w2)),
    )
    if (!hasDuplicates) return selected
  }
  console.warn('Could not find unique random words after 10 tries')
  return shuffle(words).slice(0, count)
}

const getNextOutputType = (context: GenerationContext): QuizDataType => {
  const allTypes = Object.values(QuizDataType)

  if (context.multipleChoice.usedOutputTypes.length % allTypes.length === 0) {
    context.multipleChoice.usedOutputTypes = []
  }
  const remaining = allTypes.filter(
    type => !context.multipleChoice.usedOutputTypes.includes(type as QuizDataType),
  )
  const nextType = remaining[Math.floor(Math.random() * remaining.length)] as QuizDataType
  context.multipleChoice.usedOutputTypes.push(nextType)

  return nextType
}

const generateMultipleChoiceQuiz = (
  lesson: ILesson,
  context: GenerationContext,
): IMultipleChoiceQuiz => {
  const allWords = getAvailableWords(lesson, context, context.multipleChoice.count)
  const selectedWords = selectUniqueWords(allWords, context.multipleChoice.count)

  const unused = selectedWords.filter(word => !context.usedWordIds.has(word.id))
  const correctIndex = (() => {
    if (unused.length > 0) {
      const unusedWord = unused[Math.floor(Math.random() * unused.length)]
      return selectedWords.findIndex(word => word.id === unusedWord.id)
    }
    return Math.floor(Math.random() * selectedWords.length)
  })()

  context.usedWordIds.add(selectedWords[correctIndex].id)

  const outputType = getNextOutputType(context)
  const inputTypes = Object.values(QuizDataType).filter(t => t !== outputType) as QuizDataType[]

  return {
    question: `What is the correct ${outputType.toLowerCase()}?`,
    inputTypes: inputTypes,
    outputType: outputType,
    words: selectedWords,
    correct: correctIndex,
    type: QuizType.MultipleChoice,
  }
}

const generateMatchQuiz = (lesson: ILesson, context: GenerationContext): IMatchQuiz => {
  const allWords = getAvailableWords(lesson, context, context.match.count)
  const choices = selectUniqueWords(allWords, context.match.count)

  const { a: inputType, b: outputType } =
    possibleTypes[context.match.currentIndex % possibleTypes.length]

  const chosen = choices[Math.floor(Math.random() * choices.length)]
  context.usedWordIds.add(chosen.id)
  context.match.currentIndex++

  return {
    question: 'Match the words',
    words: choices,
    type: QuizType.Match,
    inputType: inputType,
    outputType: outputType,
  }
}

export const generateQuizzes = (lesson: ILesson): IQuiz[] => {
  if (lesson.words.length < Math.max(MATCH_WORD_COUNT, CHOICE_WORD_COUNT)) return []

  const context: GenerationContext = {
    usedWordIds: new Set(),
    match: {
      count: MATCH_WORD_COUNT,
      currentIndex: 0,
      usedTypes: [],
    },
    multipleChoice: {
      count: CHOICE_WORD_COUNT,
      usedOutputTypes: [],
    },
  }

  const quizzes: IQuiz[] = []

  while (context.usedWordIds.size < lesson.words.length) {
    const quiz =
      Math.random() < CHOICE_PROBABILITY
        ? generateMultipleChoiceQuiz(lesson, context)
        : generateMatchQuiz(lesson, context)
    quizzes.push(quiz)
  }

  return quizzes
}
