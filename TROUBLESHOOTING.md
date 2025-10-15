# 🐛 Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: "Cannot read properties of undefined (reading 'setAlign')"

**Full Error Message:**
```
Failed to print: TypeError: Cannot read properties of undefined (reading 'setAlign')
```

#### 🔍 Root Cause

This error occurs when **HTML elements** (like `<div>`, `<span>`, `<p>`, etc.) are used inside the `<Printer>` component from `react-thermal-printer`.

**Why it happens:**
- `react-thermal-printer` expects only its own components inside `<Printer>`
- HTML elements like `<div>` are not recognized and break the internal printer context
- The `setAlign` method is called on `undefined` because the printer instance isn't passed through HTML elements

#### ✅ Solution

**Replace HTML elements with React Fragments**

**❌ WRONG - Using `<div>`:**
```tsx
import { Br, Printer, Text } from "react-thermal-printer"

export const OrderTicket = ({ items }) => (
  <Printer type="epson" width={48}>
    {items.map((item, index) => (
      <div key={item.id || index}>
        {/* ❌ <div> breaks the printer context! */}
        <Text>{item.name}</Text>
        <Br />
      </div>
    ))}
  </Printer>
)
```

**✅ CORRECT - Using React.Fragment:**
```tsx
import React from "react"
import { Br, Printer, Text } from "react-thermal-printer"

export const OrderTicket = ({ items }) => (
  <Printer type="epson" width={48}>
    {items.map((item, index) => (
      <React.Fragment key={item.id || index}>
        {/* ✅ React.Fragment preserves printer context */}
        <Text>{item.name}</Text>
        <Br />
      </React.Fragment>
    ))}
  </Printer>
)
```

**Or use shorthand `<>` (if no key needed):**
```tsx
{items.map((item, index) => (
  <React.Fragment key={item.id || index}>
    {/* Content */}
  </React.Fragment>
))}

{/* Or without key: */}
<>
  <Text>Some text</Text>
  <Br />
</>
```

#### 📝 Rules for react-thermal-printer Templates

**✅ DO:**
- Use `<Printer>` as the root component
- Use only `react-thermal-printer` components inside:
  - `<Text>`, `<Br>`, `<Line>`, `<Row>`
  - `<Image>`, `<Cut>`, `<Raw>`
  - `<Cashdraw>`, `<QRCode>`, `<Barcode>`
- Use `React.Fragment` for grouping when mapping
- Use conditional rendering with `{condition && <Component />}`

**❌ DON'T:**
- Don't use HTML elements: `<div>`, `<span>`, `<p>`, `<section>`, etc.
- Don't use CSS classes or inline styles
- Don't nest `<Printer>` components
- Don't use non-printer components inside `<Printer>`

#### ✅ Correct Template Structure

```tsx
import React from "react"
import { Br, Cut, Line, Printer, Row, Text } from "react-thermal-printer"

export interface MyTemplateProps {
  title: string
  items: Array<{ name: string; price: number }>
  total: number
}

export const MyTemplate = ({ title, items, total }: MyTemplateProps) => (
  <Printer type="epson" width={48}>
    {/* Header */}
    <Text align="center" bold size={{ width: 2, height: 2 }}>
      {title}
    </Text>
    <Br />
    <Line />
    <Br />

    {/* Items - Use React.Fragment for mapping */}
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <Row left={item.name} right={`$${item.price.toFixed(2)}`} />
      </React.Fragment>
    ))}

    <Br />
    <Line />
    <Br />

    {/* Total - Use conditional rendering */}
    {total > 0 && (
      <>
        <Text align="right" bold>
          Total: ${total.toFixed(2)}
        </Text>
        <Br />
      </>
    )}

    {/* Cut paper */}
    <Cut partial lineFeeds={3} />
  </Printer>
)
```

---

### ❌ Error: "base64::decode is deprecated"

**Warning Message:**
```
warning: use of deprecated function `base64::decode`: Use Engine::decode
  --> src\printer\driver.rs:73:25
```

#### ✅ Solution

Update to use the modern base64 Engine API:

**❌ Old (Deprecated):**
```rust
let bytes = base64::decode(base64_data)?;
```

**✅ New (Modern):**
```rust
use base64::{Engine as _, engine::general_purpose};

let bytes = general_purpose::STANDARD.decode(base64_data)?;
```

---

### ❌ Error: "EBUSY: resource busy or locked"

**Full Error:**
```
Error: EBUSY: resource busy or locked, rename 'C:\FESrc\thermal-printer\node_modules\.vite\deps_temp_...'
```

#### 🔍 Root Cause

Windows file locking issue during Vite's dependency optimization.

#### ✅ Solutions

**Option 1: Re-run npm install**
```bash
npm install
npm run tauri dev
```

