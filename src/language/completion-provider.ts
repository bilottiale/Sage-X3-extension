import { TextDocument } from 'vscode-languageserver-textdocument';
import { CompletionItem, CompletionItemKind, Position } from 'vscode-languageserver/node';
import { FourGLSymbolProvider } from './symbol-provider';
import { SageX3ConnectionProvider, SageX3Config } from './sage-x3-connection';

export class FourGLCompletionProvider {
  private sageX3Connection: SageX3ConnectionProvider;
  
  // Sage X3 specific keywords with proper case
  private keywords = [
    // Data declaration keywords
    'Subprog', 'Function', 'Funprog', 'Variable', 'Local', 'Global', 'Const', 'Value',
    // Control flow keywords
    'If', 'Then', 'Else', 'Elsif', 'Endif', 'While', 'For', 'Next', 'Case', 'When', 'Default', 'Endcase',
    'Break', 'Continue', 'Repeat', 'Until', 'End', 'Return', 'Gosub',
    // Database keywords
    'Read', 'Write', 'Rewrite', 'Delete', 'First', 'Next', 'Prev', 'Last', 'Close', 'Open',
    'Trbegin', 'Trcommit', 'Trrollback', 'Commit', 'Rollback',
    // Sage X3 function calls
    'Call', 'From', 'With', 'Using', 'Affzo', 'Affiche', 'Erreur', 'Infbox', 'Onerrgo',
    // Data types
    'Char', 'Integer', 'Decimal', 'Date', 'Datetime', 'Longchar', 'Clbfile', 'Uuident',
    'Tinyint', 'Shortint', 'Float', 'Double', 'Binary',
    // Operators and logical
    'And', 'Or', 'Not', 'Mod', 'Like', 'Matches',
    // Constants
    'True', 'False', 'Null', 'Empty'
  ];

  private builtInFunctions = [
    // Sage X3 System Functions
    { name: 'GESTCRE', returnType: 'VOID', description: 'Creates system messages and logs' },
    { name: 'GESADD', returnType: 'VOID', description: 'System error handling module' },
    { name: 'AFFZO', returnType: 'VOID', description: 'Display object/field management' },
    { name: 'AFFICHE', returnType: 'VOID', description: 'Display data on screen' },
    { name: 'ERREUR', returnType: 'VOID', description: 'Display error messages' },
    { name: 'INFBOX', returnType: 'VOID', description: 'Display information box' },
    { name: 'MKSTAT', returnType: 'INTEGER', description: 'Make status code' },
    
    // Date and Time Functions
    { name: 'GDAT', returnType: 'DATE', description: 'Get current date' },
    { name: 'date$', returnType: 'DATE', description: 'Returns current system date' },
    { name: 'time$', returnType: 'CHAR', description: 'Returns current system time' },
    { name: 'datetime$', returnType: 'DATETIME', description: 'Returns current date and time' },
    
    // String Functions
    { name: 'NUM', returnType: 'DECIMAL', description: 'Convert string to number' },
    { name: 'VAL', returnType: 'DECIMAL', description: 'Convert string to numeric value' },
    { name: 'STR', returnType: 'CHAR', description: 'Convert number to string' },
    { name: 'LEFT', returnType: 'CHAR', description: 'Returns leftmost characters' },
    { name: 'RIGHT', returnType: 'CHAR', description: 'Returns rightmost characters' },
    { name: 'MID', returnType: 'CHAR', description: 'Returns middle characters' },
    { name: 'LEN', returnType: 'INTEGER', description: 'Returns length of string' },
    { name: 'UPPER', returnType: 'CHAR', description: 'Converts string to uppercase' },
    { name: 'LOWER', returnType: 'CHAR', description: 'Converts string to lowercase' },
    { name: 'TRIM', returnType: 'CHAR', description: 'Removes leading and trailing spaces' },
    { name: 'REPLACE', returnType: 'CHAR', description: 'Replace text in string' },
    
    // File Status
    { name: 'fstat', returnType: 'INTEGER', description: 'File operation status code' },
    { name: 'mess', returnType: 'CHAR', description: 'Returns system message text' }
  ];

