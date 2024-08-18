import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OutputInterface {
    output: string
}

const initialState: OutputInterface = {
    output: ''
}

export const outputSlice = createSlice({
    name: 'output',
    initialState,
    reducers: {
        setOutput: (state, action: PayloadAction<string>) => {
            state.output += action.payload + '\n';
        },
        clearOutput: (state) => {
            state.output = '';
        }
    }
})

export const { setOutput, clearOutput } = outputSlice.actions;

export default outputSlice.reducer

// ≽^•⩊•^≼