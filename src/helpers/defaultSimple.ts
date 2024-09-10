// const def = ['func', 'struct', 'print', 'println', 'const', 'input', 'mod', 'str', 'num', 'Array', 'print_array', 'push', 'pop', 'split', 'map', 'clear', 'empty', 'join', 'if', 'else', 'while', 'for', 'do', 'foreach', 'switch', 'case', 'try', 'catch', 'destruct', 'import', 'Math'];
export const def = [
    'Array', 'Math', 'Type', 'case', 'catch', 'clear', 'const', 'destruct', 'do {\n\t\n} while (true)', 'else', 
    'empty', 'for (i = 0; i < length; ++i) {\n\t\n}', 'foreach (el : collection) {\n\t\n}', 'func MyFunc () {\n\t\n}', 'if (true) {\n\t\n}', 'import', 'input', 'join', 'map', 'mod', 
    'num', 'pop', 'print', 'print_array', 'println', 'push', 'split', 'str', 'struct MyStruct {\n\t\n}', 
    'switch (true) {\n\tcase true {}\n\tcase false {}\n\tdefault {}\n}', 'try {\n\t\n} catch (ex : type) {\n\t\n}', 'while (true) {\n\t\n}', 'immutable', 'default'
]
export const math = [
    'abs', 'acos', 'asin', 'atan', 'atan2', 'cbrt', 
    'ceil', 'comb', 'cos', 'cosh', 'exp', 'factorial', 
    'floor', 'is_even', 'is_odd', 'is_prime', 'log', 'log10', 
    'mean', 'median', 'perm', 'power', 'round', 
    'sin', 'sinh', 'sqrt', 'std_dev', 'tan', 'tanh', 
    'variance'
]
export const type = [
    'instanseof', 'is_const', 'typeof', 'is_exists'
]
export const time = [
    'now', 'system_now', 'sleep', 'Date'
];
export const exception = [
    'error', 'TypeError', 'ValueError'
];
export const system = [
    'file_exists', 'create_file', 'delete_file', 'write', 'write_append', 'read', 'run', 'FileError', 'file_info'
]