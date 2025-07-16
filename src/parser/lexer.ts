import { TextDocument } from 'vscode-languageserver-textdocument';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  startOffset: number;
  endOffset: number;
}

export enum TokenType {
  // Keywords
  FUNCTION = 'FUNCTION',
  PROCEDURE = 'PROCEDURE', 
  FORM = 'FORM',
  REPORT = 'REPORT',
  DATABASE = 'DATABASE',
  TABLE = 'TABLE',
  SELECT = 'SELECT',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  WHERE = 'WHERE',
  FROM = 'FROM',
  INTO = 'INTO',
  VALUES = 'VALUES',
  IF = 'IF',
  THEN = 'THEN',
  ELSE = 'ELSE',
  ENDIF = 'ENDIF',
  WHILE = 'WHILE',
  FOR = 'FOR',
  ENDFOR = 'ENDFOR',
  ENDWHILE = 'ENDWHILE',
  RETURN = 'RETURN',
  CALL = 'CALL',
  DEFINE = 'DEFINE',
  LET = 'LET',
  
  // Data types
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  
  // Identifiers and literals
  IDENTIFIER = 'IDENTIFIER',
  STRING_LITERAL = 'STRING_LITERAL',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  
  // Operators
  ASSIGN = 'ASSIGN',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN = 'GREATER_THAN',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER_EQUAL = 'GREATER_EQUAL',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  
  // Punctuation
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  DOT = 'DOT',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  LBRACE = 'LBRACE',
  RBRACE = 'RBRACE',
  
  // Special
  NEWLINE = 'NEWLINE',
  WHITESPACE = 'WHITESPACE',
  COMMENT = 'COMMENT',
  EOF = 'EOF',
  UNKNOWN = 'UNKNOWN'
}

export class FourGLLexer {
  private text: string;
  private position = 0;
  private line = 1;
  private column = 1;

  // 4GL Keywords
  private keywords: Map<string, TokenType> = new Map([
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

  constructor(text: string) {
    this.text = text;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
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

  private nextToken(): Token {
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

  private scanWhitespace(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    while (this.position < this.text.length && this.isWhitespace(this.text[this.position]) && this.text[this.position] !== '\n') {
      this.advance();
    }
    
    return this.createToken(TokenType.WHITESPACE, this.text.substring(start, this.position), start, startLine, startColumn);
  }

  private scanComment(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    // Skip comment characters
    if (this.text[this.position] === '#') {
      this.advance();
    } else if (this.text[this.position] === '-' && this.peek() === '-') {
      this.advance();
      this.advance();
    }
    
    // Read until end of line
    while (this.position < this.text.length && this.text[this.position] !== '\n') {
      this.advance();
    }
    
    return this.createToken(TokenType.COMMENT, this.text.substring(start, this.position), start, startLine, startColumn);
  }

  private scanString(quote: string): Token {
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

  private scanNumber(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    while (this.position < this.text.length && (this.isDigit(this.text[this.position]) || this.text[this.position] === '.')) {
      this.advance();
    }
    
    return this.createToken(TokenType.NUMBER_LITERAL, this.text.substring(start, this.position), start, startLine, startColumn);
  }

  private scanIdentifier(): Token {
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

  private createTokenAndAdvance(type: TokenType, value: string, count = 1): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    for (let i = 0; i < count; i++) {
      this.advance();
    }
    
    return this.createToken(type, value, start, startLine, startColumn);
  }

  private createToken(type: TokenType, value: string, startOffset?: number, line?: number, column?: number): Token {
    return {
      type,
      value,
      line: line || this.line,
      column: column || this.column,
      startOffset: startOffset !== undefined ? startOffset : this.position,
      endOffset: this.position
    };
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private peek(): string {
    if (this.position + 1 >= this.text.length) {
      return '';
    }
    return this.text[this.position + 1];
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return /[a-zA-Z0-9]/.test(char);
  }
}
