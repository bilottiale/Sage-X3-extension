# 🔐 VPN + Browser Access Setup Guide

## 🎯 **Your Scenario: VPN → Browser → Sage X3**

Perfect! Your setup (VPN connection + browser access) is fully supported. Here's how to configure the extension for your environment:

## 🚀 **Quick Setup for VPN Access**

### **Step 1: Identify Your Sage X3 URLs**

When you access Sage X3 via browser, note the URL structure:

```
Examples:
https://sage-server.company.com/syracuse/
https://10.1.2.100:8124/syracuse/
https://x3prod.mydomain.local/sage/
```

### **Step 2: Configure VS Code Settings**

Open VS Code Settings (File → Preferences → Settings) and search for "sage-x3":

```json
{
    "sage-x3.connection.enabled": true,
    "sage-x3.connection.serverUrl": "https://your-sage-domain.com:8124",
    "sage-x3.connection.folder": "YOUR_FOLDER_NAME",
    "sage-x3.connection.username": "your_x3_username", 
    "sage-x3.connection.password": "your_x3_password"
}
```

**Replace with your actual values:**
- `serverUrl`: The domain/IP you use in the browser
- `folder`: Your Sage X3 folder (e.g., "SEED", "PROD", "TEST")
- `username`/`password`: Your Sage X3 credentials

## 🔧 **Connection Methods**

### **Method 1: Direct Syracuse API** *(Recommended)*

If your Sage instance has Syracuse web services:

```json
{
    "sage-x3.connection.serverUrl": "https://sage-server.company.com:8124/syracuse/rest/api",
    "sage-x3.connection.apiPath": "/schema/tables"
}
```

### **Method 2: Custom Web API**

If you have custom web services:

```json
{
    "sage-x3.connection.serverUrl": "https://sage-server.company.com/api/v1",
    "sage-x3.connection.apiPath": "/metadata"
}
```

### **Method 3: Compiler Server Proxy**

Set up the compiler server as a proxy to your VPN-connected Sage instance:

```javascript
// In the compiler server's .env file:
X3_URL=https://sage-server.company.com:8124
X3_VPN_REQUIRED=true
PROXY_MODE=true
```

## 🌐 **VPN Configuration Tips**

### **Before Starting VS Code:**
1. **Connect to VPN** first
2. **Test browser access** to ensure Sage X3 is reachable
3. **Note the exact URL** you use in the browser
4. **Start VS Code** after VPN is connected

### **Common URL Patterns:**
```
Syracuse Web Client:
- https://server:8124/syracuse/
- https://server/sage/syracuse/

Classic Web Client:
- https://server/sage/
- https://server:80/x3web/

API Endpoints:
- https://server:8124/api/
- https://server/sage/rest/
```

## 🔍 **Testing Your Connection**

### **Step 1: Test Basic Connectivity**
Open browser and verify you can access Sage X3 with your VPN connected.

### **Step 2: Test API Access**
Try accessing the API endpoint in browser:
```
https://your-sage-server.com:8124/api/status
https://your-sage-server.com/sage/rest/ping
```

### **Step 3: Test VS Code Extension**
1. Open a `.src` file in VS Code
2. Type `[BPC` and look for table suggestions
3. Check VS Code Output panel for connection logs

## ⚡ **Performance Optimization**

### **For VPN Connections:**
```json
{
    "sage-x3.connection.timeout": 10000,
    "sage-x3.connection.retries": 3,
    "sage-x3.connection.cacheTimeout": 300000,
    "sage-x3.connection.batchSize": 50
}
```

### **Caching Strategy:**
- **Schema cache**: 5 minutes (reduces VPN traffic)
- **Table list cache**: 10 minutes  
- **Field cache**: 15 minutes
- **Connection pool**: Reuse connections

## 🛠️ **Troubleshooting VPN Issues**

### **Connection Problems:**
- ✅ **VPN connected?** Check VPN status
- ✅ **Browser works?** Test Sage X3 in browser first
- ✅ **Correct URL?** Use exact browser URL
- ✅ **Firewall?** Check if VS Code is blocked
- ✅ **SSL certificates?** Verify HTTPS certificates

### **Slow Performance:**
- 📊 **Enable caching** to reduce VPN traffic
- 📊 **Increase timeouts** for slower VPN connections
- 📊 **Reduce batch sizes** for large datasets
- 📊 **Use local fallbacks** when VPN is unavailable

### **Authentication Issues:**
- 🔐 **Correct credentials?** Same as browser login
- 🔐 **Session timeouts?** Refresh tokens periodically
- 🔐 **Domain authentication?** May need domain\\username format
- 🔐 **Two-factor auth?** May need app passwords

## 📋 **Complete Example Configuration**

```json
{
    "sage-x3.connection.enabled": true,
    "sage-x3.connection.serverUrl": "https://sageserver.company.com:8124",
    "sage-x3.connection.folder": "PROD",
    "sage-x3.connection.username": "john.doe",
    "sage-x3.connection.password": "your_password",
    "sage-x3.connection.timeout": 10000,
    "sage-x3.connection.useHttps": true,
    "sage-x3.connection.validateCerts": false,
    "sage-x3.connection.apiPath": "/syracuse/rest/api/v1",
    "sage-x3.connection.cacheEnabled": true,
    "sage-x3.connection.cacheTimeout": 300000
}
```

## 🎯 **Expected Behavior**

Once configured correctly:

1. **Connect VPN** → **Start VS Code** → **Open .src file**
2. **Type `[BPC`** → See table suggestions (BPCUSTOMER, BPCSUPPLIER, etc.)
3. **Type `BPCUSTOMER.BPC`** → See field suggestions (BPCNUM, BPCNAM, etc.)
4. **Real-time autocomplete** with your actual Sage X3 schema!

Your VPN + browser setup is perfect for this enhanced autocomplete functionality! 🚀
