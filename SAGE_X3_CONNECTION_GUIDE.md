# 🚀 Enhanced Sage X3 Extension with Live Database Connection

## 📋 **Overview**

Your VS Code extension now supports **live connection to Sage X3 servers** for enhanced autocomplete functionality, similar to the official Sage X3 Studio. This gives you:

- **Real-time table and field autocomplete**
- **Live database schema introspection**
- **Connection to Sage X3 compiler server**
- **Intelligent context-aware suggestions**

## 🔧 **Setting Up Sage X3 Connection**

### **Option 1: Use the Compiler Server (Recommended)**

1. **Install the Sage X3 Compiler Server** (from the repository you mentioned):
   ```bash
   git clone https://github.com/azatakmyradov/sagex3-compiler-server.git
   cd sagex3-compiler-server
   npm install
   npm install -g pm2
   ```

2. **Configure the server** by copying `.env.example` to `.env`:
   ```env
   X3_PATH=C:\Sage\X3V12\folders
   X3_URL=http://localhost:3000
   PORT=3000
   CUSERNAME=your_username
   CPASSWORD=your_password
   ```

3. **Start the server**:
   ```bash
   pm2 start app.config.cjs
   ```

### **Option 2: Extend the Server for Database Schema**

To get table/field autocomplete, you'll need to add a new endpoint to the compiler server. Add this to `src/main.ts`:

```typescript
/*
* Returns database schema information for autocomplete
*/
app.get("/:folder/schema", (req: Request, res: Response) => {
    if (!isAuthenticated(req, res)) {
        return res.json({
            message: "unauthenticated",
        });
    }

    const x3Folder: string = req.params.hasOwnProperty('folder')
        ? req.params.folder.toUpperCase()
        : '';

    // This would query your Sage X3 database for table schema
    // You'll need to implement this based on your X3 setup
    return getTableSchema(x3Folder).then((schema) => {
        res.json({
            tables: schema,
            message: "Schema retrieved successfully"
        });
    });
});

async function getTableSchema(folder: string) {
    // Implementation depends on your Sage X3 database setup
    // This could connect to Syracuse, use ODBC, or query X3 directly
    // Example structure:
    return [
        {
            name: "BPCUSTOMER",
            description: "Business Partner Customer",
            fields: [
                { name: "BPCNUM", type: "Char", length: 15, description: "Customer Code", isKey: true },
                { name: "BPCNAM", type: "Char", length: 35, description: "Customer Name" },
                // ... more fields
            ]
        },
        // ... more tables
    ];
}
```

## ⚙️ **VS Code Configuration**

### **Option A: VPN + Syracuse/Web Client Access** *(Your Setup)*

Configure your VS Code settings for direct Syracuse connection:

```json
{
    "sage-x3.connection.enabled": true,
    "sage-x3.connection.serverUrl": "https://your-sage-domain.com:8124",
    "sage-x3.connection.folder": "YOUR_FOLDER",
    "sage-x3.connection.username": "your_x3_username",
    "sage-x3.connection.password": "your_x3_password"
}
```

**Key points for your setup:**
- Use the **same domain/IP** you access via browser
- Use **HTTPS** if your Sage instance uses SSL
- **Port 8124** is typical for Syracuse, but check your actual port
- Connect through your **VPN first** before starting VS Code

### **Option B: Local Compiler Server** *(Alternative)*

If using the compiler server approach:

```json
{
    "sage-x3.connection.enabled": true,
    "sage-x3.connection.serverUrl": "http://localhost:3000",
    "sage-x3.connection.folder": "SEED",
    "sage-x3.connection.username": "your_username",
    "sage-x3.connection.password": "your_password"
}
```

## 💡 **How It Works**

### **Table Autocomplete**
When you type in a database context:
```sage-x3
Read [BPC|  # Shows table suggestions: BPCUSTOMER, BPCSUPPLIER, etc.
```

### **Field Autocomplete**
When you reference a table:
```sage-x3
Read [BPCUSTOMER]BPCNUM = "CUST001"
BPCUSTOMER.BPC|  # Shows field suggestions: BPCNUM, BPCNAM, BPCTYP, etc.
```

### **Context-Aware Suggestions**
The extension detects database contexts:
- `Read [TABLE]` statements
- `Write [TABLE]` statements  
- `For [TABLE]` loops
- `TABLE.FIELD` references
- `Trbegin TABLE` transactions

## 🎯 **Features**

### **🔍 Smart Detection**
- **Bracket notation**: `[BPCUSTOMER]` 
- **Dot notation**: `BPCUSTOMER.BPCNUM`
- **Database operations**: `Read`, `Write`, `For`, etc.

### **📊 Rich Information**
- **Field types**: Char(15), Decimal, Date
- **Descriptions**: Full field descriptions
- **Key indicators**: Primary keys shown first
- **Table context**: Shows which table the field belongs to

### **⚡ Performance**
- **Caching**: Schema information is cached
- **Async loading**: Non-blocking autocomplete
- **Fallback**: Works offline with hardcoded common tables

## 🛠️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VS Code       │    │  Language       │    │  Sage X3        │
│   Extension     │◄──►│  Server         │◄──►│  Compiler       │
│                 │    │                 │    │  Server         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Code           │    │  Completion     │    │  X3 Database    │
│  Completion     │    │  Provider       │    │  Schema         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Next Steps**

1. **Set up the compiler server** using the repository you found
2. **Configure VS Code settings** for your Sage X3 environment  
3. **Test the connection** by opening a .src file and typing table names
4. **Extend the server** to add database schema endpoints for full functionality

## 🔧 **Troubleshooting**

### **VPN + Browser Access Setup** *(Your Configuration)*
- **Connect VPN first**: Ensure your VPN connection is active before starting VS Code
- **Test browser access**: Verify you can access Sage X3 via browser first
- **Use same URL**: Use the exact domain/IP you use in the browser
- **Check ports**: Common ports are 8124 (Syracuse), 80/443 (HTTP/HTTPS)
- **SSL certificates**: If using HTTPS, ensure certificates are valid
- **Firewall**: Check if corporate firewall blocks API calls from VS Code

### **Connection Issues**
- Check if the compiler server is running: `http://localhost:3000/`
- Verify credentials in VS Code settings
- Check server logs: `pm2 logs compiler`

### **No Autocomplete**
- Ensure `sage-x3.connection.enabled` is `true`
- Check the VS Code Output panel for error messages
- Verify you're in a .src file with Sage X3 syntax

### **Performance Issues**
- Reduce the number of tables if schema is large
- Check network latency to the server
- Consider local caching options

## 📚 **Resources**

- **Compiler Server**: https://github.com/azatakmyradov/sagex3-compiler-server
- **Sage X3 Studio**: https://plugin-x3.sagex3.com/safex3/studio/index.html
- **VS Code Language Server**: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide

## 🤝 **Contributing**

This enhanced functionality opens up many possibilities:
- **Schema caching strategies**
- **Custom table definitions** 
- **Integration with Syracuse**
- **Offline mode improvements**
- **Performance optimizations**

Feel free to contribute improvements or additional features!
