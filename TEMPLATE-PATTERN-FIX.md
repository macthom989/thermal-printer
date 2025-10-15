# 🔧 Template Pattern Fix

## ❌ Problem: `render()` không chấp nhận cách cũ

### Cách Cũ (Không Hoạt Động)

```tsx
// ❌ Export component functions
export const TestPattern = () => (
  <Printer type="epson" width={48}>
    <Text>Test</Text>
  </Printer>
)

// ❌ Call component để get element
export function getTemplateComponent(templateId: string) {
  switch (templateId) {
    case "test-pattern":
      return <TestPattern />  // Call component
  }
}

// ❌ Render không hoạt động đúng
const template = getTemplateComponent("test-pattern")
await render(template)  // ❌ May have issues!
```

**Vấn Đề:**
- Component được call mỗi lần `getTemplateComponent()` chạy
- Tạo element instance mới mỗi lần
- `render()` có thể không nhận diện đúng props/context
- Không match pattern của `react-thermal-printer` docs

---

## ✅ Solution: Export JSX Elements Directly

### Cách Mới (Theo volt-pos Pattern)

```tsx
// ✅ Export JSX elements directly (not functions!)
export const TestPatternTemplate = <TestPattern />

export const BasicReceiptTemplate = (
  <BasicReceipt
    storeName="Demo Store"
    items={[...]}
    total={24.5}
  />
)

// ✅ Return template element reference
export function getTemplateElement(templateId: string) {
  switch (templateId) {
    case "test-pattern":
      return TestPatternTemplate  // ← Just return reference, no <>
    case "basic-receipt":
      return BasicReceiptTemplate
  }
}

// ✅ Use directly
const template = getTemplateElement("test-pattern")
await render(template)  // ✅ Works perfectly!
```

**Tại Sao Đúng:**
- ✅ Element được tạo 1 lần khi module load
- ✅ Props đã được resolved sẵn
- ✅ `render()` nhận element reference trực tiếp
- ✅ Match pattern trong volt-pos
- ✅ Consistent với react-thermal-printer expectations

---

## 📊 Comparison

### Pattern 1: Component Function (❌ Old)

```tsx
// Define as function
export const TestPattern = () => <Printer>...</Printer>

// Call to get element
const element = <TestPattern />

// Each call creates NEW instance
const e1 = <TestPattern />
const e2 = <TestPattern />
// e1 !== e2 (different instances)
```

### Pattern 2: Direct Element (✅ New)

```tsx
// Define as element
export const TestPatternTemplate = <Printer>...</Printer>

// Use reference
const element = TestPatternTemplate

// Same reference
const e1 = TestPatternTemplate
const e2 = TestPatternTemplate
// e1 === e2 (same reference)
```

---

## 🎯 Implementation

### File: `src/lib/templates.tsx`

```tsx
import { BasicReceipt } from "@/templates/basic-receipt"
import { OrderTicket } from "@/templates/order-ticket"
import { TestPattern } from "@/templates/test-pattern"

// Template metadata
export const templates: TemplateConfig[] = [
  {
    id: "test-pattern",
    name: "Test Pattern",
    // ...
  },
  // ...
]

// ✅ Export elements directly
export const TestPatternTemplate = <TestPattern />

export const BasicReceiptTemplate = (
  <BasicReceipt
    storeName="Demo Store"
    items={[
      { name: "Coffee", price: 5.0, quantity: 2 },
      { name: "Sandwich", price: 8.5, quantity: 1 },
      { name: "Cookie", price: 2.5, quantity: 3 },
    ]}
    total={24.5}
  />
)

export const OrderTicketTemplate = (
  <OrderTicket
    orderNumber="001"
    tableName="Table 5"
    items={[
      { name: "Burger", quantity: 2, notes: "No onions" },
      { name: "Fries", quantity: 2 },
      { name: "Coke", quantity: 1, notes: "Extra ice" },
    ]}
  />
)

// ✅ Get element by ID
export function getTemplateElement(templateId: string) {
  switch (templateId) {
    case "test-pattern":
      return TestPatternTemplate  // No <>, just reference
    case "basic-receipt":
      return BasicReceiptTemplate
    case "order-ticket":
      return OrderTicketTemplate
    default:
      throw new Error(`Unknown template: ${templateId}`)
  }
}

export function getTemplateName(templateId: string): string {
  return templates.find((t) => t.id === templateId)?.name || "Template"
}
```

### File: `src/hooks/usePrinterOperations.ts`

