"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SageX3ConnectionProvider = void 0;
const node_1 = require("vscode-languageserver/node");
const axios_1 = __importDefault(require("axios"));
class SageX3ConnectionProvider {
    constructor(serverUrl, folder, username, password) {
        this.cachedTables = null;
        this.cacheExpiry = 0;
        this.serverUrl = serverUrl;
        this.folder = folder;
        this.username = username;
        this.password = password;
        // Configure axios for VPN/HTTPS scenarios
        this.axiosInstance = axios_1.default.create({
            timeout: 10000, // 10 second timeout for VPN connections
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Handle self-signed certificates common in corporate VPNs
            httpsAgent: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ?
                new (require('https').Agent)({ rejectUnauthorized: false }) : undefined
        });
    }
    /**
     * Test connection to Sage X3 server
     */
    async testConnection() {
        try {
            const response = await this.axiosInstance.get(`${this.serverUrl}/`);
            return response.data.message === 'working';
        }
        catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
    async getAvailableFiles() {
        try {
            const response = await this.axiosInstance.get(`${this.serverUrl}/${this.folder}/files`, {
                auth: {
                    username: this.username,
                    password: this.password
                }
            });
            return response.data.files || [];
        }
        catch (error) {
            console.error('Failed to get files:', error);
            return [];
        }
    }
    async getFileContent(filename) {
        try {
            const response = await this.axiosInstance.get(`${this.serverUrl}/${this.folder}/download`, {
                params: { filename },
                auth: {
                    username: this.username,
                    password: this.password
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get file content:', error);
            return null;
        }
    }
    /**
     * Get list of available .src files from X3 server
     */
    /**
     * Get database schema information (tables and fields)
     * This would need to be implemented in the server side
     */
    async getDatabaseSchema() {
        try {
            // This endpoint would need to be added to the server
            const response = await this.axiosInstance.get(`${this.serverUrl}/${this.folder}/schema`, {
                auth: {
                    username: this.username,
                    password: this.password
                }
            });
            const tables = response.data.tables || [];
            return tables;
        }
        catch (error) {
            console.error('Failed to fetch database schema:', error);
            return this.getDefaultTables(); // Fallback to hardcoded tables
        }
    }
    /**
     * Get table completion items for autocomplete
     */
    async getTableCompletions(prefix = '') {
        const tables = await this.getDatabaseSchema();
        return tables
            .filter(table => table.name.toLowerCase().startsWith(prefix.toLowerCase()))
            .map(table => ({
            label: table.name,
            kind: node_1.CompletionItemKind.Class,
            detail: `Table: ${table.description || table.name}`,
            documentation: `Sage X3 Table: ${table.name}\n${table.description || ''}`,
            insertText: table.name
        }));
    }
    /**
     * Get field completions for a specific table
     */
    async getFieldCompletions(tableName, prefix = '') {
        // Try to get from default tables first
        const defaultTables = this.getDefaultTables();
        const table = defaultTables.find(t => t.name.toLowerCase() === tableName.toLowerCase());
        if (!table) {
            // Try to fetch from server schema
            const serverTables = await this.getDatabaseSchema();
            const serverTable = serverTables.find(t => t.name.toLowerCase() === tableName.toLowerCase());
            if (!serverTable)
                return [];
            return this.getFieldCompletionsFromTable(serverTable, prefix);
        }
        return this.getFieldCompletionsFromTable(table, prefix);
    }
    getFieldCompletionsFromTable(table, prefix) {
        return table.fields
            .filter(field => field.name.toLowerCase().startsWith(prefix.toLowerCase()))
            .map(field => ({
            label: field.name,
            kind: node_1.CompletionItemKind.Field,
            detail: `${field.type}${field.length ? `(${field.length})` : ''} - ${field.description}`,
            documentation: `Table: ${table.name}\nField: ${field.name}\nType: ${field.type}\n${field.description}`,
            insertText: field.name,
            sortText: field.isKey ? '0' + field.name : '1' + field.name // Keys first
        }));
    }
    /**
     * Get special bracket-notation field completions
     * Returns completions in the format: BPCNUM, BPCNAM, etc. (without the [TABLE] part)
     */
    async getBracketFieldCompletions(tableName, prefix = '') {
        const fullTableName = this.findFullTableName(tableName);
        const table = this.getDefaultTables().find(t => t.name === fullTableName);
        if (!table) {
            // Try to fetch from server schema
            const serverTables = await this.getDatabaseSchema();
            const serverTable = serverTables.find(t => t.name === fullTableName);
            if (!serverTable)
                return [];
            return this.createBracketFieldCompletions(serverTable, tableName, prefix);
        }
        return this.createBracketFieldCompletions(table, tableName, prefix);
    }
    createBracketFieldCompletions(table, originalTableRef, prefix) {
        return table.fields
            .filter(field => field.name.toLowerCase().startsWith(prefix.toLowerCase()))
            .map(field => ({
            label: field.name,
            kind: node_1.CompletionItemKind.Field,
            detail: `[${originalTableRef}]${field.name} - ${field.type}${field.length ? `(${field.length})` : ''} - ${field.description}`,
            documentation: {
                kind: 'markdown',
                value: `**Table:** ${table.name} (${table.description})\n\n**Field:** ${field.name}\n\n**Type:** ${field.type}${field.length ? `(${field.length})` : ''}\n\n**Description:** ${field.description}\n\n**Usage:** \`[${originalTableRef}]${field.name}\`${field.isKey ? '\n\n🔑 **Primary Key**' : ''}`
            },
            insertText: field.name,
            sortText: field.isKey ? '0' + field.name : '1' + field.name, // Keys first
            filterText: field.name,
            // Add snippet support for common patterns
            additionalTextEdits: []
        }));
    }
    /**
     * Parse table reference from current line
     * Examples: [BPCUSTOMER], [BPC]CPY, SORDER.BPCORD, Read [ITEMMASTER]
     */
    parseTableReference(line, position) {
        // Get text up to cursor position
        const textToCursor = line.substring(0, position);
        // Pattern 1: [TABLE]FIELD - detect field typing after bracket close
        const bracketFieldMatch = textToCursor.match(/\[([A-Z_][A-Z0-9_]*)\]([A-Z_]*)$/);
        if (bracketFieldMatch) {
            const tableName = this.findFullTableName(bracketFieldMatch[1]);
            const fieldPrefix = bracketFieldMatch[2];
            return { tableName, fieldPrefix, isAfterBracket: true };
        }
        // Pattern 2: [TABLENAME] - just table in brackets
        const bracketMatch = textToCursor.match(/\[([A-Z_][A-Z0-9_]*)\]$/);
        if (bracketMatch) {
            const tableName = this.findFullTableName(bracketMatch[1]);
            return { tableName, fieldPrefix: '', isAfterBracket: true };
        }
        // Pattern 3: TABLE.FIELD - dot notation
        const dotMatch = textToCursor.match(/([A-Z_][A-Z0-9_]*)\.([A-Z_]*)$/);
        if (dotMatch) {
            const tableName = this.findFullTableName(dotMatch[1]);
            return { tableName, fieldPrefix: dotMatch[2], isAfterBracket: false };
        }
        // Pattern 4: Inside brackets [TAB] - table name completion
        const insideBrackets = textToCursor.match(/\[([A-Z_]*)$/);
        if (insideBrackets) {
            return { tableName: '', fieldPrefix: insideBrackets[1], isAfterBracket: false };
        }
        return null;
    }
    /**
     * Find full table name from abbreviated form
     * Examples: BPC -> BPCUSTOMER, ITM -> ITEMMASTER
     */
    findFullTableName(abbreviation) {
        const tables = this.getDefaultTables();
        // Common Sage X3 table abbreviations
        const abbreviationMap = {
            'BPC': 'BPCUSTOMER',
            'SOH': 'SORDER',
            'SOP': 'SORDERP',
            'SOQ': 'SORDERQ',
            'ITM': 'ITEMMASTER',
            'ITC': 'ITEMCATEGORY',
            'SIH': 'SINVOICE',
            'SIP': 'SINVOICEP',
            'PIH': 'PINVOICE',
            'PIP': 'PINVOICEP',
            'STK': 'STOCK',
            'FCY': 'FACILITY',
            'CUR': 'CURRENCY',
            'VAT': 'ITMVAT',
            'PRI': 'SPRICELIST',
            'USR': 'AUUSER',
            'GRP': 'AUUSERGRP'
        };
        // First try abbreviation map
        if (abbreviationMap[abbreviation.toUpperCase()]) {
            return abbreviationMap[abbreviation.toUpperCase()];
        }
        // Then try exact match
        const exactMatch = tables.find(t => t.name === abbreviation.toUpperCase());
        if (exactMatch)
            return exactMatch.name;
        // Then try prefix match
        const prefixMatch = tables.find(t => t.name.startsWith(abbreviation.toUpperCase()));
        if (prefixMatch)
            return prefixMatch.name;
        // Return original if no match found
        return abbreviation.toUpperCase();
    }
    /**
     * Default hardcoded tables for fallback
     */
    getDefaultTables() {
        return [
            {
                name: 'BPCUSTOMER',
                description: 'Business Partner Customer',
                fields: [
                    { name: 'BPCNUM', type: 'Char', length: 15, description: 'Customer Code', isKey: true },
                    { name: 'BPCNAM', type: 'Char', length: 35, description: 'Customer Name' },
                    { name: 'BPCTYP', type: 'Char', length: 1, description: 'Customer Type' },
                    { name: 'CUR', type: 'Char', length: 3, description: 'Currency' },
                    { name: 'CREDAT', type: 'Date', description: 'Creation Date' },
                    { name: 'CREUSER', type: 'Char', length: 5, description: 'Creation User' }
                ]
            },
            {
                name: 'SORDER',
                description: 'Sales Order Header',
                fields: [
                    { name: 'SOHNUM', type: 'Char', length: 15, description: 'Sales Order Number', isKey: true },
                    { name: 'BPCORD', type: 'Char', length: 15, description: 'Customer Code' },
                    { name: 'ORDDAT', type: 'Date', description: 'Order Date' },
                    { name: 'GROAMT', type: 'Decimal', description: 'Gross Amount' },
                    { name: 'NETAMT', type: 'Decimal', description: 'Net Amount' },
                    { name: 'DISAMT', type: 'Decimal', description: 'Discount Amount' }
                ]
            },
            {
                name: 'ITEMMASTER',
                description: 'Item Master',
                fields: [
                    { name: 'ITMREF', type: 'Char', length: 20, description: 'Item Reference', isKey: true },
                    { name: 'ITMDES1', type: 'Char', length: 30, description: 'Item Description 1' },
                    { name: 'ITMDES2', type: 'Char', length: 30, description: 'Item Description 2' },
                    { name: 'UOM', type: 'Char', length: 3, description: 'Unit of Measure' },
                    { name: 'SALCATCOD', type: 'Char', length: 10, description: 'Sales Category' }
                ]
            },
            {
                name: 'SINVOICE',
                description: 'Sales Invoice Header',
                fields: [
                    { name: 'NUM', type: 'Char', length: 15, description: 'Invoice Number', isKey: true },
                    { name: 'BPCORD', type: 'Char', length: 15, description: 'Customer Code' },
                    { name: 'INVDAT', type: 'Date', description: 'Invoice Date' },
                    { name: 'INVTYP', type: 'Char', length: 3, description: 'Invoice Type' }
                ]
            }
        ];
    }
    /**
     * Test if connection is working
     */
    async isConnected() {
        return await this.testConnection();
    }
}
exports.SageX3ConnectionProvider = SageX3ConnectionProvider;
//# sourceMappingURL=sage-x3-connection.js.map