**Option 2: Clean and reinstall**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run tauri dev
```

**Option 3: Restart dev server**
```bash
# Stop the current dev server (Ctrl+C)
# Wait a few seconds
npm run tauri dev
```

**Option 4: Close other processes**
- Close any editors/IDEs that might be locking files
- Close antivirus software temporarily
- Close backup software

---

### ❌ Error: "Printer not found"

**Error Message:**
```
Failed to print: Printer 'XYZ' not found
```

#### ✅ Solutions

**1. Check printer is connected:**
- Physical printer is powered on and connected
- USB cable is properly connected
- Network printer is accessible

**2. Verify printer name:**
- Open Windows "Devices and Printers"
- Copy the EXACT printer name (case-sensitive)
- Make sure there are no extra spaces

**3. Test printer:**
- Right-click printer → "Printing preferences" → "Print Test Page"
- If Windows test fails, fix printer driver first

**4. Refresh printer list:**
- Click "Refresh" button in the app
- Restart the application
- Restart printer

---

### ❌ Error: "Template rendering failed"

**Error Message:**
```
Failed to print: Error rendering template
```

#### ✅ Solutions

**1. Check template props:**
```tsx
// ❌ Missing required props
<BasicReceipt /> // Error!

// ✅ All required props provided
<BasicReceipt
  storeName="My Store"
  items={[{ name: "Item", price: 10 }]}
  total={10}
/>
```

**2. Validate data types:**
```tsx
// ❌ Wrong types
<BasicReceipt
  items="not an array" // Error!
  total="10" // Error! Should be number
/>

// ✅ Correct types
<BasicReceipt
  items={[{ name: "Item", price: 10.0 }]}
  total={10.0}
/>
```

**3. Check for undefined values:**
```tsx
// ❌ Undefined values can break rendering
<Text>{undefined}</Text> // Error!
<Text>{item.name}</Text> // Error if item is undefined!

// ✅ Use fallbacks
<Text>{item?.name || "N/A"}</Text>
<Text>{value ?? "Default"}</Text>
```

---

## 🔧 Debugging Tips

### 1. Check Console Logs

**Frontend logs (Browser DevTools):**
```
Right-click in app → Inspect → Console tab
```

**Backend logs (Terminal):**
```
Check the terminal where `npm run tauri dev` is running
```

### 2. Test Template Rendering

```tsx
// Test if template renders without errors
import { render } from "react-thermal-printer"

try {
  const uint8Array = await render(<MyTemplate />)
  console.log("✅ Template rendered successfully")
  console.log("Output length:", uint8Array.length)
} catch (error) {
  console.error("❌ Template rendering failed:", error)
}
```

### 3. Verify Base64 Conversion

```tsx
import { uint8ArrayToBase64 } from "./utils/base64"

const uint8Array = await render(template)
const base64 = uint8ArrayToBase64(uint8Array)

console.log("Base64 length:", base64.length)
console.log("First 50 chars:", base64.substring(0, 50))
```

### 4. Test Printer Communication

```tsx
// Test with simple text first
const simpleTemplate = (
  <Printer type="epson" width={48}>
    <Text>Hello World</Text>
    <Cut />
  </Printer>
)

const uint8Array = await render(simpleTemplate)
await invoke("print_template", {
  printerName: "Your Printer",
  base64Data: uint8ArrayToBase64(uint8Array),
})
```

---

## 📚 Resources

### react-thermal-printer Documentation
- **GitHub:** https://github.com/paystory-de/react-thermal-printer
- **NPM:** https://www.npmjs.com/package/react-thermal-printer

### ESC/POS Commands
- **EPO POS Command Reference:** Official Epson docs
- **See:** `ESCPOS-COMPLETE-REFERENCE.md` in project

### Tauri Documentation
- **Invoke Commands:** https://tauri.app/v1/guides/features/command
- **Debugging:** https://tauri.app/v1/guides/debugging/application

---

## 🆘 Still Having Issues?

### Checklist

- [ ] Printer is powered on and connected
- [ ] Printer name is correct (no typos)
- [ ] No HTML elements inside `<Printer>`
- [ ] All template props are provided
- [ ] All data types are correct
- [ ] No undefined values in template
- [ ] `react-thermal-printer` is installed (`npm list react-thermal-printer`)
- [ ] Rust dependencies are installed (`cargo build`)
- [ ] No file locks (restart dev server)

### Get Help

1. **Check Console Logs** - Look for specific error messages
2. **Test with Test Pattern** - Use the built-in test pattern first
3. **Verify Printer** - Test print from Windows works
4. **Simplify Template** - Start with minimal template and add complexity
5. **Check Network** - For network printers, verify IP and connectivity

### Common Quick Fixes

```bash
# Fix 1: Reinstall dependencies
npm install
cd src-tauri && cargo build

# Fix 2: Clean restart
# Stop dev server (Ctrl+C)
npm run tauri dev

# Fix 3: Format code
npm run format
npm run lint
```

---

## ✅ Verification

After fixing issues, verify everything works:

1. **Load Printers** ✓
   - Click "Refresh" button
   - See printer list populate
   - No errors in console

2. **Test Print** ✓
   - Select a printer
   - Click "Test" button
   - Printer prints test pattern

3. **Print Template** ✓
   - Select "Test Pattern" template
   - Click "Print" button
   - Printer prints complete test

4. **Print Receipt** ✓
   - Select "Basic Receipt" template
   - Click "Print" button
   - Receipt prints correctly

**If all tests pass → ✅ Everything is working!**

