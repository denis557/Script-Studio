import Prism from 'prismjs';

Prism.languages.simple = {
    'statement': /\b(if|else|return|for|while|do|break|continue|switch|case|try|catch|foreach)\b/,
    'function-name': /(?<=\bfunc\s+)\w+/,
    'struct-name': /(?<=\bstruct\s+)\w+/,
    'call': /\b(\w+)\b(?=\s*\()/,
    'comment': /\/\/[^\n\r]*|\/\*[\s\S]*?\*\//,
    'keyword': /\b(const|func|true|false|import|void|default|struct|desctruct|field|immutable|throw)\b/,
    'function': /\b(println|print)\b/,
    'number': /([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])/,
    'string': /(['"])(?:\\.|[^\\])*?\1/,
    'parameter': /\((\w+)\)/,
    'operator': /[+\-*/=<>!&|^%]+|[;]/,
    'brackets': /(\(|\)|{|})/,
}