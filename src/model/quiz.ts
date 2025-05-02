import { IWord } from './lesson';

export enum QuizType {
  MultipleChoice = 'multipleChoice',
  Match = 'match',
}

export enum QuizDataType {
  Text = 'Text',
  Image = 'Image',
  Audio = 'Audio',
}

export interface IQuiz {
  question: string;
  words: IWord[];
  type: QuizType;
}

export interface IMultipleChoiceQuiz extends IQuiz {
  correct: number;
  inputTypes: QuizDataType[];
  outputType: QuizDataType;
}

export interface IMatchQuiz extends IQuiz {
  inputType: QuizDataType;
  outputType: QuizDataType;
}
