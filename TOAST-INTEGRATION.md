# 🍞 Sonner Toast Integration

## 📋 Overview

Replaced static status alerts with **Sonner** toast notifications for better UX and cleaner UI.

**Date:** October 15, 2025

---

## ✅ What Changed

### Before: Static Alert Messages ❌

**Issues:**
- Alert boxes took up vertical space
- Had to manually dismiss
- Not as visually appealing
- Required state management (`status`, `setStatus`)
- Cluttered UI with multiple alerts

```tsx
// Old implementation
const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

// Show error
setStatus({ type: "error", message: "Please select a printer first" })

// JSX
{status && (
  <Alert variant={status.type === "error" ? "destructive" : "default"}>
    <AlertDescription>{status.message}</AlertDescription>
  </Alert>
)}
```

### After: Sonner Toast Notifications ✅

**Benefits:**
- ✅ Non-intrusive (appears in corner)
- ✅ Auto-dismiss after timeout
- ✅ Beautiful animations
- ✅ Stacks multiple toasts
- ✅ Loading states built-in
- ✅ Rich colors for success/error/warning
- ✅ Close button for manual dismiss
- ✅ No state management needed

```tsx
// New implementation
import { toast, Toaster } from "sonner"

// Show error
toast.error("Please select a printer first")

// Show success
toast.success("Printed successfully!")

// Loading with transition
const loadingToast = toast.loading("Printing...")
toast.success("Done!", { id: loadingToast }) // Replaces loading toast

// JSX - Just add once
<Toaster position="top-right" richColors closeButton />
```

---

## 📦 Installation

```bash
npm install sonner
```

**Package:** `sonner@1.7.3` (or latest)

---

## 🔧 Implementation Details

### 1. App.tsx - Main Application

**Changes:**

**Imports:**
```tsx
// Removed
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Added
import { toast, Toaster } from "sonner"
```

**State Cleanup:**
```tsx
// Removed status state
- const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

// Kept only printing state
const [printing, setPrinting] = useState(false)
```

**Test Printer Function:**
```tsx
const handleTestPrinter = async () => {
  if (!selectedPrinter) {
    toast.error("Please select a printer first")
    return
  }

  setPrinting(true)
  const loadingToast = toast.loading("Sending test print...")

  try {
    await invoke("test_printer", { printerName: selectedPrinter })
    toast.success("Test print sent successfully!", { id: loadingToast })
  } catch (error) {
    toast.error(`Failed to print: ${error}`, { id: loadingToast })
  } finally {
    setPrinting(false)
  }
}
```

**Print Template Function:**
```tsx
const handlePrintTemplate = async (templateId: string) => {
  if (!selectedPrinter) {
    toast.error("Please select a printer first")
    return
  }

  const templateName = templates.find((t) => t.id === templateId)?.name || "Template"

  setPrinting(true)
  const loadingToast = toast.loading(`Printing ${templateName}...`)

  try {
    // ... print logic ...
    
    toast.success(`${templateName} printed successfully!`, { id: loadingToast })
  } catch (error) {
    toast.error(`Failed to print: ${error}`, { id: loadingToast })
  } finally {
    setPrinting(false)
  }
}
```

**JSX Changes:**
```tsx
return (
  <>
    <Toaster position="top-right" richColors closeButton />
    <div className="...">
      {/* Removed: Status Message Alert */}
      {/* Removed: Printing Indicator Alert */}
      
      {/* Rest of UI remains */}
    </div>
  </>
)
```

### 2. PrinterSelector.tsx - Printer Component

**Changes:**

**Imports:**
```tsx
import { toast } from "sonner"
```

**State Cleanup:**
```tsx
// Removed error state
- const [error, setError] = useState<string | null>(null)
```

**Load Printers Function:**
```tsx
const loadPrinters = async () => {
  setLoading(true)
  try {
    const result = await invoke<PrinterInfo[]>("list_printers")
    setPrinters(result)
    
    if (result.length > 0 && !selectedPrinter) {
      onSelectPrinter(result[0].name)
    }
    
    if (result.length === 0) {
      toast.warning("No printers found. Please check your printer connection.")
    }
  } catch (err) {
    toast.error(`Failed to load printers: ${err}`)
  } finally {
    setLoading(false)
  }
}
```

