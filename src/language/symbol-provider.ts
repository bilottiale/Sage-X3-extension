import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position, Range } from 'vscode-languageserver/node';
import { FourGLParser, ASTNode, FunctionNode, ProcedureNode, VariableDeclaration } from '../parser/fourgl-parser';

export interface Symbol {
  name: string;
  type: 'function' | 'procedure' | 'variable' | 'parameter';
  dataType?: string;
  range: Range;
  documentUri: string;
  detail?: string;
}

export class FourGLSymbolProvider {
  private symbols: Map<string, Symbol[]> = new Map();
  private parser = new FourGLParser();

  updateDocument(document: TextDocument): void {
    const uri = document.uri;
    const { ast } = this.parser.parse(document);
    
    const documentSymbols: Symbol[] = [];
    this.extractSymbols(ast, documentSymbols, uri);
    
    this.symbols.set(uri, documentSymbols);
  }

  getSymbolsInDocument(uri: string): Symbol[] {
    return this.symbols.get(uri) || [];
  }

  getAllSymbols(): Symbol[] {
    const allSymbols: Symbol[] = [];
    for (const symbols of this.symbols.values()) {
      allSymbols.push(...symbols);
    }
    return allSymbols;
  }

  findSymbolAt(document: TextDocument, position: Position): Symbol | undefined {
    const symbols = this.getSymbolsInDocument(document.uri);
    
    for (const symbol of symbols) {
      if (this.isPositionInRange(position, symbol.range)) {
        return symbol;
      }
    }
    
    return undefined;
  }

  findSymbolByName(name: string, type?: string): Symbol[] {
    const allSymbols = this.getAllSymbols();
    return allSymbols.filter(symbol => 
      symbol.name === name && (!type || symbol.type === type)
    );
  }

  getVariablesInScope(document: TextDocument, position: Position): Symbol[] {
    const symbols = this.getSymbolsInDocument(document.uri);
    
    // Find the function/procedure containing the position
    const containingFunction = symbols.find(symbol => 
      (symbol.type === 'function' || symbol.type === 'procedure') &&
      this.isPositionInRange(position, symbol.range)
    );

    if (containingFunction) {
      // Return variables and parameters in the same function
      return symbols.filter(symbol => 
        (symbol.type === 'variable' || symbol.type === 'parameter') &&
        this.isPositionInRange(position, symbol.range)
      );
    }

    // Return global variables
    return symbols.filter(symbol => symbol.type === 'variable');
  }

  getFunctions(): Symbol[] {
    return this.getAllSymbols().filter(symbol => symbol.type === 'function');
  }

  getProcedures(): Symbol[] {
    return this.getAllSymbols().filter(symbol => symbol.type === 'procedure');
  }

  private extractSymbols(nodes: ASTNode[], symbols: Symbol[], documentUri: string): void {
    for (const node of nodes) {
      this.extractSymbolsFromNode(node, symbols, documentUri);
    }
  }

  private extractSymbolsFromNode(node: ASTNode, symbols: Symbol[], documentUri: string): void {
    switch (node.type) {
      case 'function':
        const funcNode = node as FunctionNode;
        symbols.push({
          name: funcNode.name,
          type: 'function',
          dataType: funcNode.returnType,
          range: funcNode.range,
          documentUri,
          detail: `function ${funcNode.name}(${funcNode.parameters.map(p => `${p.name}: ${p.dataType}`).join(', ')})${funcNode.returnType ? `: ${funcNode.returnType}` : ''}`
        });

        // Add parameters
        for (const param of funcNode.parameters) {
          symbols.push({
            name: param.name,
            type: 'parameter',
            dataType: param.dataType,
            range: param.range,
            documentUri,
            detail: `parameter ${param.name}: ${param.dataType}`
          });
        }

        // Extract symbols from function body
        this.extractSymbols(funcNode.body, symbols, documentUri);
        break;

      case 'procedure':
        const procNode = node as ProcedureNode;
        symbols.push({
          name: procNode.name,
          type: 'procedure',
          range: procNode.range,
          documentUri,
          detail: `procedure ${procNode.name}(${procNode.parameters.map(p => `${p.name}: ${p.dataType}`).join(', ')})`
        });

        // Add parameters
        for (const param of procNode.parameters) {
          symbols.push({
            name: param.name,
            type: 'parameter',
            dataType: param.dataType,
            range: param.range,
            documentUri,
            detail: `parameter ${param.name}: ${param.dataType}`
          });
        }

        // Extract symbols from procedure body
        this.extractSymbols(procNode.body, symbols, documentUri);
        break;

      case 'define':
        const defineNode = node as any; // DefineNode
        if (defineNode.variables) {
          for (const variable of defineNode.variables as VariableDeclaration[]) {
            symbols.push({
              name: variable.name,
              type: 'variable',
              dataType: variable.dataType,
              range: variable.range,
              documentUri,
              detail: `variable ${variable.name}: ${variable.dataType}`
            });
          }
        }
        break;

      default:
        // Recursively process child nodes
        if (node.children) {
          this.extractSymbols(node.children, symbols, documentUri);
        }
        break;
    }
  }

  private isPositionInRange(position: Position, range: Range): boolean {
    if (position.line < range.start.line || position.line > range.end.line) {
      return false;
    }
    
    if (position.line === range.start.line && position.character < range.start.character) {
      return false;
    }
    
    if (position.line === range.end.line && position.character > range.end.character) {
      return false;
    }
    
    return true;
  }
}
