import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver/node';
import { FourGLLexer, Token, TokenType } from './lexer';

export interface ASTNode {
  type: string;
  range: Range;
  children?: ASTNode[];
}

export interface FunctionNode extends ASTNode {
  type: 'function';
  name: string;
  parameters: ParameterNode[];
  returnType?: string;
  body: StatementNode[];
}

export interface ProcedureNode extends ASTNode {
  type: 'procedure';
  name: string;
  parameters: ParameterNode[];
  body: StatementNode[];
}

export interface ParameterNode extends ASTNode {
  type: 'parameter';
  name: string;
  dataType: string;
}

export interface StatementNode extends ASTNode {
  type: 'statement' | 'define' | 'let' | 'if' | 'while' | 'for' | 'call' | 'return' | 'select' | 'insert' | 'update' | 'delete';
}

export interface DefineNode extends StatementNode {
  type: 'define';
  variables: VariableDeclaration[];
}

export interface VariableDeclaration {
  name: string;
  dataType: string;
  range: Range;
}

export interface LetNode extends StatementNode {
  type: 'let';
  variable: string;
  expression: ExpressionNode;
}

export interface ExpressionNode extends ASTNode {
  type: 'expression' | 'identifier' | 'literal' | 'binary' | 'call';
  // Properties for different expression types
  name?: string; // for identifier
  value?: string | number; // for literal
  dataType?: 'string' | 'number'; // for literal
  left?: ExpressionNode; // for binary
  operator?: string; // for binary
  right?: ExpressionNode; // for binary
  functionName?: string; // for call
  arguments?: ExpressionNode[]; // for call
}

export interface IdentifierNode extends ExpressionNode {
  type: 'identifier';
  name: string;
}

export interface LiteralNode extends ExpressionNode {
  type: 'literal';
  value: string | number;
  dataType: 'string' | 'number';
}

export interface BinaryExpressionNode extends ExpressionNode {
  type: 'binary';
  left: ExpressionNode;
  operator: string;
  right: ExpressionNode;
}

export interface CallNode extends ExpressionNode {
  type: 'call';
  functionName: string;
  arguments: ExpressionNode[];
}

export class FourGLParser {
  private tokens: Token[] = [];
  private current = 0;
  private diagnostics: Diagnostic[] = [];

  parse(document: TextDocument): { ast: ASTNode[], diagnostics: Diagnostic[] } {
    const lexer = new FourGLLexer(document.getText());
    this.tokens = lexer.tokenize();
    this.current = 0;
    this.diagnostics = [];

    const ast: ASTNode[] = [];

    try {
      while (!this.isAtEnd()) {
        const node = this.parseTopLevelDeclaration();
        if (node) {
          ast.push(node);
        }
      }
    } catch (error) {
      // Error handling is done through diagnostics
    }

    return { ast, diagnostics: this.diagnostics };
  }

  private parseTopLevelDeclaration(): ASTNode | null {
    try {
      // Skip newlines and comments
      this.skipWhitespaceAndComments();

      if (this.isAtEnd()) {
        return null;
      }

      const token = this.peek();
      
      switch (token.type) {
        case TokenType.FUNCTION:
          return this.parseFunction();
        case TokenType.PROCEDURE:
          return this.parseProcedure();
        case TokenType.DEFINE:
          return this.parseDefine();
        default:
          return this.parseStatement();
      }
    } catch (error) {
      this.addError(`Unexpected error parsing top-level declaration: ${error}`, this.peek());
      this.synchronize();
      return null;
    }
  }

