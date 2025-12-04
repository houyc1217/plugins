# Troubleshooting Guide

## 🚨 Slash Commands Not Working

### Symptom
When you run `/search-leads` or other commands, Claude Code:
- Tries to run Python commands (`python -m src.tools.search_leads`)
- Says "MCP tools not available"
- Wants to create new files instead of using the MCP server

### Root Cause
The MCP server is **configured but not connected**. This means:
1. The path in `~/.claude/.mcp.json` is incorrect
2. The MCP server failed to start
3. Claude Code needs to be restarted

---

## ✅ Quick Fix (5 minutes)

### Step 1: Run the Diagnostic Script

```bash
cd /path/to/lead-generation-apollo
./diagnose.sh
```

This will:
- ✅ Check if `dist/index.js` exists
- ✅ Verify your API key is configured
- ✅ Check and fix your MCP configuration path
- ✅ Test if the MCP server can start

### Step 2: Verify MCP Configuration

Open `~/.claude/.mcp.json` and make sure it looks like this:

```json
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/FULL/ABSOLUTE/PATH/TO/plugins/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

**Critical:** The path MUST be:
- ✅ **Absolute** (starts with `/Users/...` on Mac)
- ✅ **Correct** (points to `dist/index.js` inside your project)
- ✅ **The `plugins` directory** (not just the parent directory)

### Step 3: Restart Claude Code

**This is the most important step!**

1. **Completely quit** Claude Code (Cmd+Q on Mac, not just close window)
2. **Wait 5 seconds**
3. **Reopen** Claude Code
4. **Navigate to your project** directory

### Step 4: Test

```
/search-leads
```

You should see Claude use the MCP tool instead of trying Python.

---

## 🔍 Manual Troubleshooting

### Problem 1: Path is Wrong

**Check your path:**
```bash
# In your project directory
pwd
# Output: /Users/yourname/path/to/lead-generation-apollo

# The MCP config should use:
# /Users/yourname/path/to/lead-generation-apollo/dist/index.js
```

**Common mistakes:**
- ❌ Missing `/plugins` at the end
- ❌ Missing `/dist/index.js` at the end
- ❌ Using relative paths like `./dist/index.js`
- ❌ Using `~` instead of full path

**Fix:**
```bash
nano ~/.claude/.mcp.json
# Update the "args" field with the correct full path
```

### Problem 2: dist/index.js Doesn't Exist

**Check if built:**
```bash
ls dist/index.js
```

If not found:
```bash
npm run build
```

### Problem 3: API Key Not Set

**Check .env:**
```bash
cat .env | grep APOLLO_API_KEY
```

Should show:
```
APOLLO_API_KEY=your_actual_key_here
```

If it says `your_apollo_api_key_here`, edit `.env`:
```bash
nano .env
# Change APOLLO_API_KEY to your real key
```

### Problem 4: MCP Server Won't Start

**Test manually:**
```bash
cd /path/to/lead-generation-apollo
node dist/index.js
```

**Expected output:**
```
Lead Generation MCP Server running on stdio
```

**If you see errors:**
- Check Node.js version: `node --version` (should be v18+)
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### Problem 5: Commands Not Found

**Check if commands exist:**
```bash
ls .claude/commands/
# Should show: search-leads.md, enrich-contact.md, etc.
```

**Install globally (optional):**
```bash
cp -r .claude/commands/* ~/.claude/commands/
```

Then restart Claude Code.

---

## 🎯 Complete Reset (Last Resort)

If nothing works, start fresh:

```bash
# 1. Clean everything
cd /path/to/lead-generation-apollo
rm -rf node_modules dist
rm ~/.claude/.mcp.json

# 2. Reinstall
npm install
npm run build

# 3. Get full path
pwd
# Copy this path!

# 4. Reconfigure MCP
cat > ~/.claude/.mcp.json << 'EOF'
{
  "mcpServers": {
    "lead-generation-apollo": {
      "command": "node",
      "args": ["/PASTE/YOUR/PATH/HERE/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "paste_your_key_here"
      }
    }
  }
}
EOF

# 5. Edit the file and replace the placeholders
nano ~/.claude/.mcp.json

# 6. Quit and restart Claude Code
```

---

## ✓ How to Verify It's Working

### 1. Check MCP Server Status

In Claude Code, after restarting, you should see the MCP server in the status.

### 2. Check Available Tools

When you ask Claude: "What MCP tools do you have available?"

It should list:
- `search_leads`
- `enrich_contact`
- `bulk_enrich_contacts`
- `score_lead`
- `export_leads`

### 3. Test a Command

```
/search-leads
```

**Working:** Claude asks you for search criteria and uses the `search_leads` tool

**Not working:** Claude tries to run Python or create new files

---

## 📝 Common Questions

### Q: Do I need to rebuild after changing .env?
**A:** No, but you need to restart Claude Code for it to pick up the new API key.

### Q: Do I need to rebuild after editing commands?
**A:** No, command files (`.md`) are read on-the-fly. Just restart Claude Code.

### Q: Can I have multiple MCP servers?
**A:** Yes! Add more entries to the `mcpServers` object in `.mcp.json`.

### Q: Why does it try Python first?
**A:** This happens when the MCP server isn't connected. Claude Code doesn't know about your tools, so it tries to figure out how to run the command based on the project structure.

### Q: Where are the MCP server logs?
**A:** Check Claude Code's output panel or run the server manually to see logs:
```bash
node dist/index.js
```

---

## 🆘 Still Not Working?

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

2. **Check file permissions:**
   ```bash
   ls -l dist/index.js  # Should be readable
   ```

3. **Check for syntax errors in .mcp.json:**
   ```bash
   cat ~/.claude/.mcp.json | python -m json.tool
   # Should show valid JSON without errors
   ```

4. **Look for error messages:**
   - Run `node dist/index.js` and look for errors
   - Check Claude Code console/logs

5. **Try the automated install script again:**
   ```bash
   ./install.sh
   ```

---

## 📞 Get Help

If you're still stuck:
1. Run `./diagnose.sh` and save the output
2. Check that you've restarted Claude Code
3. Verify the path in `.mcp.json` matches `pwd`/dist/index.js
4. Make sure your API key is set in both `.env` AND `.mcp.json`

The most common issue is **forgetting to restart Claude Code**. Always restart after changing MCP configuration!
