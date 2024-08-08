import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileInterface {
    name: string;
    path: string;
}

interface FolderInterface {
    name: string,
    files: FileInterface[]
}

const initialState: FolderInterface = {
    name: '',
    files: []
}

export const folderSlice = createSlice({
    name: 'folderSlice',
    initialState,
    reducers: {
        setFolder: (state, action: PayloadAction<FolderInterface>) => {
            state.files = action.payload.files;
            state.name = action.payload.name;
        },
    }
})

export const { setFolder } = folderSlice.actions;

export default folderSlice.reducer