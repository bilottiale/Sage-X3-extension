import { CompletionItem } from 'vscode-languageserver/node';
export interface SageX3Config {
    serverUrl: string;
    username: string;
    password: string;
    folder: string;
    enabled: boolean;
}
export interface SageX3Table {
    name: string;
    description: string;
    fields: SageX3Field[];
}
export interface SageX3Field {
    name: string;
    type: string;
    length?: number;
    description: string;
    isKey?: boolean;
}
export interface SageX3Function {
    name: string;
    module: string;
    parameters: string[];
    returnType?: string;
    description: string;
}
export declare class SageX3ConnectionProvider {
    private serverUrl;
    private folder;
    private username;
    private password;
    private cachedTables;
    private cacheExpiry;
    private axiosInstance;
    constructor(serverUrl: string, folder: string, username: string, password: string);
    /**
     * Test connection to Sage X3 server
     */
    testConnection(): Promise<boolean>;
    getAvailableFiles(): Promise<string[]>;
    getFileContent(filename: string): Promise<string | null>;
    /**
     * Get list of available .src files from X3 server
     */
    /**
     * Get database schema information (tables and fields)
     * This would need to be implemented in the server side
     */
    getDatabaseSchema(): Promise<SageX3Table[]>;
    /**
     * Get table completion items for autocomplete
     */
    getTableCompletions(prefix?: string): Promise<CompletionItem[]>;
    /**
     * Get field completions for a specific table
     */
    getFieldCompletions(tableName: string, prefix?: string): Promise<CompletionItem[]>;
    private getFieldCompletionsFromTable;
    /**
     * Get special bracket-notation field completions
     * Returns completions in the format: BPCNUM, BPCNAM, etc. (without the [TABLE] part)
     */
    getBracketFieldCompletions(tableName: string, prefix?: string): Promise<CompletionItem[]>;
    private createBracketFieldCompletions;
    /**
     * Parse table reference from current line
     * Examples: [BPCUSTOMER], [BPC]CPY, SORDER.BPCORD, Read [ITEMMASTER]
     */
    parseTableReference(line: string, position: number): {
        tableName: string;
        fieldPrefix: string;
        isAfterBracket: boolean;
    } | null;
    /**
     * Find full table name from abbreviated form
     * Examples: BPC -> BPCUSTOMER, ITM -> ITEMMASTER
     */
    private findFullTableName;
    /**
     * Default hardcoded tables for fallback
     */
    private getDefaultTables;
    /**
     * Test if connection is working
     */
    isConnected(): Promise<boolean>;
}
//# sourceMappingURL=sage-x3-connection.d.ts.map