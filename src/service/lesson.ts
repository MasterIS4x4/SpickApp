import { ILesson } from '../model/lesson'
import { IMultipleChoiceQuiz } from '../model/quiz'

const API_URL = 'https://masteris4x4.github.io/SpickAppGithubAPI/data'

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

export async function getLesson(id: string): Promise<ILesson> {
  const response = await fetch(`${API_URL}/lessons.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch lesson')
  }
  try {
    const lessons: ILesson[] = await response.json()
    console.info('Fetched lessons: ', lessons)
    return lessons.find(lesson => lesson.id === id) || null
  } catch (error) {
    console.error('Error parsing lesson data: ', error)
    throw new Error('Failed to parse lesson data. JSON format is incorrect.')
  }
}

export async function getNextLesson(id: string): Promise<ILesson | undefined> {
  const response = await fetch(`${API_URL}/lessons.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch lesson')
  }
  try {
    const lessons: ILesson[] = await response.json()
    console.info('Fetched lessons: ', lessons)
    const index = lessons.findIndex(lesson => lesson.id === id)
    if (index < 0 || index + 1 >= lessons.length) {
      return undefined
    }
    return lessons[index + 1]
  } catch (error) {
    console.error('Error parsing lesson data: ', error)
    throw new Error('Failed to parse lesson data. JSON format is incorrect.')
  }
}
