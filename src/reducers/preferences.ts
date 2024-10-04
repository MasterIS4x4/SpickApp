import {Preferences} from "../model/preferences"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"

export const initialPreferences = {
  darkMode: true,
} as Preferences

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialPreferences,
  reducers: {
    setPreferences: (state, action: PayloadAction<Preferences>) => {
      if(!action.payload)
        return
      // return action.payload
      state.darkMode = action.payload.darkMode ?? state.darkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
  }
})

export const {setPreferences, setDarkMode} = preferencesSlice.actions
export default preferencesSlice.reducer
export const preferencesSelector = (state: RootState): Preferences => state.preferences