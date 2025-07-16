import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver/node';
import { FourGLParser } from '../parser/fourgl-parser';
export declare class FourGLDiagnosticsProvider {
    private parser;
    constructor(parser: FourGLParser);
    getDiagnostics(document: TextDocument): Diagnostic[];
    private getSemanticDiagnostics;
    private checkUndeclaredVariables;
    private checkSqlSyntax;
    private checkFormSyntax;
    private checkDataTypes;
    private checkControlFlow;
}
//# sourceMappingURL=diagnostics-provider.d.ts.map