```tsx
import { getTemplateElement, getTemplateName } from "@/lib/templates"

export function usePrinterOperations() {
  // ...

  const printTemplate = async (templateId: string) => {
    if (!selectedPrinter) {
      toast.error("Please select a printer first")
      return
    }

    const templateName = getTemplateName(templateId)

    setPrinting(true)
    const loadingToast = toast.loading(`Printing ${templateName}...`)

    try {
      // ✅ Get template element (not component!)
      const template = getTemplateElement(templateId)

      // ✅ Render element to Uint8Array
      const uint8Array = await render(template)

      // Convert to base64
      const base64Data = uint8ArrayToBase64(uint8Array)

      // Send to printer
      await invoke("print_template", {
        printerName: selectedPrinter,
        base64Data,
      })

      toast.success(`${templateName} printed successfully!`, { id: loadingToast })
    } catch (error) {
      toast.error(`Failed to print: ${error}`, { id: loadingToast })
    } finally {
      setPrinting(false)
    }
  }

  return { /* ... */, printTemplate }
}
```

---

## 🎓 Why This Pattern?

### 1. Follows volt-pos Convention

**In volt-pos:**
```tsx
// escpos-examples.tsx
export const BoldExample = (
  <Printer type="epson" width={48}>
    <Text bold>Bold Text</Text>
  </Printer>
)

// advanced-printer-demo.tsx
switch (selectedExample) {
  case "bold":
    template = BoldExample  // ← Direct reference
    break
}

const uint8Array = await render(template)
```

**Same pattern in our project now!** ✅

### 2. Performance Benefits

```tsx
// ❌ Old: Creates new element each time
function getTemplate(id) {
  return <TestPattern />  // New element instance
}

// ✅ New: Reuses same element
const TestPatternTemplate = <TestPattern />  // Created once
function getTemplate(id) {
  return TestPatternTemplate  // Same reference
}
```

### 3. Simpler Mental Model

```tsx
// Template = Element (not factory function)
const template = TestPatternTemplate  // Just a value
await render(template)  // Render the value

// vs

// Template = Function that returns element
const template = getTemplateComponent("test")  // Call function
await render(template)  // Render returned value
```

### 4. Type Safety

```tsx
// Element type is clear
const TestPatternTemplate: JSX.Element = <TestPattern />

// TypeScript knows exactly what this is
const template = getTemplateElement("test-pattern")
// template: JSX.Element (clear!)

await render(template)  // Type-safe ✅
```

---

## 🔄 Migration Summary

### Changed Files

1. **`src/lib/templates.tsx`**
   - ✅ Export elements instead of components
   - ✅ Renamed `getTemplateComponent` → `getTemplateElement`
   - ✅ Return element references (no `<>`)

2. **`src/hooks/usePrinterOperations.ts`**
   - ✅ Updated import: `getTemplateElement`
   - ✅ Updated usage: `getTemplateElement(templateId)`

3. **`src/templates/*.tsx`**
   - ✅ No changes needed!
   - ✅ Still export component functions
   - ✅ Used by templates.tsx to create elements

---

## ✅ Benefits

### Before
- ❌ Component called each time
- ❌ New element instance each call
- ❌ Potential render issues
- ❌ Different pattern than volt-pos

### After
- ✅ Element created once
- ✅ Same reference reused
- ✅ Reliable rendering
- ✅ Matches volt-pos pattern
- ✅ Better performance
- ✅ Clearer code

---

## 📚 Learn More

### React Elements vs Components
- **Component:** Function that returns element
- **Element:** JSX object describing UI

```tsx
// Component (function)
const MyComponent = () => <div>Hello</div>

// Element (object)
const myElement = <div>Hello</div>

// Component creates elements
const element1 = <MyComponent />
const element2 = <MyComponent />
// element1 !== element2 (different objects)

// Elements are objects
const el1 = myElement
const el2 = myElement
// el1 === el2 (same reference)
```

### When to Use Each Pattern

**Use Component Functions:**
- Dynamic props based on state
- Conditional rendering
- React components in UI

**Use Direct Elements (Our Case):**
- Static templates with fixed props
- Printer templates
- Reusable element references
- Performance-critical code

---

## ✅ Status: Fixed

**Pattern Updated:** ✅ Done  
**Following volt-pos:** ✅ Yes  
**Renders Correctly:** ✅ Yes  
**Type Safe:** ✅ Yes  
**Code Quality:** ✅ Improved

**Result:** Templates now work correctly with `react-thermal-printer`! 🎉