  // Code snippets for common Sage X3 patterns
  private codeSnippets = [
    {
      label: 'subprog',
      kind: 'Snippet',
      detail: 'Sage X3 Subprogram Template',
      documentation: 'Creates a complete subprogram with parameter and local variable declarations',
      insertText: `Subprog \${1:FUNCTION_NAME}(\${2:PARAMETER1}, \${3:PARAMETER2})
Variable \${4:Char} \${2:PARAMETER1}(\${5:50})
Variable \${6:Decimal} \${3:PARAMETER2}
  Local \${7:Char} \${8:LOCAL_VAR}(\${9:100})
  Local \${10:Integer} \${11:RESULT_CODE}
  
  # Initialize
  \${11:RESULT_CODE} = 0
  \${8:LOCAL_VAR} = ""
  
  # Main logic here
  \${0}
  
End`
    },
    {
      label: 'function',
      kind: 'Snippet', 
      detail: 'Sage X3 Function Template',
      documentation: 'Creates a function with return value',
      insertText: `Function \${1:FUNCTION_NAME}(\${2:PARAMETER1}, \${3:PARAMETER2}) Returning \${4:Decimal}
Variable \${5:Char} \${2:PARAMETER1}(\${6:50})
Variable \${7:Decimal} \${3:PARAMETER2}
  Local \${8:Decimal} \${9:RESULT}
  
  # Function logic
  \${9:RESULT} = 0
  \${0}
  
  Return \${9:RESULT}
End`
    },
    {
      label: 'read-record',
      kind: 'Snippet',
      detail: 'Database Read with Error Handling',
      documentation: 'Read a database record with proper error checking',
      insertText: `Read [\${1:TABLE_NAME}]\${2:KEY_FIELD} = \${3:KEY_VALUE}
If fstat <> 0
  GERROR = 1
  Call GESTCRE From GESADD With "\${4:MODULE_NAME}", "\${1:TABLE_NAME} not found: " + \${3:KEY_VALUE}, 1
  Return
Endif

# Process the record
\${0}`
    },
    {
      label: 'write-record',
      kind: 'Snippet',
      detail: 'Database Write with Transaction',
      documentation: 'Write a new database record with transaction management',
      insertText: `Trbegin \${1:TABLE_NAME}

\${1:TABLE_NAME}.\${2:FIELD1} = \${3:VALUE1}
\${1:TABLE_NAME}.\${4:FIELD2} = \${5:VALUE2}
\${1:TABLE_NAME}.\${6:CREUSER} = GUSER
\${1:TABLE_NAME}.\${7:CREDAT} = date$

Write [\${1:TABLE_NAME}]
If fstat <> 0
  Trrollback
  GERROR = 1
  Call GESTCRE From GESADD With "\${8:MODULE_NAME}", "Error creating \${1:TABLE_NAME}: " + mess(255, fstat, 1), 1
  Return
Endif

Trcommit
\${0}`
    },
    {
      label: 'update-record',
      kind: 'Snippet',
      detail: 'Database Update with Transaction',
      documentation: 'Update an existing database record safely',
      insertText: `Trbegin \${1:TABLE_NAME}

Read [\${1:TABLE_NAME}]\${2:KEY_FIELD} = \${3:KEY_VALUE}
If fstat <> 0
  Trrollback
  GERROR = 1
  Call GESTCRE From GESADD With "\${4:MODULE_NAME}", "\${1:TABLE_NAME} not found: " + \${3:KEY_VALUE}, 1
  Return
Endif

\${1:TABLE_NAME}.\${5:FIELD_TO_UPDATE} = \${6:NEW_VALUE}
\${1:TABLE_NAME}.\${7:UPDUSER} = GUSER
\${1:TABLE_NAME}.\${8:UPDDAT} = date$

Rewrite [\${1:TABLE_NAME}]
If fstat <> 0
  Trrollback
  GERROR = 1
  Call GESTCRE From GESADD With "\${4:MODULE_NAME}", "Error updating \${1:TABLE_NAME}: " + mess(255, fstat, 1), 1
  Return
Endif

Trcommit
\${0}`
    },
    {
      label: 'for-loop-table',
      kind: 'Snippet',
      detail: 'For Loop Through Database Table',
      documentation: 'Loop through all records in a database table',
      insertText: `For [\${1:TABLE_NAME}] Where \${2:CONDITION}
  # Process each record
  \${0}
Next`
    },
    {
      label: 'if-error-check',
      kind: 'Snippet',
      detail: 'Error Check Pattern',
      documentation: 'Standard error checking pattern for Sage X3',
      insertText: `If GERROR <> 0
  Call GESTCRE From GESADD With "\${1:MODULE_NAME}", "\${2:ERROR_MESSAGE}", 1
  Return
Endif
\${0}`
    },
    {
      label: 'case-statement',
      kind: 'Snippet',
      detail: 'Case Statement Template',
      documentation: 'Multi-way branch case statement',
      insertText: `Case \${1:VARIABLE}
  When "\${2:VALUE1}"
    \${3:# Action for value 1}
  When "\${4:VALUE2}"
    \${5:# Action for value 2}
  When "\${6:VALUE3}"
    \${7:# Action for value 3}
  Default
    \${8:# Default action}
Endcase
\${0}`
    },
    {
      label: 'validate-customer',
      kind: 'Snippet',
      detail: 'Customer Validation Template',
      documentation: 'Standard customer validation pattern',
      insertText: `# Validate customer exists and is active
Read [CUSTOMER]CUSTCODE = \${1:CUSTOMER_CODE}
If fstat <> 0
  GERROR = 1
  Call GESTCRE From GESADD With "\${2:MODULE_NAME}", "Customer not found: " + \${1:CUSTOMER_CODE}, 1
  Return
Endif

If CUSTOMER.STATUS <> "A"
  GERROR = 1
  Call GESTCRE From GESADD With "\${2:MODULE_NAME}", "Customer not active: " + \${1:CUSTOMER_CODE}, 1
  Return
Endif

\${0}`
    },
    {
      label: 'calculate-totals',
      kind: 'Snippet',
      detail: 'Calculate Order Totals Template',
      documentation: 'Standard pattern for calculating order totals',
      insertText: `# Calculate order totals
Local Decimal LLINETOTAL, LTAX, LDISCOUNT, LGRANDTOTAL

LLINETOTAL = 0
For [\${1:ORDERLINES}] Where \${2:ORDNUM} = \${3:ORDER_NUMBER}
  LLINETOTAL += \${1:ORDERLINES}.\${4:QUANTITY} * \${1:ORDERLINES}.\${5:UNITPRICE}
Next

LTAX = LLINETOTAL * \${6:TAX_RATE}
LDISCOUNT = \${7:DISCOUNT_AMOUNT}
LGRANDTOTAL = LLINETOTAL + LTAX - LDISCOUNT

\${0}`
    }
  ];

