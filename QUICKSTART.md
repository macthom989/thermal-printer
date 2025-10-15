# 🚀 Quick Start Guide

## Prerequisites

✅ Windows OS (for printer support)  
✅ Node.js 18+ installed  
✅ Thermal printer connected to your computer  

## Step 1: Install Dependencies

```bash
cd C:\FESrc\thermal-printer
npm install
```

This will install all required packages including:
- React + TypeScript
- Tauri framework
- react-thermal-printer
- Tailwind CSS v4

## Step 2: Run Development Mode

```bash
npm run tauri dev
```

This command will:
1. Start the Vite dev server (React frontend)
2. Compile Rust backend
3. Launch the Tauri application window

**First time?** The Rust compilation may take 2-5 minutes. Subsequent runs will be much faster.

## Step 3: Use the Application

### Connect to Printer

1. Click **"Refresh"** button in the Printer Selection section
2. Select your thermal printer from the dropdown
3. Click **"Test"** to verify the connection
4. You should see a test print with "TEST" and "Printer"

### Print Templates

#### Option 1: Test Pattern (Recommended First Test)
- Click **"Print"** on the "Test Pattern" card
- This will print various fonts, sizes, and alignments
- Verifies all printer capabilities

#### Option 2: Basic Receipt
- Click **"Print"** on the "Basic Receipt" card
- Prints a sample sales receipt with:
  - Store name
  - 3 sample items (Coffee, Sandwich, Cookie)
  - Total: $24.50

#### Option 3: Order Ticket
- Click **"Print"** on the "Order Ticket" card
- Prints a kitchen order ticket with:
  - Order #001
  - Table 5
  - Items with custom notes

## Troubleshooting

### ❌ "No printers found"

**Solution:**
1. Ensure printer is powered on
2. Check printer is connected via USB or network
3. Verify printer appears in Windows "Devices and Printers"
4. Click "Refresh" button again

### ❌ "Failed to print: Printer not found"

**Solution:**
1. Printer name might have changed
2. Click "Refresh" to reload printer list
3. Ensure correct printer is selected
4. Try clicking "Test" first

### ❌ Build/Compilation Errors

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules
rm -rf src-tauri/target
npm install
npm run tauri dev
```

### ❌ TypeScript Errors

**Solution:**
```bash
# Verify TypeScript compiles
npm run build
```

## Next Steps

### Customize Templates

Edit the template files in `src/templates/`:

```typescript
// src/templates/basic-receipt.tsx
export const BasicReceipt = ({ storeName, items, total }) => (
  <Printer type="epson" width={48}>
    <Text align="center" bold size={{ width: 2, height: 2 }}>
      {storeName}
    </Text>
    {/* Add your customizations here */}
  </Printer>
)
```

### Add New Templates

1. Create new file: `src/templates/my-template.tsx`
2. Add to template list in `src/App.tsx`
3. Add switch case in `handlePrintTemplate()`

Example:
```typescript
// In App.tsx
const templates = [
  // ... existing templates
  {
    id: "my-template",
    name: "My Custom Template",
    description: "My custom receipt",
    icon: "✨",
  },
]

// In handlePrintTemplate
case "my-template":
  template = <MyCustomTemplate {...props} />
  break
```

### Build Production Version

```bash
# Creates standalone .exe in src-tauri/target/release/
npm run tauri build
```

The built application will be in:
- `src-tauri/target/release/thermal-printer.exe` (standalone executable)
- `src-tauri/target/release/bundle/` (installer packages)

## Usage Tips

### 💡 Best Practices

1. **Always test first**: Use "Test" button before printing custom templates
2. **Check paper**: Ensure printer has enough paper
3. **Printer width**: Default is 48 characters (80mm paper)
4. **Cut settings**: Use `partial` cut to avoid jamming

### 📝 Common Template Patterns

**Bold Headers:**
```tsx
<Text bold size={{ width: 2, height: 2 }}>
  HEADER TEXT
</Text>
```

**Two-Column Layout:**
```tsx
<Row left="Item Name" right="$9.99" />
```

**Separators:**
```tsx
<Line />
```

**Spacing:**
```tsx
<Br />  {/* Single line break */}
<Br />
<Br />  {/* Multiple line breaks */}
```

**Paper Cut:**
```tsx
<Cut partial lineFeeds={3} />  {/* Partial cut with 3 line feeds */}
```

## Support

### Resources

- 📖 Full documentation: `README.md`
- 🏗️ Project structure: `PROJECT-SUMMARY.md`
- 💻 ESC/POS reference: [Epson ESC/POS](https://reference.epson-biz.com/modules/ref_escpos/index.php)
- 🔧 react-thermal-printer: [GitHub](https://github.com/seokju-na/react-thermal-printer)

### Common Commands

```bash
# Development
npm run tauri dev

# Build
npm run tauri build

# Frontend only (no Tauri)
npm run dev

# TypeScript check
npm run build
```

## Success! 🎉

You should now have a working thermal printer test application. Try printing each template and customize them for your needs.

**Enjoy printing!** 🖨️✨

