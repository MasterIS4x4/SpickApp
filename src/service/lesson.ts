import { ILesson } from '../model/lesson'
import { LessonQuizIndex, LessonsState, LessonState, LessonStatus } from '../model/states'
import { generateQuizzes } from './quiz'

const API_URL = 'https://masteris4x4.github.io/SpickAppGithubAPI/data'

interface FirstNextLesson {
  lessonId: string
  text: 'Start' | 'Resume'
}

export async function getLessons(): Promise<ILesson[]> {
  const response = await fetch(`${API_URL}/lessons.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch lessons')
  }
  try {
    return await response.json()
  } catch (error) {
    console.error('Error parsing lessons data: ', error)
    throw new Error('Failed to parse lessons data. JSON format is incorrect.')
  }
}

export const getLesson = (state: LessonsState, lessonId: string): LessonState | undefined => {
  const lessonIndex = state.lessons.findIndex(lesson => lesson.lesson.id === lessonId)
  if (lessonIndex < 0) return
  return state.lessons[lessonIndex]
}

export const getNextLesson = (state: LessonsState, lessonId: string): LessonState | undefined => {
  let lessonIndex = state.lessons.findIndex(lesson => lesson.lesson.id === lessonId)
  if (lessonIndex < 0) return
  let nextLessonIndex = lessonIndex + 1
  while (
    nextLessonIndex < state.lessons.length &&
    state.lessons[nextLessonIndex].status === LessonStatus.DONE
  )
    nextLessonIndex++
  return state.lessons[nextLessonIndex]
}

export const getLessonQuizIndex = (state: LessonsState): LessonQuizIndex => {
  const currentLesson = state.currentLesson
  if (!currentLesson) return {}
  const lesson = state.lessons[currentLesson]
  return {
    lessonIndex: currentLesson,
    quizIndex: lesson?.currentQuiz,
    completed: lesson?.status === LessonStatus.DONE,
  }
}

export const getFirstNextLesson = (state: LessonsState): FirstNextLesson | undefined => {
  if (!state.lessons || state.lessons.length === 0) return
  const lesson = state.lessons.find(l => l.status !== LessonStatus.DONE)
  if (!lesson) return
  return {
    lessonId: lesson.lesson.id,
    text: lesson.status === LessonStatus.LEARNING ? 'Start' : 'Resume',
  }
}

export const updateLessonsState = (
  currentLessons: LessonsState,
  lessons: ILesson[],
): LessonsState => {
  const newLessons = lessons.filter(
    lesson => !currentLessons.lessons.find(l => l.lesson.id === lesson.id),
  )
  const newLessonsWithQuizzes: LessonState[] = newLessons.map(lesson => ({
    lesson,
    quizzes: generateQuizzes(lesson),
    status: LessonStatus.LEARNING, // new lessons start in learning state
    currentQuiz: undefined,
  }))
  const oldLessons = currentLessons.lessons.filter(lesson =>
    lessons.find(l => l.id === lesson.lesson.id),
  )
  const updatedLessons = oldLessons.map(lesson => {
    const newLesson = lessons.find(l => l.id === lesson.lesson.id)
    if (JSON.stringify(lesson.lesson) === JSON.stringify(newLesson)) {
      return lesson
    }
    return {
      lesson: newLesson,
      quizzes: generateQuizzes(newLesson),
      status: LessonStatus.LEARNING, // reset status to learning for updated lessons
      currentQuiz: undefined,
    }
  })
  currentLessons.lessons = [...updatedLessons, ...newLessonsWithQuizzes].sort((a, b) => {
    if (a.lesson.id < b.lesson.id) return -1
    if (a.lesson.id > b.lesson.id) return 1
    return 0
  })
  return currentLessons
}
