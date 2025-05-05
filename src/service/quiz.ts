// Quiz generator
import { ILesson, IWord } from '../model/lesson'
import { IMatchQuiz, IMultipleChoiceQuiz, IQuiz, QuizDataType, QuizType } from '../model/quiz'

const MATCH_NUMBER_OF_ELEMENTS = 3
const MULTIPLE_CHOICE_NUMBER_OF_CHOICES = 3
const MULTIPLE_CHOICE_QUIZ_CHANCE = 1 // TODO: back to 0.7 after implementing UI

interface GenerationContext {
  usedWords: string[]
  match: {
    numberOfElements: number
    usedTypes: { a: QuizDataType; b: QuizDataType }[]
    currentIndex: number
  }
  multipleChoice: {
    numberOfChoices: number
    usedOutputTypes: QuizDataType[]
  }
}

const possibleTypes = Object.values(QuizDataType).flatMap((a, i, arr) =>
  arr.slice(i + 1).map(b => ({ a: a, b: b }))
);

const wordsIncludeEachOther = (w1: IWord, w2: IWord) =>
  w1.nameRO.includes(w2.nameRO) || 
  w1.nameEN.includes(w2.nameEN) ||
  w2.nameRO.includes(w1.nameRO) ||
  w2.nameEN.includes(w1.nameEN);

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const ensureEnoughWords = (lesson: ILesson, context: GenerationContext, neededCount: number): IWord[] => {
  const unused = lesson.words.filter(word => !context.usedWords.includes(word.id));
  let result = [...unused];

  if (result.length < neededCount) {
    const extras = lesson.words
      .filter(word => context.usedWords.includes(word.id))
      .filter(word => !unused.some(unused => wordsIncludeEachOther(word, unused)))
    
    result.push(...shuffle(extras).slice(0, neededCount - result.length))
  }

  return result;
}

const getUniqueRandomWords = (words: IWord[], count: number): IWord[] => {
  for (let i = 0; i < 10; i++) {
    const selected = shuffle(words).slice(0, count);
    const hasDuplicates = selected.some((word, idx) => 
      selected.some((other, jdx) => idx != jdx && wordsIncludeEachOther(word, other))
    )
    if (!hasDuplicates) return selected;
  }
  console.warn("Could not find unique random words after 10 tries")
  return shuffle(words).slice(0, count)
}

const getNextOutputType = (context: GenerationContext): QuizDataType => {
  const allTypes = Object.values(QuizDataType);

  if (context.multipleChoice.usedOutputTypes.length % allTypes.length === 0) {
    context.multipleChoice.usedOutputTypes = [];
  }
  const remaining = allTypes.filter(
    type => !context.multipleChoice.usedOutputTypes.includes(type as QuizDataType)
  );
  const outputType = remaining[Math.floor(Math.random() * remaining.length)] as QuizDataType;
  context.multipleChoice.usedOutputTypes.push(outputType);

  return outputType;
}

const generateMultipleChoiceQuiz = (lesson: ILesson, context: GenerationContext): IMultipleChoiceQuiz => {
  const allWords = ensureEnoughWords(lesson, context, context.multipleChoice.numberOfChoices);
  const selectedWords = getUniqueRandomWords(allWords, context.multipleChoice.numberOfChoices);

  const correctIndex = (() => {
    const unused = selectedWords.filter(word => !context.usedWords.includes(word.id))
    if (unused.length > 0) {
      const unusedWord = unused[Math.floor(Math.random() * unused.length)];
      return selectedWords.findIndex(word => word.id === unusedWord.id);
    }
    return Math.floor(Math.random() * selectedWords.length)
  })();

  context.usedWords.push(selectedWords[correctIndex].id);

  const outputType = getNextOutputType(context);
  const inputTypes = Object.values(QuizDataType).filter(t => t !== outputType) as QuizDataType[];

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
  const allWords = ensureEnoughWords(lesson, context, context.match.numberOfElements);
  const selectedWords = getUniqueRandomWords(allWords, context.match.numberOfElements);

  const { a: inputType, b: outputType } =
    possibleTypes[context.match.currentIndex % possibleTypes.length]

  const randomWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];
  context.usedWords.push(randomWord.id);
  context.match.currentIndex++;

  return {
    question: 'Match the words',
    words: selectedWords,
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

  while (context.usedWords.length < lesson.words.length) {
    const quiz = Math.random() < MULTIPLE_CHOICE_QUIZ_CHANCE
        ? generateMultipleChoiceQuiz(lesson, context)
        : generateMatchQuiz(lesson, context)
    quizzes.push(quiz)
  }

  return quizzes
}