  private parseFunction(): FunctionNode {
    const startToken = this.consume(TokenType.FUNCTION, "Expected 'FUNCTION'");
    const nameToken = this.consume(TokenType.IDENTIFIER, "Expected function name");
    
    this.consume(TokenType.LPAREN, "Expected '(' after function name");
    const parameters = this.parseParameterList();
    this.consume(TokenType.RPAREN, "Expected ')' after parameters");

    // Optional return type
    let returnType: string | undefined;
    if (this.check(TokenType.IDENTIFIER)) {
      const returnToken = this.advance();
      if (returnToken.value.toUpperCase() === 'RETURNING') {
        const typeToken = this.consume(TokenType.IDENTIFIER, "Expected return type");
        returnType = typeToken.value;
      }
    }

    const body = this.parseStatementBlock();
    
    this.consume(TokenType.IDENTIFIER, "Expected 'END' or 'ENDFUNCTION'");

    return {
      type: 'function',
      name: nameToken.value,
      parameters,
      returnType,
      body,
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseProcedure(): ProcedureNode {
    const startToken = this.consume(TokenType.PROCEDURE, "Expected 'PROCEDURE'");
    const nameToken = this.consume(TokenType.IDENTIFIER, "Expected procedure name");
    
    this.consume(TokenType.LPAREN, "Expected '(' after procedure name");
    const parameters = this.parseParameterList();
    this.consume(TokenType.RPAREN, "Expected ')' after parameters");

    const body = this.parseStatementBlock();
    
    this.consume(TokenType.IDENTIFIER, "Expected 'END' or 'ENDPROCEDURE'");

    return {
      type: 'procedure',
      name: nameToken.value,
      parameters,
      body,
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseParameterList(): ParameterNode[] {
    const parameters: ParameterNode[] = [];

    if (!this.check(TokenType.RPAREN)) {
      do {
        const nameToken = this.consume(TokenType.IDENTIFIER, "Expected parameter name");
        const dataType = this.parseDataType();
        
        parameters.push({
          type: 'parameter',
          name: nameToken.value,
          dataType,
          range: this.createRange(nameToken, this.previous())
        });
      } while (this.match(TokenType.COMMA));
    }

    return parameters;
  }

  private parseDataType(): string {
    if (this.match(TokenType.INTEGER, TokenType.DECIMAL, TokenType.CHAR, TokenType.VARCHAR, TokenType.DATE, TokenType.DATETIME)) {
      return this.previous().value;
    }
    
    if (this.check(TokenType.IDENTIFIER)) {
      return this.advance().value;
    }

    this.addError("Expected data type", this.peek());
    return "UNKNOWN";
  }

  private parseStatementBlock(): StatementNode[] {
    const statements: StatementNode[] = [];

    while (!this.isAtEnd() && !this.isBlockEnd()) {
      this.skipWhitespaceAndComments();
      
      if (this.isAtEnd() || this.isBlockEnd()) {
        break;
      }

      const statement = this.parseStatement();
      if (statement) {
        statements.push(statement);
      }
    }

    return statements;
  }

  private parseStatement(): StatementNode | null {
    try {
      this.skipWhitespaceAndComments();

      if (this.isAtEnd()) {
        return null;
      }

      const token = this.peek();

      switch (token.type) {
        case TokenType.DEFINE:
          return this.parseDefine();
        case TokenType.LET:
          return this.parseLet();
        case TokenType.IF:
          return this.parseIf();
        case TokenType.WHILE:
          return this.parseWhile();
        case TokenType.FOR:
          return this.parseFor();
        case TokenType.CALL:
          return this.parseCall();
        case TokenType.RETURN:
          return this.parseReturn();
        case TokenType.SELECT:
        case TokenType.INSERT:
        case TokenType.UPDATE:
        case TokenType.DELETE:
          return this.parseSqlStatement();
        default:
          // Try to parse as expression statement
          const expr = this.parseExpression();
          if (expr) {
            return {
              type: 'statement',
              range: expr.range
            };
          }
          return null;
      }
    } catch (error) {
      this.synchronize();
      return null;
    }
  }

  private parseDefine(): DefineNode {
    const startToken = this.consume(TokenType.DEFINE, "Expected 'DEFINE'");
    const variables: VariableDeclaration[] = [];

    do {
      const nameToken = this.consume(TokenType.IDENTIFIER, "Expected variable name");
      const dataType = this.parseDataType();
      
      variables.push({
        name: nameToken.value,
        dataType,
        range: this.createRange(nameToken, this.previous())
      });
    } while (this.match(TokenType.COMMA));

    return {
      type: 'define',
      variables,
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseLet(): LetNode {
    const startToken = this.consume(TokenType.LET, "Expected 'LET'");
    const variableToken = this.consume(TokenType.IDENTIFIER, "Expected variable name");
    this.consume(TokenType.ASSIGN, "Expected '=' after variable");
    const expression = this.parseExpression();

    return {
      type: 'let',
      variable: variableToken.value,
      expression,
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseIf(): StatementNode {
    const startToken = this.consume(TokenType.IF, "Expected 'IF'");
    const condition = this.parseExpression();
    this.consume(TokenType.THEN, "Expected 'THEN' after condition");
    
    const thenBody = this.parseStatementBlock();
    let elseBody: StatementNode[] = [];

    if (this.match(TokenType.ELSE)) {
      elseBody = this.parseStatementBlock();
    }

    this.consume(TokenType.ENDIF, "Expected 'ENDIF'");

    return {
      type: 'if',
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseWhile(): StatementNode {
    const startToken = this.consume(TokenType.WHILE, "Expected 'WHILE'");
    const condition = this.parseExpression();
    const body = this.parseStatementBlock();
    this.consume(TokenType.ENDWHILE, "Expected 'ENDWHILE'");

    return {
      type: 'while',
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseFor(): StatementNode {
    const startToken = this.consume(TokenType.FOR, "Expected 'FOR'");
    // For loop parsing would be more complex in a real implementation
    const body = this.parseStatementBlock();
    this.consume(TokenType.ENDFOR, "Expected 'ENDFOR'");

    return {
      type: 'for',
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseCall(): StatementNode {
    const startToken = this.consume(TokenType.CALL, "Expected 'CALL'");
    const nameToken = this.consume(TokenType.IDENTIFIER, "Expected function name");
    
    if (this.match(TokenType.LPAREN)) {
      this.parseArgumentList();
      this.consume(TokenType.RPAREN, "Expected ')' after arguments");
    }

    return {
      type: 'call',
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseReturn(): StatementNode {
    const startToken = this.consume(TokenType.RETURN, "Expected 'RETURN'");
    
    if (!this.check(TokenType.NEWLINE) && !this.isAtEnd()) {
      this.parseExpression();
    }

    return {
      type: 'return',
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseSqlStatement(): StatementNode {
    const startToken = this.advance(); // SELECT, INSERT, UPDATE, DELETE
    
    // Simple SQL statement parsing - would be more complex in real implementation
    while (!this.check(TokenType.NEWLINE) && !this.isAtEnd() && !this.check(TokenType.SEMICOLON)) {
      this.advance();
    }

    return {
      type: startToken.value.toLowerCase() as any,
      range: this.createRange(startToken, this.previous())
    };
  }

  private parseExpression(): ExpressionNode {
    return this.parseOrExpression();
  }

  private parseOrExpression(): ExpressionNode {
    let expr = this.parseAndExpression();

    while (this.match(TokenType.OR)) {
      const operator = this.previous().value;
      const right = this.parseAndExpression();
      expr = {
        type: 'binary',
        left: expr,
        operator,
        right,
        range: this.createRange(this.previous(), this.previous()) // Simplified
      };
    }

    return expr;
  }

  private parseAndExpression(): ExpressionNode {
    let expr = this.parseEqualityExpression();

    while (this.match(TokenType.AND)) {
      const operator = this.previous().value;
      const right = this.parseEqualityExpression();
      expr = {
        type: 'binary',
        left: expr,
        operator,
        right,
        range: this.createRange(this.previous(), this.previous()) // Simplified
      };
    }

    return expr;
  }

  private parseEqualityExpression(): ExpressionNode {
    let expr = this.parseComparisonExpression();

    while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS)) {
      const operator = this.previous().value;
      const right = this.parseComparisonExpression();
      expr = {
        type: 'binary',
        left: expr,
        operator,
        right,
        range: this.createRange(this.previous(), this.previous()) // Simplified
      };
    }

    return expr;
  }

  private parseComparisonExpression(): ExpressionNode {
    let expr = this.parsePrimaryExpression();

    while (this.match(TokenType.LESS_THAN, TokenType.GREATER_THAN, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
      const operator = this.previous().value;
      const right = this.parsePrimaryExpression();
      expr = {
        type: 'binary',
        left: expr,
        operator,
        right,
        range: this.createRange(this.previous(), this.previous()) // Simplified
      };
    }

    return expr;
  }

  private parsePrimaryExpression(): ExpressionNode {
    if (this.match(TokenType.STRING_LITERAL)) {
      const token = this.previous();
      return {
        type: 'literal',
        value: token.value,
        dataType: 'string',
        range: this.createRange(token, token)
      };
    }

    if (this.match(TokenType.NUMBER_LITERAL)) {
      const token = this.previous();
      return {
        type: 'literal',
        value: parseFloat(token.value),
        dataType: 'number',
        range: this.createRange(token, token)
      };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      
      // Check for function call
      if (this.match(TokenType.LPAREN)) {
        const args = this.parseArgumentList();
        this.consume(TokenType.RPAREN, "Expected ')' after arguments");
        
        return {
          type: 'call',
          functionName: token.value,
          arguments: args,
          range: this.createRange(token, this.previous())
        };
      }

      return {
        type: 'identifier',
        name: token.value,
        range: this.createRange(token, token)
      };
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')' after expression");
      return expr;
    }

    this.addError("Expected expression", this.peek());
    return {
      type: 'identifier',
      name: 'ERROR',
      range: this.createRange(this.peek(), this.peek())
    };
  }

  private parseArgumentList(): ExpressionNode[] {
    const args: ExpressionNode[] = [];

    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    return args;
  }

  // Utility methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    if (this.current >= this.tokens.length) {
      return {
        type: TokenType.EOF,
        value: '',
        line: 1,
        column: 1,
        startOffset: 0,
        endOffset: 0
      };
    }
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();

    this.addError(message, this.peek());
    return this.peek();
  }

  private skipWhitespaceAndComments(): void {
    while (this.match(TokenType.WHITESPACE, TokenType.NEWLINE, TokenType.COMMENT)) {
      // Just skip
    }
  }

  private isBlockEnd(): boolean {
    const token = this.peek();
    if (token.type === TokenType.IDENTIFIER) {
      const value = token.value.toUpperCase();
      return value === 'END' || value === 'ENDFUNCTION' || value === 'ENDPROCEDURE' || 
             value === 'ENDIF' || value === 'ENDWHILE' || value === 'ENDFOR';
    }
    return false;
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.FUNCTION:
        case TokenType.PROCEDURE:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.FOR:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }

  private addError(message: string, token: Token): void {
    this.diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: this.createRange(token, token),
      message,
      source: '4gl-parser'
    });
  }

  private createRange(start: Token, end: Token): Range {
    return {
      start: { line: start.line - 1, character: start.column - 1 },
      end: { line: end.line - 1, character: end.column - 1 + end.value.length }
    };
  }
}
