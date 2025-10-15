# 📦 Template Data Pattern - Factory Functions

## ❓ Vấn Đề: Xử Lý Dữ Liệu Động

### Nếu export constant, data bị hardcoded:

```tsx
// ❌ Problem: Data cố định
export const BasicReceiptTemplate = (
  <BasicReceipt
    storeName="Demo Store"  // ← Hardcoded!
    items={[...]}           // ← Hardcoded!
    total={24.5}            // ← Hardcoded!
  />
)

// Không thể thay đổi data!
const template = BasicReceiptTemplate  // Always same data ❌
```

---

## ✅ Giải Pháp: Factory Functions

### Pattern: Functions Return JSX Elements

```tsx
// ✅ Factory function - nhận params, return element
export function createBasicReceiptTemplate(data?: Partial<BasicReceiptData>) {
  return (
    <BasicReceipt
      storeName={data?.storeName || "Demo Store"}
      items={data?.items || defaultItems}
      total={data?.total || 24.5}
    />
  )
}

// ✅ Có thể tùy chỉnh data!
const template1 = createBasicReceiptTemplate()  // Default data
const template2 = createBasicReceiptTemplate({ storeName: "My Store" })  // Custom data
```

---

## 📋 Implementation

### File: `src/lib/templates.tsx`

```tsx
import { render } from "react-thermal-printer"
import { BasicReceipt, type ReceiptItem } from "@/templates/basic-receipt"
import { OrderTicket, type OrderItem } from "@/templates/order-ticket"
import { TestPattern } from "@/templates/test-pattern"
import { uint8ArrayToBase64 } from "@/utils/base64"

// ✅ Define data interfaces
export interface BasicReceiptData {
  storeName?: string
  items: ReceiptItem[]
  total: number
}

export interface OrderTicketData {
  orderNumber: string
  tableName?: string
  items: OrderItem[]
  timestamp?: Date
}

// ✅ Factory functions
export function createTestPatternTemplate() {
  return <TestPattern />
}

export function createBasicReceiptTemplate(data?: Partial<BasicReceiptData>) {
  return (
    <BasicReceipt
      storeName={data?.storeName || "Demo Store"}
      items={data?.items || defaultItems}
      total={data?.total || 24.5}
    />
  )
}

export function createOrderTicketTemplate(data?: Partial<OrderTicketData>) {
  return (
    <OrderTicket
      orderNumber={data?.orderNumber || "001"}
      tableName={data?.tableName || "Table 5"}
      items={data?.items || defaultItems}
      timestamp={data?.timestamp}
    />
  )
}

// ✅ Unified interface with optional custom data
export function getTemplateElement(templateId: string, customData?: any) {
  switch (templateId) {
    case "test-pattern":
      return createTestPatternTemplate()
    
    case "basic-receipt":
      return createBasicReceiptTemplate(customData)
    
    case "order-ticket":
      return createOrderTicketTemplate(customData)
    
    default:
      throw new Error(`Unknown template: ${templateId}`)
  }
}

// ✅ Render with optional data
export async function renderTemplateToBase64(
  templateId: string, 
  customData?: any
): Promise<string> {
  const template = getTemplateElement(templateId, customData)
  const uint8Array = await render(template)
  return uint8ArrayToBase64(uint8Array)
}
```

---

## 🎯 Usage Examples

### Example 1: Default Data (Demo)

```tsx
// ✅ Use default demo data
const base64 = await renderTemplateToBase64("basic-receipt")

// Prints receipt with demo data
```

### Example 2: Custom Data

```tsx
// ✅ Pass custom data
const customData: Partial<BasicReceiptData> = {
  storeName: "My Coffee Shop",
  items: [
    { name: "Latte", price: 4.5, quantity: 2 },
    { name: "Croissant", price: 3.0, quantity: 1 },
  ],
  total: 12.0,
}

const base64 = await renderTemplateToBase64("basic-receipt", customData)

// Prints receipt with custom data
```

### Example 3: Partial Data (Merge with Defaults)

```tsx
// ✅ Only override what you need
const customData = {
  storeName: "Custom Store",
  // items and total use defaults
}

const base64 = await renderTemplateToBase64("basic-receipt", customData)
```

### Example 4: In Hook

```tsx
// src/hooks/usePrinterOperations.ts
const printTemplate = async (templateId: string, customData?: any) => {
  // ...
  
  // ✅ Pass data to template
  const base64 = await renderTemplateToBase64(templateId, customData)
  
  await invoke("print_template", {
    printerName: selectedPrinter,
    base64Data: base64,
  })
}

// Use in component
const printReceipt = () => {
  printTemplate("basic-receipt", {
    storeName: "Real Store",
    items: actualItems,
    total: actualTotal,
  })
}
```

---

## 🎨 Pattern Comparison

### Pattern 1: Constant Export (❌ Inflexible)

```tsx
// Export constant
export const Template = <Component data="fixed" />

// Use
const el = Template  // ❌ Always same data
await render(el)
```

**Problems:**
- ❌ Data hardcoded
- ❌ Cannot customize
- ❌ Not reusable with different data

### Pattern 2: Factory Function (✅ Flexible)

