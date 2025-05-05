import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Preferences } from '../model/states'

export const initialPreferences = {
  darkMode: false,
  isAppInstalled: false,
} as Preferences

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: initialPreferences,
  reducers: {
    setPreferences: (state, action: PayloadAction<Preferences>) => {
      if (!action.payload) return
      // return action.payload
      state.darkMode = action.payload.darkMode ?? state.darkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    setIsAppInstalled: (state, action: PayloadAction<boolean>) => {
      state.isAppInstalled = action.payload
    },
  },
})

export const { setPreferences, setDarkMode, setIsAppInstalled } = preferencesSlice.actions
export default preferencesSlice.reducer
export const preferencesSelector = (state: RootState): Preferences => state.preferences
