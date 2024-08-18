import Prism from 'prismjs';

Prism.languages.simple = {
    'comment': /\/\/[^\n\r]*|\/\*[\s\S]*?\*\//,
    'string': /(['"])(?:\\.|[^\\])*?\1/,
    'hex': /#\b[0-9A-Fa-f]+\b/,
    'digit': /\b\dd\b/,
    'statement': /\b(if|else|return|for|while|do|break|continue|switch|case|try|catch|foreach)\b/,
    'function-name': /(?<=\bfunc\s+)\w+/,
    'struct-name': /(?<=\bstruct\s+)\w+/,
    'enum-name': /(?<=\benum\s+)\w+/,
    'struct': /(\b(str|num|char|arr|void|digit|function)\b)/,
    'call': /\b(\w+)\b(?=\s*\()/,
    'keyword': /\b(const|func|true|false|import|void|default|struct|desctruct|field|immutable|throw|enum)\b/,
    'function': /\b(println|print)\b/,
    'number': /([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])/,
    'parameter': /\((\w+)\)/,
    'operator': /[+\-*/=<>!&|^%:,.]+|[;]/,
    'brackets': /(\(|\)|{|}|\[|\])/,
}