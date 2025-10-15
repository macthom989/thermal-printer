# Thermal Printer Test Application

A standalone Tauri application for testing and managing thermal printer templates.

## Features

- 🖨️ **Printer Management**: Automatically detect and connect to Windows thermal printers
- 📝 **Template System**: Pre-built templates for receipts, tickets, and test patterns
- ⚡ **Direct Invocation**: Frontend directly calls Rust backend via Tauri commands
- 🎨 **Modern UI**: Clean interface built with React, TypeScript, and Tailwind CSS
- 🔧 **Easy Testing**: Test printer connectivity with one click

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite for bundling
- Tailwind CSS v4 for styling
- **shadcn/ui** for UI components (Button, Card, Alert, Badge, Select)
- **Lucide React** for beautiful icons
- `react-thermal-printer` for ESC/POS template rendering
- **ESLint + Prettier** for code quality

### Backend
- Tauri 2.x framework
- Rust with `escpos` crate for printer communication
- `printers` crate for Windows printer enumeration
- Base64 encoding for data transmission

## Installation

1. Install dependencies:
```bash
cd C:\FESrc\thermal-printer
npm install
```

2. Run the development server:
```bash
npm run tauri dev
```

3. Build for production:
```bash
npm run tauri build
```

4. Code quality:
```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Usage

### 1. Select Printer
- Click the "Refresh" button to scan for available printers
- Select your thermal printer from the dropdown
- Click "Test" to verify the connection

### 2. Print Templates
- Choose a template from the template list
- Click "Print" on the template card
- The receipt will be printed immediately

## Available Templates

### 🧪 Test Pattern
Basic printer test with various fonts, sizes, and alignment options. Use this to verify printer functionality.

### 🧾 Basic Receipt
Simple sales receipt with:
- Store name header
- Line items with prices
- Total amount
- Thank you message

### 📝 Order Ticket
Kitchen/bar order ticket with:
- Order number
- Table information
- Item quantities and notes
- Timestamp

## Architecture

### Data Flow
1. Frontend creates template using `react-thermal-printer`
2. Template is rendered to `Uint8Array` using `render()`
3. Convert to base64 string
4. Send to Rust backend via Tauri `invoke()`
5. Rust decodes base64 to bytes
6. WindowsDriver sends bytes to printer via Windows API

### Key Files

```
thermal-printer/
├── src/
│   ├── components/
│   │   ├── PrinterSelector.tsx    # Printer selection UI
│   │   └── TemplateList.tsx       # Template gallery
│   ├── templates/
│   │   ├── basic-receipt.tsx      # Receipt template
│   │   ├── order-ticket.tsx       # Order ticket template
│   │   └── test-pattern.tsx       # Test pattern template
│   ├── utils/
│   │   └── base64.ts              # Base64 conversion utilities
│   ├── App.tsx                    # Main application
│   └── main.tsx                   # Entry point
├── src-tauri/
│   └── src/
│       ├── printer/
│       │   ├── driver.rs          # WindowsDriver implementation
│       │   ├── commands.rs        # Tauri commands
│       │   └── mod.rs
│       └── lib.rs                 # Main Rust library
```

## Adding New Templates

1. Create a new template file in `src/templates/`:

```tsx
import { Br, Cut, Printer, Text } from "react-thermal-printer"

export const MyTemplate = () => (
  <Printer type="epson" width={48}>
    <Text align="center" bold>My Custom Template</Text>
    <Br />
    {/* Add your content here */}
    <Cut partial lineFeeds={3} />
  </Printer>
)
```

2. Add the template to the template list in `src/App.tsx`:

```tsx
const templates = [
  // ... existing templates
  {
    id: "my-template",
    name: "My Template",
    description: "My custom template",
    icon: "✨",
  },
]
```

3. Add a case in the `handlePrintTemplate` switch statement:

```tsx
case "my-template":
  template = <MyTemplate />
  break
```

## Tauri Commands

The following commands are available for frontend invocation:

### `list_printers()`
Returns a list of all available printers.

```typescript
const printers = await invoke<PrinterInfo[]>("list_printers")
```

### `print_template(printer_name, base64_data)`
Prints base64-encoded ESC/POS data to the specified printer.

```typescript
await invoke("print_template", {
  printerName: "POS-80-Series",
  base64Data: base64String
})
```

### `test_printer(printer_name)`
Sends a test print to verify printer connectivity.

```typescript
await invoke("test_printer", {
  printerName: "POS-80-Series"
})
```

## 🐛 Troubleshooting

### ⚠️ Common Error: "Cannot read properties of undefined (reading 'setAlign')"

**Cause:** Using HTML elements inside `<Printer>` component

**Quick Fix:**
```tsx
// ❌ WRONG - Using <div>
<Printer type="epson" width={48}>
  {items.map(item => (
    <div key={item.id}>  {/* ❌ Breaks! */}
      <Text>{item.name}</Text>
    </div>
  ))}
</Printer>

// ✅ CORRECT - Using React.Fragment
<Printer type="epson" width={48}>
  {items.map(item => (
    <React.Fragment key={item.id}>  {/* ✅ Works! */}
      <Text>{item.name}</Text>
    </React.Fragment>
  ))}
</Printer>
```

### Other Common Issues

**No Printers Found:**
- Ensure printer is connected and powered on
- Check Windows printer settings (Control Panel → Devices and Printers)
- Click "Refresh" to scan again

**Print Failed:**
- Verify printer is online and has paper
- Check printer driver is installed correctly
- Ensure printer name matches exactly (case-sensitive)

**Template Not Rendering:**
- Check browser console for errors
- Verify all template props are provided
- Ensure `react-thermal-printer` is installed

**📖 For detailed troubleshooting, see:** [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)

## Development

### Prerequisites
- Node.js 18+ 
- Rust 1.70+
- Windows OS (for printer support)

### Project Structure
- `/src` - React frontend source code
- `/src-tauri` - Rust backend source code
- `/dist` - Built frontend assets
- `/target` - Built Rust binaries

## License

MIT

## References

- [Tauri Documentation](https://tauri.app/)
- [react-thermal-printer](https://github.com/seokju-na/react-thermal-printer)
- [ESC/POS Command Reference](https://reference.epson-biz.com/modules/ref_escpos/index.php)
