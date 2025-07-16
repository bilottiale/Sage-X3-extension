"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourGLParser = void 0;
const node_1 = require("vscode-languageserver/node");
const lexer_1 = require("./lexer");
class FourGLParser {
    constructor() {
        this.tokens = [];
        this.current = 0;
        this.diagnostics = [];
    }
    parse(document) {
        const lexer = new lexer_1.FourGLLexer(document.getText());
        this.tokens = lexer.tokenize();
        this.current = 0;
        this.diagnostics = [];
        const ast = [];
        try {
            while (!this.isAtEnd()) {
                const node = this.parseTopLevelDeclaration();
                if (node) {
                    ast.push(node);
                }
            }
        }
        catch (error) {
            // Error handling is done through diagnostics
        }
        return { ast, diagnostics: this.diagnostics };
    }
    parseTopLevelDeclaration() {
        try {
            // Skip newlines and comments
            this.skipWhitespaceAndComments();
            if (this.isAtEnd()) {
                return null;
            }
            const token = this.peek();
            switch (token.type) {
                case lexer_1.TokenType.FUNCTION:
                    return this.parseFunction();
                case lexer_1.TokenType.PROCEDURE:
                    return this.parseProcedure();
                case lexer_1.TokenType.DEFINE:
                    return this.parseDefine();
                default:
                    return this.parseStatement();
            }
        }
        catch (error) {
            this.addError(`Unexpected error parsing top-level declaration: ${error}`, this.peek());
            this.synchronize();
            return null;
        }
    }
    parseFunction() {
        const startToken = this.consume(lexer_1.TokenType.FUNCTION, "Expected 'FUNCTION'");
        const nameToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected function name");
        this.consume(lexer_1.TokenType.LPAREN, "Expected '(' after function name");
        const parameters = this.parseParameterList();
        this.consume(lexer_1.TokenType.RPAREN, "Expected ')' after parameters");
        // Optional return type
        let returnType;
        if (this.check(lexer_1.TokenType.IDENTIFIER)) {
            const returnToken = this.advance();
            if (returnToken.value.toUpperCase() === 'RETURNING') {
                const typeToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected return type");
                returnType = typeToken.value;
            }
        }
        const body = this.parseStatementBlock();
        this.consume(lexer_1.TokenType.IDENTIFIER, "Expected 'END' or 'ENDFUNCTION'");
        return {
            type: 'function',
            name: nameToken.value,
            parameters,
            returnType,
            body,
            range: this.createRange(startToken, this.previous())
        };
    }
    parseProcedure() {
        const startToken = this.consume(lexer_1.TokenType.PROCEDURE, "Expected 'PROCEDURE'");
        const nameToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected procedure name");
        this.consume(lexer_1.TokenType.LPAREN, "Expected '(' after procedure name");
        const parameters = this.parseParameterList();
        this.consume(lexer_1.TokenType.RPAREN, "Expected ')' after parameters");
        const body = this.parseStatementBlock();
        this.consume(lexer_1.TokenType.IDENTIFIER, "Expected 'END' or 'ENDPROCEDURE'");
        return {
            type: 'procedure',
            name: nameToken.value,
            parameters,
            body,
            range: this.createRange(startToken, this.previous())
        };
    }
    parseParameterList() {
        const parameters = [];
        if (!this.check(lexer_1.TokenType.RPAREN)) {
            do {
                const nameToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected parameter name");
                const dataType = this.parseDataType();
                parameters.push({
                    type: 'parameter',
                    name: nameToken.value,
                    dataType,
                    range: this.createRange(nameToken, this.previous())
                });
            } while (this.match(lexer_1.TokenType.COMMA));
        }
        return parameters;
    }
    parseDataType() {
        if (this.match(lexer_1.TokenType.INTEGER, lexer_1.TokenType.DECIMAL, lexer_1.TokenType.CHAR, lexer_1.TokenType.VARCHAR, lexer_1.TokenType.DATE, lexer_1.TokenType.DATETIME)) {
            return this.previous().value;
        }
        if (this.check(lexer_1.TokenType.IDENTIFIER)) {
            return this.advance().value;
        }
        this.addError("Expected data type", this.peek());
        return "UNKNOWN";
    }
    parseStatementBlock() {
        const statements = [];
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
    parseStatement() {
        try {
            this.skipWhitespaceAndComments();
            if (this.isAtEnd()) {
                return null;
            }
            const token = this.peek();
            switch (token.type) {
                case lexer_1.TokenType.DEFINE:
                    return this.parseDefine();
                case lexer_1.TokenType.LET:
                    return this.parseLet();
                case lexer_1.TokenType.IF:
                    return this.parseIf();
                case lexer_1.TokenType.WHILE:
                    return this.parseWhile();
                case lexer_1.TokenType.FOR:
                    return this.parseFor();
                case lexer_1.TokenType.CALL:
                    return this.parseCall();
                case lexer_1.TokenType.RETURN:
                    return this.parseReturn();
                case lexer_1.TokenType.SELECT:
                case lexer_1.TokenType.INSERT:
                case lexer_1.TokenType.UPDATE:
                case lexer_1.TokenType.DELETE:
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
        }
        catch (error) {
            this.synchronize();
            return null;
        }
    }
    parseDefine() {
        const startToken = this.consume(lexer_1.TokenType.DEFINE, "Expected 'DEFINE'");
        const variables = [];
        do {
            const nameToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected variable name");
            const dataType = this.parseDataType();
            variables.push({
                name: nameToken.value,
                dataType,
                range: this.createRange(nameToken, this.previous())
            });
        } while (this.match(lexer_1.TokenType.COMMA));
        return {
            type: 'define',
            variables,
            range: this.createRange(startToken, this.previous())
        };
    }
    parseLet() {
        const startToken = this.consume(lexer_1.TokenType.LET, "Expected 'LET'");
        const variableToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected variable name");
        this.consume(lexer_1.TokenType.ASSIGN, "Expected '=' after variable");
        const expression = this.parseExpression();
        return {
            type: 'let',
            variable: variableToken.value,
            expression,
            range: this.createRange(startToken, this.previous())
        };
    }
    parseIf() {
        const startToken = this.consume(lexer_1.TokenType.IF, "Expected 'IF'");
        const condition = this.parseExpression();
        this.consume(lexer_1.TokenType.THEN, "Expected 'THEN' after condition");
        const thenBody = this.parseStatementBlock();
        let elseBody = [];
        if (this.match(lexer_1.TokenType.ELSE)) {
            elseBody = this.parseStatementBlock();
        }
        this.consume(lexer_1.TokenType.ENDIF, "Expected 'ENDIF'");
        return {
            type: 'if',
            range: this.createRange(startToken, this.previous())
        };
    }
    parseWhile() {
        const startToken = this.consume(lexer_1.TokenType.WHILE, "Expected 'WHILE'");
        const condition = this.parseExpression();
        const body = this.parseStatementBlock();
        this.consume(lexer_1.TokenType.ENDWHILE, "Expected 'ENDWHILE'");
        return {
            type: 'while',
            range: this.createRange(startToken, this.previous())
        };
    }
    parseFor() {
        const startToken = this.consume(lexer_1.TokenType.FOR, "Expected 'FOR'");
        // For loop parsing would be more complex in a real implementation
        const body = this.parseStatementBlock();
        this.consume(lexer_1.TokenType.ENDFOR, "Expected 'ENDFOR'");
        return {
            type: 'for',
            range: this.createRange(startToken, this.previous())
        };
    }
    parseCall() {
        const startToken = this.consume(lexer_1.TokenType.CALL, "Expected 'CALL'");
        const nameToken = this.consume(lexer_1.TokenType.IDENTIFIER, "Expected function name");
        if (this.match(lexer_1.TokenType.LPAREN)) {
            this.parseArgumentList();
            this.consume(lexer_1.TokenType.RPAREN, "Expected ')' after arguments");
        }
        return {
            type: 'call',
            range: this.createRange(startToken, this.previous())
        };
    }
    parseReturn() {
        const startToken = this.consume(lexer_1.TokenType.RETURN, "Expected 'RETURN'");
        if (!this.check(lexer_1.TokenType.NEWLINE) && !this.isAtEnd()) {
            this.parseExpression();
        }
        return {
            type: 'return',
            range: this.createRange(startToken, this.previous())
        };
    }
    parseSqlStatement() {
        const startToken = this.advance(); // SELECT, INSERT, UPDATE, DELETE
        // Simple SQL statement parsing - would be more complex in real implementation
        while (!this.check(lexer_1.TokenType.NEWLINE) && !this.isAtEnd() && !this.check(lexer_1.TokenType.SEMICOLON)) {
            this.advance();
        }
        return {
            type: startToken.value.toLowerCase(),
            range: this.createRange(startToken, this.previous())
        };
    }
    parseExpression() {
        return this.parseOrExpression();
    }
    parseOrExpression() {
        let expr = this.parseAndExpression();
        while (this.match(lexer_1.TokenType.OR)) {
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
    parseAndExpression() {
        let expr = this.parseEqualityExpression();
        while (this.match(lexer_1.TokenType.AND)) {
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
    parseEqualityExpression() {
        let expr = this.parseComparisonExpression();
        while (this.match(lexer_1.TokenType.EQUALS, lexer_1.TokenType.NOT_EQUALS)) {
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
    parseComparisonExpression() {
        let expr = this.parsePrimaryExpression();
        while (this.match(lexer_1.TokenType.LESS_THAN, lexer_1.TokenType.GREATER_THAN, lexer_1.TokenType.LESS_EQUAL, lexer_1.TokenType.GREATER_EQUAL)) {
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
    parsePrimaryExpression() {
        if (this.match(lexer_1.TokenType.STRING_LITERAL)) {
            const token = this.previous();
            return {
                type: 'literal',
                value: token.value,
                dataType: 'string',
                range: this.createRange(token, token)
            };
        }
        if (this.match(lexer_1.TokenType.NUMBER_LITERAL)) {
            const token = this.previous();
            return {
                type: 'literal',
                value: parseFloat(token.value),
                dataType: 'number',
                range: this.createRange(token, token)
            };
        }
        if (this.match(lexer_1.TokenType.IDENTIFIER)) {
            const token = this.previous();
            // Check for function call
            if (this.match(lexer_1.TokenType.LPAREN)) {
                const args = this.parseArgumentList();
                this.consume(lexer_1.TokenType.RPAREN, "Expected ')' after arguments");
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
        if (this.match(lexer_1.TokenType.LPAREN)) {
            const expr = this.parseExpression();
            this.consume(lexer_1.TokenType.RPAREN, "Expected ')' after expression");
            return expr;
        }
        this.addError("Expected expression", this.peek());
        return {
            type: 'identifier',
            name: 'ERROR',
            range: this.createRange(this.peek(), this.peek())
        };
    }
    parseArgumentList() {
        const args = [];
        if (!this.check(lexer_1.TokenType.RPAREN)) {
            do {
                args.push(this.parseExpression());
            } while (this.match(lexer_1.TokenType.COMMA));
        }
        return args;
    }
    // Utility methods
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    isAtEnd() {
        return this.current >= this.tokens.length || this.peek().type === lexer_1.TokenType.EOF;
    }
    peek() {
        if (this.current >= this.tokens.length) {
            return {
                type: lexer_1.TokenType.EOF,
                value: '',
                line: 1,
                column: 1,
                startOffset: 0,
                endOffset: 0
            };
        }
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    consume(type, message) {
        if (this.check(type))
            return this.advance();
        this.addError(message, this.peek());
        return this.peek();
    }
    skipWhitespaceAndComments() {
        while (this.match(lexer_1.TokenType.WHITESPACE, lexer_1.TokenType.NEWLINE, lexer_1.TokenType.COMMENT)) {
            // Just skip
        }
    }
    isBlockEnd() {
        const token = this.peek();
        if (token.type === lexer_1.TokenType.IDENTIFIER) {
            const value = token.value.toUpperCase();
            return value === 'END' || value === 'ENDFUNCTION' || value === 'ENDPROCEDURE' ||
                value === 'ENDIF' || value === 'ENDWHILE' || value === 'ENDFOR';
        }
        return false;
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === lexer_1.TokenType.SEMICOLON)
                return;
            switch (this.peek().type) {
                case lexer_1.TokenType.FUNCTION:
                case lexer_1.TokenType.PROCEDURE:
                case lexer_1.TokenType.IF:
                case lexer_1.TokenType.WHILE:
                case lexer_1.TokenType.FOR:
                case lexer_1.TokenType.RETURN:
                    return;
            }
            this.advance();
        }
    }
    addError(message, token) {
        this.diagnostics.push({
            severity: node_1.DiagnosticSeverity.Error,
            range: this.createRange(token, token),
            message,
            source: '4gl-parser'
        });
    }
    createRange(start, end) {
        return {
            start: { line: start.line - 1, character: start.column - 1 },
            end: { line: end.line - 1, character: end.column - 1 + end.value.length }
        };
    }
}
exports.FourGLParser = FourGLParser;
//# sourceMappingURL=fourgl-parser.js.map