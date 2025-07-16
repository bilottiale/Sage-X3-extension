"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourGLLexer = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    // Keywords
    TokenType["FUNCTION"] = "FUNCTION";
    TokenType["PROCEDURE"] = "PROCEDURE";
    TokenType["FORM"] = "FORM";
    TokenType["REPORT"] = "REPORT";
    TokenType["DATABASE"] = "DATABASE";
    TokenType["TABLE"] = "TABLE";
    TokenType["SELECT"] = "SELECT";
    TokenType["INSERT"] = "INSERT";
    TokenType["UPDATE"] = "UPDATE";
    TokenType["DELETE"] = "DELETE";
    TokenType["WHERE"] = "WHERE";
    TokenType["FROM"] = "FROM";
    TokenType["INTO"] = "INTO";
    TokenType["VALUES"] = "VALUES";
    TokenType["IF"] = "IF";
    TokenType["THEN"] = "THEN";
    TokenType["ELSE"] = "ELSE";
    TokenType["ENDIF"] = "ENDIF";
    TokenType["WHILE"] = "WHILE";
    TokenType["FOR"] = "FOR";
    TokenType["ENDFOR"] = "ENDFOR";
    TokenType["ENDWHILE"] = "ENDWHILE";
    TokenType["RETURN"] = "RETURN";
    TokenType["CALL"] = "CALL";
    TokenType["DEFINE"] = "DEFINE";
    TokenType["LET"] = "LET";
    // Data types
    TokenType["INTEGER"] = "INTEGER";
    TokenType["DECIMAL"] = "DECIMAL";
    TokenType["CHAR"] = "CHAR";
    TokenType["VARCHAR"] = "VARCHAR";
    TokenType["DATE"] = "DATE";
    TokenType["DATETIME"] = "DATETIME";
    // Identifiers and literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["STRING_LITERAL"] = "STRING_LITERAL";
    TokenType["NUMBER_LITERAL"] = "NUMBER_LITERAL";
    // Operators
    TokenType["ASSIGN"] = "ASSIGN";
    TokenType["EQUALS"] = "EQUALS";
    TokenType["NOT_EQUALS"] = "NOT_EQUALS";
    TokenType["LESS_THAN"] = "LESS_THAN";
    TokenType["GREATER_THAN"] = "GREATER_THAN";
    TokenType["LESS_EQUAL"] = "LESS_EQUAL";
    TokenType["GREATER_EQUAL"] = "GREATER_EQUAL";
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    // Punctuation
    TokenType["SEMICOLON"] = "SEMICOLON";
    TokenType["COMMA"] = "COMMA";
    TokenType["DOT"] = "DOT";
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACE"] = "LBRACE";
    TokenType["RBRACE"] = "RBRACE";
    // Special
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["WHITESPACE"] = "WHITESPACE";
    TokenType["COMMENT"] = "COMMENT";
    TokenType["EOF"] = "EOF";
    TokenType["UNKNOWN"] = "UNKNOWN";
})(TokenType || (exports.TokenType = TokenType = {}));
class FourGLLexer {
    constructor(text) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        // 4GL Keywords
        this.keywords = new Map([
            ['FUNCTION', TokenType.FUNCTION],
            ['PROCEDURE', TokenType.PROCEDURE],
            ['FORM', TokenType.FORM],
            ['REPORT', TokenType.REPORT],
            ['DATABASE', TokenType.DATABASE],
            ['TABLE', TokenType.TABLE],
            ['SELECT', TokenType.SELECT],
            ['INSERT', TokenType.INSERT],
            ['UPDATE', TokenType.UPDATE],
            ['DELETE', TokenType.DELETE],
            ['WHERE', TokenType.WHERE],
            ['FROM', TokenType.FROM],
            ['INTO', TokenType.INTO],
            ['VALUES', TokenType.VALUES],
            ['IF', TokenType.IF],
            ['THEN', TokenType.THEN],
            ['ELSE', TokenType.ELSE],
            ['ENDIF', TokenType.ENDIF],
            ['WHILE', TokenType.WHILE],
            ['FOR', TokenType.FOR],
            ['ENDFOR', TokenType.ENDFOR],
            ['ENDWHILE', TokenType.ENDWHILE],
            ['RETURN', TokenType.RETURN],
            ['CALL', TokenType.CALL],
            ['DEFINE', TokenType.DEFINE],
            ['LET', TokenType.LET],
            ['INTEGER', TokenType.INTEGER],
            ['DECIMAL', TokenType.DECIMAL],
            ['CHAR', TokenType.CHAR],
            ['VARCHAR', TokenType.VARCHAR],
            ['DATE', TokenType.DATE],
            ['DATETIME', TokenType.DATETIME],
            ['AND', TokenType.AND],
            ['OR', TokenType.OR],
            ['NOT', TokenType.NOT]
        ]);
        this.text = text;
    }
    tokenize() {
        const tokens = [];
        while (this.position < this.text.length) {
            const token = this.nextToken();
            if (token.type !== TokenType.WHITESPACE) {
                tokens.push(token);
            }
        }
        tokens.push({
            type: TokenType.EOF,
            value: '',
            line: this.line,
            column: this.column,
            startOffset: this.position,
            endOffset: this.position
        });
        return tokens;
    }
    nextToken() {
        if (this.position >= this.text.length) {
            return this.createToken(TokenType.EOF, '');
        }
        const char = this.text[this.position];
        const startOffset = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        // Skip whitespace
        if (this.isWhitespace(char)) {
            return this.scanWhitespace();
        }
        // Comments
        if (char === '#' || (char === '-' && this.peek() === '-')) {
            return this.scanComment();
        }
        // String literals
        if (char === '"' || char === "'") {
            return this.scanString(char);
        }
        // Numbers
        if (this.isDigit(char)) {
            return this.scanNumber();
        }
        // Identifiers and keywords
        if (this.isAlpha(char) || char === '_') {
            return this.scanIdentifier();
        }
        // Two-character operators
        if (this.position + 1 < this.text.length) {
            const twoChar = this.text.substr(this.position, 2);
            switch (twoChar) {
                case '==': return this.createTokenAndAdvance(TokenType.EQUALS, twoChar, 2);
                case '!=': return this.createTokenAndAdvance(TokenType.NOT_EQUALS, twoChar, 2);
                case '<=': return this.createTokenAndAdvance(TokenType.LESS_EQUAL, twoChar, 2);
                case '>=': return this.createTokenAndAdvance(TokenType.GREATER_EQUAL, twoChar, 2);
            }
        }
        // Single-character tokens
        switch (char) {
            case '=': return this.createTokenAndAdvance(TokenType.ASSIGN, char);
            case '<': return this.createTokenAndAdvance(TokenType.LESS_THAN, char);
            case '>': return this.createTokenAndAdvance(TokenType.GREATER_THAN, char);
            case ';': return this.createTokenAndAdvance(TokenType.SEMICOLON, char);
            case ',': return this.createTokenAndAdvance(TokenType.COMMA, char);
            case '.': return this.createTokenAndAdvance(TokenType.DOT, char);
            case '(': return this.createTokenAndAdvance(TokenType.LPAREN, char);
            case ')': return this.createTokenAndAdvance(TokenType.RPAREN, char);
            case '{': return this.createTokenAndAdvance(TokenType.LBRACE, char);
            case '}': return this.createTokenAndAdvance(TokenType.RBRACE, char);
            case '\n':
                this.advance();
                this.line++;
                this.column = 1;
                return this.createToken(TokenType.NEWLINE, char, startOffset, startLine, startColumn);
            default:
                return this.createTokenAndAdvance(TokenType.UNKNOWN, char);
        }
    }
    scanWhitespace() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        while (this.position < this.text.length && this.isWhitespace(this.text[this.position]) && this.text[this.position] !== '\n') {
            this.advance();
        }
        return this.createToken(TokenType.WHITESPACE, this.text.substring(start, this.position), start, startLine, startColumn);
    }
    scanComment() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        // Skip comment characters
        if (this.text[this.position] === '#') {
            this.advance();
        }
        else if (this.text[this.position] === '-' && this.peek() === '-') {
            this.advance();
            this.advance();
        }
        // Read until end of line
        while (this.position < this.text.length && this.text[this.position] !== '\n') {
            this.advance();
        }
        return this.createToken(TokenType.COMMENT, this.text.substring(start, this.position), start, startLine, startColumn);
    }
    scanString(quote) {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        this.advance(); // Skip opening quote
        while (this.position < this.text.length && this.text[this.position] !== quote) {
            if (this.text[this.position] === '\\') {
                this.advance(); // Skip escape character
            }
            this.advance();
        }
        if (this.position < this.text.length) {
            this.advance(); // Skip closing quote
        }
        return this.createToken(TokenType.STRING_LITERAL, this.text.substring(start, this.position), start, startLine, startColumn);
    }
    scanNumber() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        while (this.position < this.text.length && (this.isDigit(this.text[this.position]) || this.text[this.position] === '.')) {
            this.advance();
        }
        return this.createToken(TokenType.NUMBER_LITERAL, this.text.substring(start, this.position), start, startLine, startColumn);
    }
    scanIdentifier() {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        while (this.position < this.text.length && (this.isAlphaNumeric(this.text[this.position]) || this.text[this.position] === '_')) {
            this.advance();
        }
        const value = this.text.substring(start, this.position);
        const type = this.keywords.get(value.toUpperCase()) || TokenType.IDENTIFIER;
        return this.createToken(type, value, start, startLine, startColumn);
    }
    createTokenAndAdvance(type, value, count = 1) {
        const start = this.position;
        const startLine = this.line;
        const startColumn = this.column;
        for (let i = 0; i < count; i++) {
            this.advance();
        }
        return this.createToken(type, value, start, startLine, startColumn);
    }
    createToken(type, value, startOffset, line, column) {
        return {
            type,
            value,
            line: line || this.line,
            column: column || this.column,
            startOffset: startOffset !== undefined ? startOffset : this.position,
            endOffset: this.position
        };
    }
    advance() {
        this.position++;
        this.column++;
    }
    peek() {
        if (this.position + 1 >= this.text.length) {
            return '';
        }
        return this.text[this.position + 1];
    }
    isWhitespace(char) {
        return /\s/.test(char);
    }
    isDigit(char) {
        return /\d/.test(char);
    }
    isAlpha(char) {
        return /[a-zA-Z]/.test(char);
    }
    isAlphaNumeric(char) {
        return /[a-zA-Z0-9]/.test(char);
    }
}
exports.FourGLLexer = FourGLLexer;
//# sourceMappingURL=lexer.js.map