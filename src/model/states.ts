/**
 * @file states.ts
 * @description This file contains the types and interfaces for the application state (Redux store).
 */

import { ILesson } from './lesson'
import { IQuiz } from './quiz'

export interface NavigationState {
  title: string
}

export interface Preferences {
  darkMode: boolean
  isAppInstalled: boolean
}

export enum LessonStatus {
  LEARNING,
  SPEAKING,
  QUIZ,
  DONE,
}

export interface LessonState {
  lesson: ILesson
  quizzes: IQuiz[]
  status: LessonStatus
  currentQuiz?: number // index of the current quiz or undefined if there are no quizzes
}

export interface LessonsState {
  lessons: LessonState[]
  currentLesson?: number // index of the current lesson or undefined if there are no lessons
}

export interface LessonQuizIndex {
  lessonIndex?: number
  quizIndex?: number
  completed?: boolean
}
