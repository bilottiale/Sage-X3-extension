import { TextDocument } from 'vscode-languageserver-textdocument';
import { Hover, Position, MarkupKind } from 'vscode-languageserver/node';
import { FourGLSymbolProvider } from './symbol-provider';

export class FourGLHoverProvider {
  private builtInFunctions: Map<string, { returnType: string; description: string; syntax: string }> = new Map([
    ['TODAY', { returnType: 'DATE', description: 'Returns the current system date', syntax: 'TODAY()' }],
    ['NOW', { returnType: 'DATETIME', description: 'Returns the current system date and time', syntax: 'NOW()' }],
    ['LENGTH', { returnType: 'INTEGER', description: 'Returns the length of a string', syntax: 'LENGTH(string)' }],
    ['SUBSTR', { returnType: 'VARCHAR', description: 'Returns a substring from a string', syntax: 'SUBSTR(string, start, length)' }],
    ['UPPER', { returnType: 'VARCHAR', description: 'Converts string to uppercase', syntax: 'UPPER(string)' }],
    ['LOWER', { returnType: 'VARCHAR', description: 'Converts string to lowercase', syntax: 'LOWER(string)' }],
    ['TRIM', { returnType: 'VARCHAR', description: 'Removes leading and trailing spaces', syntax: 'TRIM(string)' }],
    ['ABS', { returnType: 'DECIMAL', description: 'Returns the absolute value of a number', syntax: 'ABS(number)' }],
    ['ROUND', { returnType: 'DECIMAL', description: 'Rounds a number to specified decimal places', syntax: 'ROUND(number, places)' }],
    ['FLOOR', { returnType: 'INTEGER', description: 'Returns the largest integer less than or equal to the number', syntax: 'FLOOR(number)' }],
    ['CEIL', { returnType: 'INTEGER', description: 'Returns the smallest integer greater than or equal to the number', syntax: 'CEIL(number)' }],
    ['ISNULL', { returnType: 'INTEGER', description: 'Returns 1 if the value is null, 0 otherwise', syntax: 'ISNULL(value)' }],
    ['NVL', { returnType: 'VARCHAR', description: 'Returns alternative value if the first value is null', syntax: 'NVL(value, alternative)' }]
  ]);

  private keywords: Map<string, string> = new Map([
    ['FUNCTION', 'Defines a user-defined function that returns a value'],
    ['PROCEDURE', 'Defines a user-defined procedure that performs actions'],
    ['DEFINE', 'Declares variables with their data types'],
    ['LET', 'Assigns a value to a variable'],
    ['IF', 'Conditional statement for branching logic'],
    ['THEN', 'Used with IF statements to specify the condition block'],
    ['ELSE', 'Specifies alternative block for IF statements'],
    ['ENDIF', 'Closes an IF statement block'],
    ['WHILE', 'Creates a loop that continues while condition is true'],
    ['ENDWHILE', 'Closes a WHILE loop block'],
    ['FOR', 'Creates a counting loop or iteration'],
    ['ENDFOR', 'Closes a FOR loop block'],
    ['RETURN', 'Returns a value from a function or exits a procedure'],
    ['CALL', 'Invokes a function or procedure'],
    ['SELECT', 'SQL statement to query data from tables'],
    ['INSERT', 'SQL statement to add new rows to a table'],
    ['UPDATE', 'SQL statement to modify existing rows in a table'],
    ['DELETE', 'SQL statement to remove rows from a table'],
    ['WHERE', 'SQL clause to specify conditions for filtering'],
    ['FROM', 'SQL clause to specify source tables'],
    ['INTO', 'SQL clause to specify target for INSERT or SELECT'],
    ['VALUES', 'SQL clause to specify values for INSERT'],
    ['INTEGER', 'Whole number data type (-2,147,483,648 to 2,147,483,647)'],
    ['DECIMAL', 'Fixed-point decimal number data type'],
    ['CHAR', 'Fixed-length character string data type'],
    ['VARCHAR', 'Variable-length character string data type'],
    ['DATE', 'Date data type (YYYY-MM-DD format)'],
    ['DATETIME', 'Date and time data type'],
    ['AND', 'Logical AND operator'],
    ['OR', 'Logical OR operator'],
    ['NOT', 'Logical NOT operator']
  ]);

  constructor(private symbolProvider: FourGLSymbolProvider) {}

  getHover(document: TextDocument, position: Position): Hover | undefined {
    const text = document.getText();
    const lines = text.split('\n');
    const line = lines[position.line] || '';
    const word = this.getWordAtPosition(line, position.character);

    if (!word) {
      return undefined;
    }

    const upperWord = word.toUpperCase();

    // Check built-in functions
    const builtInFunction = this.builtInFunctions.get(upperWord);
    if (builtInFunction) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: [
            `**${upperWord}** (Built-in Function)`,
            '',
            `**Returns:** ${builtInFunction.returnType}`,
            '',
            `**Syntax:** \`${builtInFunction.syntax}\``,
            '',
            builtInFunction.description
          ].join('\n')
        }
      };
    }

    // Check keywords
    const keywordDescription = this.keywords.get(upperWord);
    if (keywordDescription) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: [
            `**${upperWord}** (Keyword)`,
            '',
            keywordDescription
          ].join('\n')
        }
      };
    }

    // Check user-defined symbols
    const symbol = this.symbolProvider.findSymbolAt(document, position);
    if (symbol) {
      let content = `**${symbol.name}** (${symbol.type})`;
      
      if (symbol.dataType) {
        content += `\n\n**Type:** ${symbol.dataType}`;
      }

      if (symbol.detail) {
        content += `\n\n${symbol.detail}`;
      }

      // Add additional context based on symbol type
      switch (symbol.type) {
        case 'function':
          content += '\n\n*User-defined function*';
          break;
        case 'procedure':
          content += '\n\n*User-defined procedure*';
          break;
        case 'variable':
          content += '\n\n*Local variable*';
          break;
        case 'parameter':
          content += '\n\n*Function/procedure parameter*';
          break;
      }

      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: content
        }
      };
    }

    // Check for symbols with the same name in other parts of the code
    const symbolsWithSameName = this.symbolProvider.findSymbolByName(word);
    if (symbolsWithSameName.length > 0) {
      const symbol = symbolsWithSameName[0]; // Take the first match
      
      let content = `**${symbol.name}** (${symbol.type})`;
      
      if (symbol.dataType) {
        content += `\n\n**Type:** ${symbol.dataType}`;
      }

      if (symbolsWithSameName.length > 1) {
        content += `\n\n*Found ${symbolsWithSameName.length} definitions*`;
      }

      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: content
        }
      };
    }

    // Provide general help for unknown identifiers
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
      return {
        contents: {
          kind: MarkupKind.Markdown,
          value: [
            `**${word}**`,
            '',
            '*Identifier not found in current scope*',
            '',
            'This might be:',
            '- An undeclared variable',
            '- A function or procedure defined elsewhere',
            '- A table or column name',
            '- A typo in the identifier name'
          ].join('\n')
        }
      };
    }

    return undefined;
  }

  private getWordAtPosition(line: string, character: number): string {
    let start = character;
    let end = character;

    // Find start of word
    while (start > 0 && /\w/.test(line[start - 1])) {
      start--;
    }

    // Find end of word
    while (end < line.length && /\w/.test(line[end])) {
      end++;
    }

    return line.substring(start, end);
  }
}
