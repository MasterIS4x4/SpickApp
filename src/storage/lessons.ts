import { Preferences } from '@capacitor/preferences'

import { LessonsState } from '../model/states'

export const getLessonsFromStorage = async (): Promise<LessonsState> => {
  return await Preferences.get({ key: 'lessons' }).then(data => {
    if (!data.value) throw new Error('Lessons not found')
    return JSON.parse(data.value) as LessonsState
  })
}

export const saveLessonsToStorage = async (data: any) => {
  await Preferences.set({ key: 'lessons', value: JSON.stringify(data) })
}

export const clearLessonsFromStorage = async () => {
  await Preferences.remove({ key: 'lessons' })
}
