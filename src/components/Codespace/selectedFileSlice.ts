import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileInterface {
    name: string;
    path: string;
    originalText: string;
    text: string;
    isEdited: boolean;
}

const initialState: FileInterface = {
    name: '',
    path: '',
    originalText: '',
    text: '',
    isEdited: false
}

export const fileSlice = createSlice({
    name: 'selectedFile',
    initialState,
    reducers: {
        setSelectedFile: (state, action: PayloadAction<FileInterface>) => {
            state.name = action.payload.name;
            state.path = action.payload.path;
            state.originalText = action.payload.originalText;
            state.text = action.payload.text;
            state.isEdited = action.payload.isEdited
        },
        editText: (state, action: PayloadAction<string>) => {
            state.text = action.payload;
            if(state.originalText === action.payload) {
                state.isEdited = false;
            } else {
                state.isEdited = true
            }
        },
        editOriginalText: (state, action: PayloadAction<string>) => {
            state.originalText = action.payload;
            state.isEdited = false;
        }
    }
})

export const { setSelectedFile, editText, editOriginalText } = fileSlice.actions;

export default fileSlice.reducer