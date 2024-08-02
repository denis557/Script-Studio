import { configureStore } from '@reduxjs/toolkit'
import selectedFileReducer from '../components/Codespace/selectedFileSlice'
import openedFilesReducer from '../components/OpenedFiles/openedFilesSlice'

export const store = configureStore({
  reducer: {
    selectedFile: selectedFileReducer,
    openedFiles: openedFilesReducer
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']