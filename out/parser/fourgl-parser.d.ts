import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic, Range } from 'vscode-languageserver/node';
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
    name?: string;
    value?: string | number;
    dataType?: 'string' | 'number';
    left?: ExpressionNode;
    operator?: string;
    right?: ExpressionNode;
    functionName?: string;
    arguments?: ExpressionNode[];
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
export declare class FourGLParser {
    private tokens;
    private current;
    private diagnostics;
    parse(document: TextDocument): {
        ast: ASTNode[];
        diagnostics: Diagnostic[];
    };
    private parseTopLevelDeclaration;
    private parseFunction;
    private parseProcedure;
    private parseParameterList;
    private parseDataType;
    private parseStatementBlock;
    private parseStatement;
    private parseDefine;
    private parseLet;
    private parseIf;
    private parseWhile;
    private parseFor;
    private parseCall;
    private parseReturn;
    private parseSqlStatement;
    private parseExpression;
    private parseOrExpression;
    private parseAndExpression;
    private parseEqualityExpression;
    private parseComparisonExpression;
    private parsePrimaryExpression;
    private parseArgumentList;
    private match;
    private check;
    private advance;
    private isAtEnd;
    private peek;
    private previous;
    private consume;
    private skipWhitespaceAndComments;
    private isBlockEnd;
    private synchronize;
    private addError;
    private createRange;
}
//# sourceMappingURL=fourgl-parser.d.ts.map