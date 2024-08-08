import { configureStore } from '@reduxjs/toolkit'
import folderReducer from '../components/SideBar/selectedFolderSlice'
import selectedFileReducer from '../components/Codespace/selectedFileSlice'
import openedFilesReducer from '../components/OpenedFiles/openedFilesSlice'
import outputReducer from '../components/Terminal/outputSlice'

export const store = configureStore({
  reducer: {
    folder: folderReducer,
    selectedFile: selectedFileReducer,
    openedFiles: openedFilesReducer,
    output: outputReducer
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']