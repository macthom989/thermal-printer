# ✅ Final Template Pattern - Factory Functions

## 📚 Theo React Thermal Printer Docs

Từ [official documentation](https://github.com/seokju-na/react-thermal-printer):

### Official Usage Pattern:

```tsx
import { render, Printer, Text } from 'react-thermal-printer';

const receipt = (
  <Printer type="epson" width={42}>
    <Text>Hello World</Text>
  </Printer>
);

const data: Uint8Array = await render(receipt);
```

**Key Points:**
- ✅ Gán JSX element vào `const`
- ✅ Pass element trực tiếp vào `render()`
- ✅ Không cần wrap trong component function

---

## 🎯 Hai Patterns Khả Thi

### Pattern 1: Export Constant Elements

```tsx
// Export elements directly
export const TestPatternTemplate = <TestPattern />

export const BasicReceiptTemplate = (
  <BasicReceipt items={[...]} total={24.5} />
)

// Use
export function getTemplateElement(templateId: string) {
  switch (templateId) {
    case "test-pattern":
      return TestPatternTemplate  // Same instance
  }
}

const template = getTemplateElement("test-pattern")
await render(template)
```

**Pros:**
- ✅ Simple
- ✅ Element created once
- ✅ Follows volt-pos pattern

**Cons:**
- ⚠️ Reuses same element instance
- ⚠️ Potential mutation issues
- ⚠️ Not creating fresh element per render

---

### Pattern 2: Factory Functions ✅ (CURRENT)

```tsx
// Factory functions - create fresh element each time
export function createTestPatternTemplate() {
  return <TestPattern />
}

export function createBasicReceiptTemplate() {
  return (
    <BasicReceipt items={[...]} total={24.5} />
  )
}

// Use
export function getTemplateElement(templateId: string) {
  switch (templateId) {
    case "test-pattern":
      return createTestPatternTemplate()  // New instance
  }
}

const template = getTemplateElement("test-pattern")
await render(template)
```

**Pros:**
- ✅ Fresh element each time
- ✅ No mutation concerns
- ✅ More predictable
- ✅ Better for concurrent renders
- ✅ Follows React best practices

**Cons:**
- ⚠️ Slightly more code
- ⚠️ Creates new object each time (negligible performance impact)

---

## 🏆 Why Factory Functions?

### 1. Fresh Element Guarantee

```tsx
// Pattern 1: Same reference
const el1 = TestPatternTemplate
const el2 = TestPatternTemplate
console.log(el1 === el2)  // true ⚠️

// Pattern 2: New instances
const el1 = createTestPatternTemplate()
const el2 = createTestPatternTemplate()
console.log(el1 === el2)  // false ✅
```

### 2. React Element Immutability

React elements are supposed to be **immutable**. While `render()` from `react-thermal-printer` might not mutate them, it's safer to create fresh instances.

### 3. Concurrent Rendering Safe

```tsx
// If multiple prints happen simultaneously:
Promise.all([
  render(getTemplateElement("test")),  // ✅ Fresh element
  render(getTemplateElement("test")),  // ✅ Fresh element
  render(getTemplateElement("test")),  // ✅ Fresh element
])
// No shared state issues!
```

### 4. Future-Proof

If we need to add dynamic props or state in the future:

```tsx
// Easy to extend
export function createBasicReceiptTemplate(customData?: Partial<ReceiptData>) {
  return (
    <BasicReceipt
      storeName={customData?.storeName || "Demo Store"}
      items={customData?.items || defaultItems}
      total={customData?.total || 24.5}
    />
  )
}

// Use with custom data
const template = createBasicReceiptTemplate({
  storeName: "My Store",
  items: myItems,
})
```

---

## 📋 Current Implementation

### File: `src/lib/templates.tsx`

```tsx
import { BasicReceipt } from "@/templates/basic-receipt"
import { OrderTicket } from "@/templates/order-ticket"
import { TestPattern } from "@/templates/test-pattern"

// Template configs
export const templates: TemplateConfig[] = [...]

// ✅ Factory functions
export function createTestPatternTemplate() {
  return <TestPattern />
}

export function createBasicReceiptTemplate() {
  return (
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
}

export function createOrderTicketTemplate() {
  return (
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
}

// Get template element by ID
export function getTemplateElement(templateId: string) {
  switch (templateId) {
    case "test-pattern":
      return createTestPatternTemplate()  // ✅ Fresh each time
    case "basic-receipt":
      return createBasicReceiptTemplate()
    case "order-ticket":
      return createOrderTicketTemplate()
    default:
      throw new Error(`Unknown template: ${templateId}`)
  }
}
```

### File: `src/hooks/usePrinterOperations.ts`

```tsx
const printTemplate = async (templateId: string) => {
  // ...
  
  // ✅ Get fresh element
  const template = getTemplateElement(templateId)
  
  // ✅ Render to Uint8Array
  const uint8Array = await render(template)
  
  // ✅ Print
  await invoke("print_template", {
    printerName: selectedPrinter,
    base64Data: uint8ArrayToBase64(uint8Array),
  })
}
```

---

## 🎨 Pattern Comparison with Docs

### Official Docs Pattern:

```tsx
// Create inline
const data = await render(
  <Printer type="epson">
    <Text>Hello World</Text>
  </Printer>
);
```

### Our Factory Pattern:

```tsx
// Create via factory
const template = createTestPatternTemplate()
const data = await render(template)
```

**Both are valid!** Factory just adds:
- ✅ Reusability
- ✅ Centralized template management
- ✅ Type safety

---

## 📊 Performance Impact

### Element Creation Cost

```tsx
// Pattern 1: Created once at module load
export const Template = <TestPattern />  // ~0.1ms once

// Pattern 2: Created on each call
export function createTemplate() {
  return <TestPattern />  // ~0.1ms per call
}
```

**Impact:** Negligible! Element creation is extremely fast.

### Memory Impact

```tsx
// Pattern 1: 1 instance in memory
const el1 = Template
const el2 = Template  // Same reference

// Pattern 2: N instances
const el1 = createTemplate()  // New object
const el2 = createTemplate()  // New object
// Garbage collected after use
```

**Impact:** Minimal! Elements are small objects and GC is efficient.

---

## 🎓 Best Practices

### ✅ DO:

```tsx
// Use factory functions for templates
export function createMyTemplate(props?: Partial<Props>) {
  return <MyTemplate {...defaultProps} {...props} />
}

// Create fresh element for each render
const template = createMyTemplate()
await render(template)

// Allow custom props for flexibility
const template = createMyTemplate({ storeName: "Custom" })
```

### ❌ DON'T:

```tsx
// Don't mutate exported elements
export const MyTemplate = <Template />
MyTemplate.props.storeName = "Changed"  // ❌ Bad!

// Don't reuse element across async operations without testing
const template = MyTemplate
Promise.all([
  render(template),  // ⚠️ Potential issue
  render(template),  // ⚠️ Potential issue
])
```

---

## 📚 References

- **react-thermal-printer GitHub:** https://github.com/seokju-na/react-thermal-printer
- **React Elements:** https://react.dev/reference/react/createElement
- **React Best Practices:** https://react.dev/learn

---

## ✅ Summary

**Pattern Chọn:** ✅ **Factory Functions**

**Lý Do:**
1. ✅ Fresh element mỗi lần render
2. ✅ No mutation concerns
3. ✅ Concurrent rendering safe
4. ✅ Easy to extend with custom props
5. ✅ Follows React best practices
6. ✅ Still simple and readable
7. ✅ Negligible performance impact

**Kết Quả:**
- Code clean ✅
- Type-safe ✅  
- Maintainable ✅
- Production-ready ✅

**Pattern đã được implement và tested! 🎉**

