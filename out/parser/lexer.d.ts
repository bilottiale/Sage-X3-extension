export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
    startOffset: number;
    endOffset: number;
}
export declare enum TokenType {
    FUNCTION = "FUNCTION",
    PROCEDURE = "PROCEDURE",
    FORM = "FORM",
    REPORT = "REPORT",
    DATABASE = "DATABASE",
    TABLE = "TABLE",
    SELECT = "SELECT",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    WHERE = "WHERE",
    FROM = "FROM",
    INTO = "INTO",
    VALUES = "VALUES",
    IF = "IF",
    THEN = "THEN",
    ELSE = "ELSE",
    ENDIF = "ENDIF",
    WHILE = "WHILE",
    FOR = "FOR",
    ENDFOR = "ENDFOR",
    ENDWHILE = "ENDWHILE",
    RETURN = "RETURN",
    CALL = "CALL",
    DEFINE = "DEFINE",
    LET = "LET",
    INTEGER = "INTEGER",
    DECIMAL = "DECIMAL",
    CHAR = "CHAR",
    VARCHAR = "VARCHAR",
    DATE = "DATE",
    DATETIME = "DATETIME",
    IDENTIFIER = "IDENTIFIER",
    STRING_LITERAL = "STRING_LITERAL",
    NUMBER_LITERAL = "NUMBER_LITERAL",
    ASSIGN = "ASSIGN",
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    LESS_THAN = "LESS_THAN",
    GREATER_THAN = "GREATER_THAN",
    LESS_EQUAL = "LESS_EQUAL",
    GREATER_EQUAL = "GREATER_EQUAL",
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    SEMICOLON = "SEMICOLON",
    COMMA = "COMMA",
    DOT = "DOT",
    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    LBRACE = "LBRACE",
    RBRACE = "RBRACE",
    NEWLINE = "NEWLINE",
    WHITESPACE = "WHITESPACE",
    COMMENT = "COMMENT",
    EOF = "EOF",
    UNKNOWN = "UNKNOWN"
}
export declare class FourGLLexer {
    private text;
    private position;
    private line;
    private column;
    private keywords;
    constructor(text: string);
    tokenize(): Token[];
    private nextToken;
    private scanWhitespace;
    private scanComment;
    private scanString;
    private scanNumber;
    private scanIdentifier;
    private createTokenAndAdvance;
    private createToken;
    private advance;
    private peek;
    private isWhitespace;
    private isDigit;
    private isAlpha;
    private isAlphaNumeric;
}
//# sourceMappingURL=lexer.d.ts.map