// Quiz generator
import {ILesson, IWord} from "../model/lesson"
import {IMatchQuiz, IMultipleChoiceQuiz, IQuiz, QuizDataType, QuizType} from "../model/quiz"

const MATCH_NUMBER_OF_ELEMENTS = 3
const MULTIPLE_CHOICE_NUMBER_OF_CHOICES = 3
const MULTIPLE_CHOICE_QUIZ_CHANCE = 1 // TODO: back to 0.7 after implementing UI

const possibleTypes = []
for (let i=0; i < Object.keys(QuizDataType).length; i++) {
  for (let j=i+1; j < Object.keys(QuizDataType).length; j++) {
    possibleTypes.push({ a: Object.values(QuizDataType)[i] as QuizDataType, b: Object.values(QuizDataType)[j] as QuizDataType })
  }
}

interface GenerationContext {
  usedWords: string[]
  match: {
    numberOfElements: number
    usedTypes: { a: QuizDataType, b: QuizDataType }[]
    currentIndex: number
  }
  multipleChoice: {
    numberOfChoices: number
    usedOutputTypes: QuizDataType[]
  }
}

const chooseRandomWords = (words: IWord[]): IWord[] => {
  let tries = 0
  let randomWords: IWord[]
  while(tries < 10) {
    randomWords = words.sort(() => Math.random() - Math.random()).slice(0, 3)
    // check if a word includes another word
    const hasDuplicates = randomWords.some((word, index) => {
      return randomWords.some((otherWord, otherIndex) => {
        return index !== otherIndex && (
          word.nameRO.includes(otherWord.nameRO) || word.nameEN.includes(otherWord.nameEN) ||
          otherWord.nameRO.includes(word.nameRO) || otherWord.nameEN.includes(word.nameEN)
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

const generateMultipleChoiceQuiz = (lesson: ILesson, context: GenerationContext): IMultipleChoiceQuiz => {
  // filter remaining words and add used words if not enough
  const words = lesson.words.filter((word) => !context.usedWords.includes(word.id))
  const unusedWords = [...words]
  if (words.length < context.multipleChoice.numberOfChoices) {
    // add only how many words are needed to complete the number of choices, in order to make sure the unused words can be chosen as correct answer
    let randomWords = lesson.words.filter((word) => context.usedWords.includes(word.id))
    // filter randomWords to not include the words that are already in the quiz or words that include each other
    randomWords = randomWords.filter((word) => !words.some((otherWord) => {
      return word.nameRO.includes(otherWord.nameRO) || word.nameEN.includes(otherWord.nameEN) ||
        otherWord.nameRO.includes(word.nameRO) || otherWord.nameEN.includes(word.nameEN)
    }))
    words.push(...randomWords.sort(() => Math.random() - Math.random()).slice(0, context.multipleChoice.numberOfChoices - words.length))
  }
  // choose random words and answer
  const randomWords = chooseRandomWords(words)
  let correct = Math.floor(Math.random() * randomWords.length)
  if (unusedWords.length !== words.length) {
    // there are few words unused, so just choose one of them
    const unusedWord = unusedWords[Math.floor(Math.random() * unusedWords.length)]
    correct = randomWords.findIndex((word) => word.id === unusedWord.id)
  }
  // update context
  if (!context.usedWords.includes(randomWords[correct].id)) {
    context.usedWords.push(randomWords[correct].id)
  }
  // choose random input and output types
  let outputType: QuizDataType
  if (context.multipleChoice.usedOutputTypes.length % Object.keys(QuizDataType).length === 0) {
    outputType = Object.values(QuizDataType)[Math.floor(Math.random() * Object.keys(QuizDataType).length)] as QuizDataType
    context.multipleChoice.usedOutputTypes = []
  } else {
    const remainingOutputTypes = Object.values(QuizDataType).filter((type) => !context.multipleChoice.usedOutputTypes.includes(type as QuizDataType))
    outputType = remainingOutputTypes[Math.floor(Math.random() * remainingOutputTypes.length)] as QuizDataType
  }
  context.multipleChoice.usedOutputTypes.push(outputType)
  // add the other data types to the input types
  const remainingInputTypes = Object.values(QuizDataType).filter((type) => type !== outputType) as QuizDataType[]
  return {
    question: `What is the ${outputType.toLowerCase()} of the word?`,
    inputTypes: remainingInputTypes,
    outputType: outputType,
    words: randomWords,
    correct: correct,
    type: QuizType.MultipleChoice,
  }
}

// TODO: test and adapt to first one
const generateMatchQuiz = (lesson: ILesson, context: GenerationContext): IMatchQuiz => {
  // filter remaining words and add used words if not enough
  const words = lesson.words.filter((word) => !context.usedWords.includes(word.id))
  if (words.length < context.multipleChoice.numberOfChoices) {
    // add only how many words are needed to complete the number of choices, in order to make sure the unused words can be chosen as correct answer
    let randomWords = lesson.words.filter((word) => context.usedWords.includes(word.id))
    // filter randomWords to not include the words that are already in the quiz or words that include each other
    randomWords = randomWords.filter((word) => !words.some((otherWord) => {
      return word.nameRO.includes(otherWord.nameRO) || word.nameEN.includes(otherWord.nameEN) ||
        otherWord.nameRO.includes(word.nameRO) || otherWord.nameEN.includes(word.nameEN)
    }))
    words.push(...randomWords.sort(() => Math.random() - Math.random()).slice(0, context.multipleChoice.numberOfChoices - words.length))
  }
  // choose random words and answer
  const randomWords = chooseRandomWords(words)
  // choose random input and output types
  const { a: inputType, b: outputType } = possibleTypes[context.match.currentIndex % possibleTypes.length]
  // update context
  const randomWordIndex = Math.floor(Math.random() * randomWords.length)
  context.usedWords.push(randomWords[randomWordIndex].id)
  context.match.currentIndex++
  return {
    question: "Match the given words",
    words: randomWords,
    type: QuizType.Match,
    inputType: inputType,
    outputType: outputType,
  }
}

export const generateQuizzes = (lesson: ILesson): IQuiz[] => {
  if (lesson.words.length < Math.max(MATCH_NUMBER_OF_ELEMENTS, MULTIPLE_CHOICE_NUMBER_OF_CHOICES))
    return []
  const context: GenerationContext = {
    usedWords: [],
    match: {
      numberOfElements: MATCH_NUMBER_OF_ELEMENTS,
      currentIndex: 0,
      usedTypes: [],
    },
    multipleChoice: {
      numberOfChoices: MULTIPLE_CHOICE_NUMBER_OF_CHOICES,
      usedOutputTypes: [],
    },
  }
  const quizzes: IQuiz[] = []
  while(context.usedWords.length < lesson.words.length) {
    const quizType = Math.random() < MULTIPLE_CHOICE_QUIZ_CHANCE ? QuizType.MultipleChoice : QuizType.Match
    const quiz = quizType === QuizType.MultipleChoice ?
      generateMultipleChoiceQuiz(lesson, context) :
      generateMatchQuiz(lesson, context)
    quizzes.push(quiz)
  }
  return quizzes
}