**JSX Cleanup:**
```tsx
// Removed error display
- {error && (
-   <div className="bg-destructive/15 text-destructive ...">
-     {error}
-   </div>
- )}

// Removed "no printers" message (now shown as toast)
- {printers.length === 0 && !loading && !error && (
-   <p className="text-muted-foreground text-sm">
-     No printers found. Click refresh to scan.
-   </p>
- )}
```

---

## 🎨 Toast Types & Usage

### Basic Toasts

```tsx
// Success
toast.success("Operation completed!")

// Error
toast.error("Something went wrong!")

// Warning
toast.warning("Please check your settings")

// Info
toast.info("Here's some information")

// Default
toast("Just a message")
```

### Loading Toast

```tsx
// Show loading
const toastId = toast.loading("Processing...")

// Update to success (replaces loading)
toast.success("Done!", { id: toastId })

// Or update to error
toast.error("Failed!", { id: toastId })
```

### Custom Duration

```tsx
// Auto-dismiss after 5 seconds
toast.success("Saved!", { duration: 5000 })

// Never auto-dismiss
toast.error("Critical error", { duration: Infinity })
```

### With Action Button

```tsx
toast("Event created", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
})
```

### With Description

```tsx
toast("Meeting scheduled", {
  description: "Tomorrow at 3pm with John Doe",
})
```

---

## ⚙️ Toaster Configuration

### Current Configuration

```tsx
<Toaster 
  position="top-right"    // Toast position
  richColors              // Colored backgrounds
  closeButton             // Show X button
/>
```

### Available Options

```tsx
<Toaster
  position="top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"
  expand={false}           // Expand on hover
  richColors={true}        // Use semantic colors
  closeButton={true}       // Show close button
  duration={4000}          // Default auto-dismiss time (ms)
  toastOptions={{
    className: "...",      // Custom classes
    style: {},             // Custom styles
  }}
  theme="light" | "dark" | "system"  // Color theme
  offset="16px"            // Distance from edge
/>
```

---

## 🎯 Toast Best Practices

### ✅ DO

**1. Use appropriate types:**
```tsx
toast.success("Printer connected")     // ✅ Success action
toast.error("Connection failed")       // ✅ Error action
toast.warning("Printer offline")       // ✅ Warning state
toast.info("Press Ctrl+P to print")    // ✅ Information
```

**2. Use loading states for async operations:**
```tsx
const id = toast.loading("Uploading...")
try {
  await upload()
  toast.success("Uploaded!", { id })
} catch {
  toast.error("Upload failed", { id })
}
```

**3. Keep messages concise:**
```tsx
toast.success("Saved!")                           // ✅ Short
toast.error("Failed to save document")            // ✅ Clear
```

**4. Include context in errors:**
```tsx
toast.error(`Failed to print: ${error.message}`)  // ✅ Helpful
```

### ❌ DON'T

**1. Don't overuse toasts:**
```tsx
// ❌ Too many toasts
toast.info("Loading...")
toast.info("Processing...")
toast.info("Almost done...")

// ✅ Use single loading toast
const id = toast.loading("Processing...")
toast.success("Done!", { id })
```

**2. Don't use toasts for critical errors:**
```tsx
// ❌ Error gets dismissed
toast.error("Payment failed! Your card was charged.")

// ✅ Use modal or alert
showErrorModal("Payment Error", "...")
```

**3. Don't make messages too long:**
```tsx
// ❌ Too verbose
toast.success("Your document has been successfully saved to the cloud and synchronized across all your devices")

// ✅ Concise
toast.success("Document saved and synced")
```

---

## 📊 Before vs After Comparison

| Feature | Alert Messages | Sonner Toasts |
|---------|---------------|---------------|
| **Space Usage** | Takes vertical space | Floats in corner |
| **Dismissal** | Manual or state clear | Auto-dismiss + manual |
| **Multiple Messages** | Cluttered | Stacked neatly |
| **Loading States** | Custom implementation | Built-in |
| **Animations** | Basic | Smooth & beautiful |
| **User Action** | Can't interact | Can include actions |
| **State Management** | Requires state | No state needed |
| **Visual Appeal** | Basic | Modern & polished |
| **Accessibility** | Good | Excellent |

---

## 🎨 Visual Examples