  constructor(private symbolProvider: FourGLSymbolProvider, sageX3Config?: SageX3Config) {
    // Initialize Sage X3 connection if config provided
    if (sageX3Config && sageX3Config.enabled && sageX3Config.serverUrl) {
      this.sageX3Connection = new SageX3ConnectionProvider(
        sageX3Config.serverUrl,
        sageX3Config.folder || 'SEED',
        sageX3Config.username || '',
        sageX3Config.password || ''
      );
      // Test connection in background
      this.sageX3Connection.testConnection().then(connected => {
        console.log(`Sage X3 connection: ${connected ? 'SUCCESS' : 'FAILED'}`);
      });
    } else {
      // Default config for testing
      this.sageX3Connection = new SageX3ConnectionProvider(
        'http://localhost:3000',
        'SEED',
        '',
        ''
      );
    }
  }

  async getCompletionItems(document: TextDocument, position: Position): Promise<CompletionItem[]> {
    const completions: CompletionItem[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    const currentLine = lines[position.line] || '';
    const currentWord = this.getCurrentWord(currentLine, position.character);

    // Add keywords
    for (const keyword of this.keywords) {
      if (this.shouldIncludeCompletion(keyword, currentWord)) {
        completions.push({
          label: keyword,
          kind: CompletionItemKind.Keyword,
          detail: 'Sage X3 Keyword',
          insertText: keyword
        });
      }
    }

    // **NEW: Sage X3 Table and Field Completion**
    if (this.sageX3Connection && await this.sageX3Connection.isConnected()) {
      try {
        // Parse table reference from current line
        const tableRef = this.sageX3Connection.parseTableReference(currentLine, position.character);
        
        if (tableRef) {
          if (tableRef.isAfterBracket && tableRef.tableName) {
            // After [BPC] - show field completions for that table
            const fieldCompletions = await this.sageX3Connection.getBracketFieldCompletions(
              tableRef.tableName, 
              tableRef.fieldPrefix
            );
            completions.push(...fieldCompletions);
          } else if (tableRef.fieldPrefix !== '' && tableRef.tableName) {
            // User is typing a field name after table name (e.g., BPCUSTOMER.BPC...)
            const fieldCompletions = await this.sageX3Connection.getFieldCompletions(tableRef.tableName, tableRef.fieldPrefix);
            completions.push(...fieldCompletions);
          } else if (!tableRef.tableName) {
            // Inside brackets [TAB] - show table completions
            const tableCompletions = await this.sageX3Connection.getTableCompletions(tableRef.fieldPrefix);
            completions.push(...tableCompletions);
          }
        } else {
          // Check if we're in a context where table names are relevant
          if (this.isInDatabaseContext(currentLine)) {
            const tableCompletions = await this.sageX3Connection.getTableCompletions(currentWord);
            completions.push(...tableCompletions);
          }
        }
      } catch (error) {
        console.error('Error fetching Sage X3 completions:', error);
      }
    }

    // Add built-in functions
    for (const func of this.builtInFunctions) {
      if (this.shouldIncludeCompletion(func.name, currentWord)) {
        completions.push({
          label: func.name,
          kind: CompletionItemKind.Function,
          detail: `Built-in function: ${func.returnType}`,
          documentation: func.description,
          insertText: `${func.name}($1)`,
          insertTextFormat: 2 // Snippet format
        });
      }
    }

    // Add user-defined functions
    const functions = this.symbolProvider.getFunctions();
    for (const func of functions) {
      if (this.shouldIncludeCompletion(func.name, currentWord)) {
        completions.push({
          label: func.name,
          kind: CompletionItemKind.Function,
          detail: func.detail || `Function: ${func.dataType || 'void'}`,
          insertText: `${func.name}($1)`,
          insertTextFormat: 2 // Snippet format
        });
      }
    }

    // Add procedures
    const procedures = this.symbolProvider.getProcedures();
    for (const proc of procedures) {
      if (this.shouldIncludeCompletion(proc.name, currentWord)) {
        completions.push({
          label: proc.name,
          kind: CompletionItemKind.Method,
          detail: proc.detail || 'Procedure',
          insertText: `${proc.name}($1)`,
          insertTextFormat: 2 // Snippet format
        });
      }
    }

    // Add variables in scope
    const variables = this.symbolProvider.getVariablesInScope(document, position);
    for (const variable of variables) {
      if (this.shouldIncludeCompletion(variable.name, currentWord)) {
        completions.push({
          label: variable.name,
          kind: variable.type === 'parameter' ? CompletionItemKind.Variable : CompletionItemKind.Variable,
          detail: variable.detail || `${variable.type}: ${variable.dataType || 'unknown'}`,
          insertText: variable.name
        });
      }
    }

    // Add SQL-specific completions if in SQL context
    if (this.isInSqlContext(currentLine)) {
      const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER'];
      for (const keyword of sqlKeywords) {
        if (this.shouldIncludeCompletion(keyword, currentWord)) {
          completions.push({
            label: keyword,
            kind: CompletionItemKind.Keyword,
            detail: 'SQL Keyword',
            insertText: keyword
          });
        }
      }
    }

    // Add form-specific completions if in form context
    if (this.isInFormContext(currentLine)) {
      const formKeywords = ['INPUT', 'DISPLAY', 'CONSTRUCT', 'MENU', 'PROMPT', 'MESSAGE'];
      for (const keyword of formKeywords) {
        if (this.shouldIncludeCompletion(keyword, currentWord)) {
          completions.push({
            label: keyword,
            kind: CompletionItemKind.Keyword,
            detail: 'Form Keyword',
            insertText: keyword
          });
        }
      }
    }

    // Add code snippets
    for (const snippet of this.codeSnippets) {
      if (this.shouldIncludeCompletion(snippet.label, currentWord)) {
        completions.push({
          label: snippet.label,
          kind: CompletionItemKind.Snippet,
          detail: snippet.detail,
          documentation: snippet.documentation,
          insertText: snippet.insertText,
          insertTextFormat: 2 // Snippet format with placeholders
        });
      }
    }

    return completions;
  }

  resolveCompletionItem(item: CompletionItem): CompletionItem {
    // Add additional documentation or details
    if (item.kind === CompletionItemKind.Function) {
      const builtIn = this.builtInFunctions.find(f => f.name === item.label);
      if (builtIn) {
        item.documentation = {
          kind: 'markdown',
          value: `**${builtIn.name}**\n\nReturns: ${builtIn.returnType}\n\n${builtIn.description}`
        };
      }
    }

    return item;
  }

  private getCurrentWord(line: string, character: number): string {
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

  private shouldIncludeCompletion(candidate: string, currentWord: string): boolean {
    if (!currentWord) {
      return true;
    }
    return candidate.toLowerCase().startsWith(currentWord.toLowerCase());
  }

  private isInSqlContext(line: string): boolean {
    const sqlContextKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE'];
    const upperLine = line.toUpperCase();
    return sqlContextKeywords.some(keyword => upperLine.includes(keyword));
  }

  private isInFormContext(line: string): boolean {
    const formContextKeywords = ['FORM', 'INPUT', 'DISPLAY', 'CONSTRUCT'];
    const upperLine = line.toUpperCase();
    return formContextKeywords.some(keyword => upperLine.includes(keyword));
  }

  private isInDatabaseContext(line: string): boolean {
    const dbContextKeywords = ['READ', 'WRITE', 'REWRITE', 'DELETE', 'FOR', 'FIRST', 'NEXT', 'TRBEGIN'];
    const upperLine = line.toUpperCase();
    return dbContextKeywords.some(keyword => upperLine.includes(keyword)) || 
           line.includes('[') || // Table bracket notation
           line.includes('.'); // Table.field notation
  }
}
