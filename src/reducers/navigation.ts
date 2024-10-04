import {NavigationState} from "../model/navigation"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"

const initialState = {
  title: "SpickApp",
} as NavigationState

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<NavigationState>) => {
      if(!action.payload)
        return
      state.title = action.payload.title
    }
  }
})

export const {setCurrentTab} = navigationSlice.actions
export default navigationSlice.reducer
export const navigationSelector = (state: RootState): NavigationState => state.navigation