### Success Toast
```
┌─────────────────────────────────┐
│ ✓  Printed successfully!     × │
└─────────────────────────────────┘
```
- Green background (richColors)
- Check icon
- Auto-dismiss after 4s
- Close button (X)

### Error Toast
```
┌─────────────────────────────────┐
│ ✕  Failed to print: Error...  × │
└─────────────────────────────────┘
```
- Red background (richColors)
- X icon
- Auto-dismiss after 4s
- Close button

### Loading Toast
```
┌─────────────────────────────────┐
│ ⟳  Printing Template...          │
└─────────────────────────────────┘
```
- Blue background
- Spinning icon
- No auto-dismiss
- No close button

### Warning Toast
```
┌─────────────────────────────────┐
│ ⚠  No printers found          × │
└─────────────────────────────────┘
```
- Yellow background (richColors)
- Warning icon
- Auto-dismiss after 4s
- Close button

---

## 🔧 Customization

### Custom Styles

```tsx
// Per-toast styling
toast.success("Saved!", {
  className: "my-custom-toast",
  style: {
    background: "green",
    color: "white",
  },
})

// Global styling via Toaster
<Toaster
  toastOptions={{
    className: "custom-toast",
    style: {
      background: "blue",
    },
  }}
/>
```

### Custom Position

```tsx
// Bottom-right corner
<Toaster position="bottom-right" />

// Top-center
<Toaster position="top-center" />
```

### Dark Mode Support

```tsx
// Follows system theme
<Toaster theme="system" />

// Force dark
<Toaster theme="dark" />

// Force light
<Toaster theme="light" />
```

---

## 📝 Code Changes Summary

### Files Modified

1. **`src/App.tsx`**
   - Added: `import { toast, Toaster } from "sonner"`
   - Removed: Status state, Alert components
   - Updated: `handleTestPrinter()`, `handlePrintTemplate()`
   - Added: `<Toaster />` component

2. **`src/components/PrinterSelector.tsx`**
   - Added: `import { toast } from "sonner"`
   - Removed: Error state, error display JSX
   - Updated: `loadPrinters()` with toast notifications

3. **`package.json`**
   - Added: `"sonner": "^1.7.3"`

### Lines Changed

- **App.tsx:** ~40 lines changed
  - Removed: ~30 lines (status state + Alert JSX)
  - Added: ~10 lines (toast calls)
  
- **PrinterSelector.tsx:** ~15 lines changed
  - Removed: ~10 lines (error state + error JSX)
  - Added: ~5 lines (toast calls)

**Total:** ~55 lines changed, net reduction of ~35 lines! 🎉

---

## ✅ Benefits Achieved

### User Experience
- ✅ Non-intrusive notifications
- ✅ Auto-dismiss reduces clutter
- ✅ Beautiful animations
- ✅ Clear visual hierarchy with colors
- ✅ Can see multiple notifications at once

### Developer Experience
- ✅ Less code to maintain
- ✅ No state management for messages
- ✅ Simple API (`toast.success()`, etc.)
- ✅ Built-in loading states
- ✅ Consistent notification pattern

### Code Quality
- ✅ Reduced component complexity
- ✅ Cleaner JSX (no conditional Alert blocks)
- ✅ Better separation of concerns
- ✅ More maintainable
- ✅ Type-safe API

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Custom Toast Components
```tsx
// Create custom toast with image
toast.custom((t) => (
  <div className="...">
    <img src="..." />
    <p>Custom toast content</p>
  </div>
))
```

### 2. Promise-based Toasts
```tsx
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed to save',
  }
)
```

### 3. Global Toast Queue
```tsx
// Limit number of visible toasts
<Toaster visibleToasts={3} />
```

### 4. Sound Notifications
```tsx
// Play sound on toast
toast.success("Done!", {
  onAutoClose: () => playSound(),
})
```

---

## 📚 Resources

- **Sonner Docs:** https://sonner.emilkowal.ski/
- **GitHub:** https://github.com/emilkowalski/sonner
- **NPM:** https://www.npmjs.com/package/sonner
- **Examples:** https://sonner.emilkowal.ski/examples

---

## ✅ Status: Complete

**Implementation:** ✅ Done  
**Testing:** ✅ All toasts working  
**Documentation:** ✅ Complete  
**Code Quality:** ✅ Formatted & linted

**Result:** Clean, modern toast notifications that enhance UX! 🎉🍞

