import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OpenedFile {
    path: string;
    text: string;
}

interface FileInterface {
    name: string;
    path: string;
    originalText: string;
    text: string;
    isEdited: boolean;
}

export interface OpenedFilesInterface {
    openedFiles: FileInterface[]
}

const initialState: OpenedFilesInterface = {
    openedFiles: []
}

export const openedFilesSlice = createSlice({
    name: 'openedFiles',
    initialState,
    reducers: {
        setOpenedFiles: (state, action: PayloadAction<FileInterface>) => {
            state.openedFiles.push({
                name: action.payload.name,
                path: action.payload.path, 
                originalText: action.payload.originalText, 
                text: action.payload.text, 
                isEdited: action.payload.isEdited 
            })
        },
        editOpenedFileText: (state, action: PayloadAction<OpenedFile>) => {
            const openedFile = state.openedFiles.find(file => file.path === action.payload.path);
            openedFile.text = action.payload.text;
            if(openedFile?.originalText === action.payload.text) {
                openedFile.isEdited = false
            } else {
                openedFile.isEdited = true
            }
        },
        saveChanges: (state, action: PayloadAction<OpenedFile>) => {
            const updatedFile = state.openedFiles.find(file => file.path === action.payload.path);
            updatedFile.originalText = action.payload.text;
            updatedFile.isEdited = false;
        },
        closeFile: (state, action: PayloadAction<string>) => {
            state.openedFiles = state.openedFiles.filter(file => file.path !== action.payload);
        }
    }
})

export const { setOpenedFiles, closeFile, editOpenedFileText, saveChanges } = openedFilesSlice.actions;

export default openedFilesSlice.reducer