```tsx
// Export factory
export function createTemplate(data?: CustomData) {
  return <Component data={data?.value || "default"} />
}

// Use
const el1 = createTemplate()  // ✅ Default data
const el2 = createTemplate({ value: "custom" })  // ✅ Custom data
await render(el1)
await render(el2)
```

**Benefits:**
- ✅ Data customizable
- ✅ Default values for demo
- ✅ Reusable with any data
- ✅ Type-safe with interfaces

### Pattern 3: Hybrid (✅ Best of Both)

```tsx
// For demo: Export constant
export const DemoTemplate = <Component data="demo" />

// For production: Export factory
export function createTemplate(data: CustomData) {
  return <Component data={data.value} />
}

// Use
const demo = DemoTemplate  // Quick demo
const prod = createTemplate(realData)  // Production use
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component calls printTemplate(id, customData)
    ↓
Hook: usePrinterOperations
    ↓
renderTemplateToBase64(id, customData)
    ↓
getTemplateElement(id, customData)
    ↓
createTemplateFactory(customData)
    ↓
<Component {...customData} />  ← JSX Element with data
    ↓
render(element)
    ↓
Uint8Array
    ↓
Base64 string
    ↓
Send to printer
```

---

## 💡 Advanced Usage

### 1. Type-Safe Custom Data

```tsx
// Define strict types
export interface BasicReceiptData {
  storeName: string  // Required
  items: ReceiptItem[]  // Required
  total: number  // Required
  taxRate?: number  // Optional
  discount?: number  // Optional
}

// Factory with typed data
export function createBasicReceiptTemplate(
  data: BasicReceiptData  // ← Strict type
) {
  const finalTotal = data.total * (1 - (data.discount || 0))
  const tax = finalTotal * (data.taxRate || 0)
  
  return (
    <BasicReceipt
      storeName={data.storeName}
      items={data.items}
      total={finalTotal + tax}
    />
  )
}

// Usage - TypeScript enforces types
const base64 = await renderTemplateToBase64("basic-receipt", {
  storeName: "My Store",  // ✅ Required
  items: myItems,  // ✅ Required
  total: 100,  // ✅ Required
  taxRate: 0.08,  // ✅ Optional
})
```

### 2. Data Validation

```tsx
export function createBasicReceiptTemplate(data?: Partial<BasicReceiptData>) {
  // Validate data
  if (data?.items && data.items.length === 0) {
    throw new Error("Receipt must have at least one item")
  }
  
  if (data?.total && data.total < 0) {
    throw new Error("Total cannot be negative")
  }
  
  return <BasicReceipt {...data} />
}
```

### 3. Data Transformation

```tsx
export function createBasicReceiptTemplate(data?: Partial<BasicReceiptData>) {
  // Transform data
  const items = data?.items?.map(item => ({
    ...item,
    price: Number(item.price.toFixed(2)),  // Format price
  })) || defaultItems
  
  const total = items.reduce((sum, item) => 
    sum + item.price * (item.quantity || 1), 0
  )
  
  return (
    <BasicReceipt
      storeName={data?.storeName || "Demo Store"}
      items={items}
      total={total}
    />
  )
}
```

### 4. Conditional Templates

```tsx
export function createReceiptTemplate(
  data: BasicReceiptData,
  options?: { detailed?: boolean }
) {
  if (options?.detailed) {
    return <DetailedReceipt {...data} />
  }
  return <BasicReceipt {...data} />
}
```

---

## 🎯 Best Practices

### ✅ DO:

```tsx
// 1. Provide default values for optional props
export function createTemplate(data?: Partial<Data>) {
  return <Component
    name={data?.name || "Default"}
    value={data?.value || 0}
  />
}

// 2. Type your data interfaces
export interface TemplateData {
  required: string
  optional?: number
}

// 3. Validate important data
if (!data?.items || data.items.length === 0) {
  throw new Error("Invalid data")
}

// 4. Keep factory functions pure
export function createTemplate(data: Data) {
  return <Component {...data} />  // ✅ Pure, no side effects
}
```

### ❌ DON'T:

```tsx
// 1. Don't mutate input data
export function createTemplate(data: Data) {
  data.value = 100  // ❌ Mutation!
  return <Component {...data} />
}

// 2. Don't make API calls in factories
export function createTemplate(data: Data) {
  const result = await fetch(...)  // ❌ Side effect!
  return <Component {...result} />
}

// 3. Don't use global state
let globalData = {}
export function createTemplate() {
  return <Component {...globalData} />  // ❌ Global state!
}

// 4. Don't skip validation
export function createTemplate(data: any) {  // ❌ any type!
  return <Component {...data} />  // ❌ No validation!
}
```

---

## 📊 Summary

### Before (Constant Export)
- ❌ Data hardcoded
- ❌ Not flexible
- ❌ One use case only

### After (Factory Functions)
- ✅ Data customizable
- ✅ Default + custom data
- ✅ Reusable for any scenario
- ✅ Type-safe
- ✅ Testable

### Pattern
```tsx
// Export factory function
export function createTemplate(data?: Partial<Data>) {
  return <Component {...mergeWithDefaults(data)} />
}

// Use with default data
const demo = createTemplate()

// Use with custom data
const prod = createTemplate(realData)

// Render
const base64 = await renderTemplateToBase64("template-id", customData)
```

**Result: Flexible, Type-Safe, Production-Ready! 🎉**

