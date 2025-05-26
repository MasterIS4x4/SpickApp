import { LessonsState, LessonStatus } from '../model/states'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ILesson } from '../model/lesson'
import { updateLessonsState } from '../service/lesson'

interface LessonStatusPayload {
  lessonId: string
  status: LessonStatus
}

const initialState = {
  lessons: [],
} as LessonsState

const navigationSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setLessons: (state, action: PayloadAction<LessonsState>) => {
      if (!action.payload) return
      state.lessons = action.payload.lessons
      state.currentLesson = action.payload.currentLesson
    },
    setLessonsWithQuizzes: (state, action: PayloadAction<ILesson[]>) => {
      if (!action.payload) return
      return updateLessonsState(state, action.payload)
    },
    resetLessons: (_state, action: PayloadAction<ILesson[]>) => {
      if (!action.payload) return
      return updateLessonsState({ lessons: [] }, action.payload)
    },
    setCurrentLesson: (state, action: PayloadAction<string>) => {
      const lessonId = action.payload
      const lessonIndex = state.lessons.findIndex(lesson => lesson.lesson.id === lessonId)
      state.currentLesson = lessonIndex
    },
    setLessonStatus: (state, action: PayloadAction<LessonStatusPayload>) => {
      const lessonId = action.payload.lessonId
      const lessonIndex = state.lessons.findIndex(lesson => lesson.lesson.id === lessonId)
      if (lessonIndex < 0) return
      state.lessons[lessonIndex].status = action.payload.status
    },
    setCurrentQuiz: (state, action: PayloadAction<number | undefined>) => {
      if (state.currentLesson === undefined) return
      state.lessons[state.currentLesson].currentQuiz = action.payload
    },
  },
})

export const {
  setLessons,
  setLessonsWithQuizzes,
  resetLessons,
  setCurrentLesson,
  setLessonStatus,
  setCurrentQuiz,
} = navigationSlice.actions
export default navigationSlice.reducer
export const lessonsSelector = (state: RootState): LessonsState => state.lessons
