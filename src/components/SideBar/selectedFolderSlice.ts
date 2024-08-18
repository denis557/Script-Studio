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

const toggleFolderStateRecursive = (folders: SubFolderInterface[], folderName: string): boolean => {
    for (const folder of folders) {
        if (folder.name === folderName) {
            folder.isOpened = !folder.isOpened;
            return true;
        }
        if (toggleFolderStateRecursive(folder.folders, folderName)) {
            return true;
        }
    }
    return false;
};

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
            toggleFolderStateRecursive(state.folders, action.payload)
        }
    }
})

export const { setFolder, changeFolderState } = folderSlice.actions;

export default folderSlice.reducer