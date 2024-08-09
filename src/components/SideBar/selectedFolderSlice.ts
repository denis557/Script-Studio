import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileInterface {
    name: string;
    path: string;
}

interface SubFolderInterface {
    name: string,
    files: FileInterface[],
    folders: SubFolderInterface[],
    isOpened: boolean
}

interface FolderInterface {
    name: string,
    files: FileInterface[],
    folders: SubFolderInterface[]
}

const initialState: FolderInterface = {
    name: '',
    files: [],
    folders: []
}

export const folderSlice = createSlice({
    name: 'folderSlice',
    initialState,
    reducers: {
        setFolder: (state, action: PayloadAction<FolderInterface>) => {
            state.files = action.payload.files;
            state.name = action.payload.name;
            state.folders = action.payload.folders
        },
        changeFolderState: (state, action: PayloadAction<string>) => {
            const currentFolder = state.folders.find(folder => folder.name === action.payload);
            currentFolder.isOpened = !currentFolder?.isOpened
        }
    }
})

export const { setFolder, changeFolderState } = folderSlice.actions;

export default folderSlice.reducer