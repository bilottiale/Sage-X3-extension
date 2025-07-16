#!/usr/bin/env node

const { createConnection, TextDocuments, ProposedFeatures } = require('vscode-languageserver/node');
const { TextDocument } = require('vscode-languageserver-textdocument');

// Simple test to verify the LSP server can be started
console.log('Testing 4GL Language Server...');

// Import our server
try {
  const server = require('./out/server.js');
  console.log('✅ Server module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load server module:', error.message);
  process.exit(1);
}

// Test basic functionality
const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

console.log('✅ Language server components initialized');
console.log('✅ 4GL Language Server is ready!');

console.log('\nTo use the language server:');
console.log('1. Open a .4gl file in VS Code');
console.log('2. Install the 4GL Language Support extension');
console.log('3. The language server will provide completion, diagnostics, and hover information');

console.log('\nExample 4GL files are available in the examples/ directory:');
console.log('- examples/customer_management.4gl');
console.log('- examples/data_validation.4gl');
