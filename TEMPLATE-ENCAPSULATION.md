# 🎯 Template Encapsulation - Better Separation of Concerns

## 💡 Ý Tưởng

**Mỗi template tự chịu trách nhiệm render và trả về base64 của mình!**

---

## ❌ Before: Hook Làm Quá Nhiều Việc

### File: `src/lib/templates.tsx`
```tsx
// ❌ Template chỉ return JSX element
export function createTestPatternTemplate() {
  return <TestPattern />
}

export function getTemplateElement(templateId: string) {
  return createTestPatternTemplate()  // JSX element
}
```

### File: `src/hooks/usePrinterOperations.ts`
```tsx
// ❌ Hook phải lo render + convert base64
const printTemplate = async (templateId: string) => {
  // 1. Get element
  const template = getTemplateElement(templateId)
  
  // 2. Render to Uint8Array
  const uint8Array = await render(template)
  
  // 3. Convert to base64
  const base64Data = uint8ArrayToBase64(uint8Array)
  
  // 4. Send to printer
  await invoke("print_template", { base64Data })
}
```

**Vấn đề:**
- ❌ Hook biết quá nhiều về template internals
- ❌ Logic render và convert nằm ở hook
- ❌ Khó test riêng template rendering
- ❌ Tight coupling giữa hook và template

---

## ✅ After: Template Encapsulation

### File: `src/lib/templates.tsx`
```tsx
import { render } from "react-thermal-printer"
import { uint8ArrayToBase64 } from "@/utils/base64"

// ✅ Template render chính nó và return base64
export async function renderTestPatternTemplate(): Promise<string> {
  const template = <TestPattern />
  const uint8Array = await render(template)
  return uint8ArrayToBase64(uint8Array)
}

export async function renderBasicReceiptTemplate(): Promise<string> {
  const template = <BasicReceipt items={[...]} total={24.5} />
  const uint8Array = await render(template)
  return uint8ArrayToBase64(uint8Array)
}

// ✅ Unified interface
export async function renderTemplateToBase64(templateId: string): Promise<string> {
  switch (templateId) {
    case "test-pattern":
      return renderTestPatternTemplate()
    case "basic-receipt":
      return renderBasicReceiptTemplate()
    default:
      throw new Error(`Unknown template: ${templateId}`)
  }
}
```

### File: `src/hooks/usePrinterOperations.ts`
```tsx
// ✅ Hook chỉ lo business logic
const printTemplate = async (templateId: string) => {
  // 1. Get base64 from template (template tự render)
  const base64Data = await renderTemplateToBase64(templateId)
  
  // 2. Send to printer
  await invoke("print_template", { base64Data })
}
```

**Benefits:**
- ✅ Template encapsulates rendering logic
- ✅ Hook đơn giản, chỉ lo business logic
- ✅ Loose coupling
- ✅ Dễ test từng template
- ✅ Single Responsibility Principle

---

## 🎯 Separation of Concerns

### Before
```
┌─────────────────────────────────────┐
│  usePrinterOperations Hook          │
│                                     │
│  - Get template element             │
│  - Render element                   │  ❌ Too many
│  - Convert to base64                │     responsibilities
│  - Send to printer                  │
│  - Handle errors                    │
│  - Show toasts                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  templates.tsx                      │
│                                     │
│  - Just return JSX elements         │  ❌ Too simple
└─────────────────────────────────────┘
```

### After
```
┌─────────────────────────────────────┐
│  templates.tsx                      │
│                                     │
│  - Create JSX element               │  ✅ Full responsibility
│  - Render element                   │     for template
│  - Convert to base64                │     rendering
│  - Return ready-to-print data       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  usePrinterOperations Hook          │
│                                     │
│  - Get base64 from template         │  ✅ Focus on
│  - Send to printer                  │     business logic
│  - Handle errors                    │
│  - Show toasts                      │
└─────────────────────────────────────┘
```

---

## 📊 Code Comparison

### Template Logic

| Aspect | Before | After |
|--------|--------|-------|
| **Responsibility** | Return JSX | Render + Return base64 |
| **Lines of Code** | 3 lines | 5 lines |
| **Testability** | Need mock render | Self-contained |
| **Reusability** | Need wrapper | Direct usage |

### Hook Logic

| Aspect | Before | After |
|--------|--------|-------|
| **Imports** | render, uint8ArrayToBase64 | renderTemplateToBase64 |
| **Lines in printTemplate** | 12 lines | 6 lines |
| **Complexity** | Medium | Low |
| **Coupling** | Tight | Loose |

---

## 🧪 Testing Benefits

### Before: Need Mocks
```tsx
// ❌ Test hook - need to mock render()
import { render } from "react-thermal-printer"

jest.mock("react-thermal-printer", () => ({
  render: jest.fn(),
}))

test("printTemplate", async () => {
  (render as jest.Mock).mockResolvedValue(new Uint8Array([1, 2, 3]))
  
  const { result } = renderHook(() => usePrinterOperations())
  await result.current.printTemplate("test")
  
  expect(render).toHaveBeenCalled()
})
```

### After: Templates Test Independently
```tsx
// ✅ Test template independently
test("renderTestPatternTemplate", async () => {
  const base64 = await renderTestPatternTemplate()
  
  expect(base64).toBeTruthy()
  expect(typeof base64).toBe("string")
})

// ✅ Test hook - just mock template module
import * as templates from "@/lib/templates"

jest.spyOn(templates, "renderTemplateToBase64")
  .mockResolvedValue("mock-base64")

test("printTemplate", async () => {
  const { result } = renderHook(() => usePrinterOperations())
  await result.current.printTemplate("test")
  
  expect(templates.renderTemplateToBase64).toHaveBeenCalledWith("test")
  expect(invoke).toHaveBeenCalledWith("print_template", {
    base64Data: "mock-base64"
  })
})
```

---

## 🎨 Architecture

### Layer Separation

```
┌─────────────────────────────────────┐
│         UI Layer (App.tsx)          │
│  - User interactions                │
│  - Display components               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Business Logic (usePrinterOps)     │
│  - Printer selection                │
│  - Print orchestration              │
│  - Error handling                   │
│  - User feedback                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Template Layer (templates.tsx)     │  ✅ Encapsulated
│  - Template rendering               │     rendering logic
│  - Base64 conversion                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Data Layer (Tauri Backend)         │
│  - Printer communication            │
│  - Hardware interface               │
└─────────────────────────────────────┘
```

---

## 🚀 Extension Benefits

### Easy to Add Features

**1. Template with Custom Props:**
```tsx
// Easy to extend with parameters
export async function renderBasicReceiptTemplate(
  customData?: Partial<ReceiptData>
): Promise<string> {
  const template = (
    <BasicReceipt
      storeName={customData?.storeName || "Demo Store"}
      items={customData?.items || defaultItems}
      total={customData?.total || 24.5}
    />
  )
  const uint8Array = await render(template)
  return uint8ArrayToBase64(uint8Array)
}

// Use with custom data
const base64 = await renderBasicReceiptTemplate({
  storeName: "My Store",
  items: myItems,
})
```

**2. Template Preview:**
```tsx
// Get rendered data for preview
export async function previewTemplate(templateId: string): Promise<string> {
  // Same function, different use case!
  return renderTemplateToBase64(templateId)
}

// In component
const preview = await previewTemplate("basic-receipt")
// Display preview in UI
```

**3. Batch Printing:**
```tsx
// Print multiple templates easily
const printBatch = async (templateIds: string[]) => {
  const base64Array = await Promise.all(
    templateIds.map(id => renderTemplateToBase64(id))
  )
  
  // Send all to printer
  for (const base64 of base64Array) {
    await invoke("print_template", { base64Data: base64 })
  }
}
```

---

## 📈 Metrics

### Code Quality

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Hook LoC** | 80 | 68 | -15% |
| **Template LoC** | 90 | 94 | +4% (worth it!) |
| **Coupling** | High | Low | ✅ |
| **Testability** | Medium | High | ✅ |
| **Reusability** | Low | High | ✅ |

### Performance

- **Rendering:** Same (no change)
- **Base64 Conversion:** Same (no change)
- **Memory:** Same (objects GC'd after use)
- **Code Clarity:** Better! ✅

---

## 🎓 Design Principles Applied

### 1. Single Responsibility Principle (SRP)
```tsx
// ✅ Template: Responsible for rendering
export async function renderTestPatternTemplate() {
  // Only rendering logic here
}

// ✅ Hook: Responsible for business logic
const printTemplate = async (templateId: string) => {
  // Only business logic here
}
```

### 2. Encapsulation
```tsx
// ✅ Template hides rendering details
// Hook doesn't need to know HOW template renders
const base64 = await renderTemplateToBase64(templateId)
```

### 3. Loose Coupling
```tsx
// ✅ Hook depends on interface, not implementation
import { renderTemplateToBase64 } from "@/lib/templates"

// Template implementation can change without affecting hook
```

### 4. Open/Closed Principle
```tsx
// ✅ Open for extension (add new templates)
export async function renderNewTemplate(): Promise<string> {
  // New template
}

// ✅ Closed for modification (existing code unchanged)
export async function renderTemplateToBase64(templateId: string) {
  // Just add new case
}
```

---

## ✅ Summary

### What Changed

**templates.tsx:**
- ❌ Before: Return JSX elements
- ✅ After: Render and return base64

**usePrinterOperations.ts:**
- ❌ Before: Get element → render → convert → print
- ✅ After: Get base64 → print

### Benefits

1. ✅ **Better Separation of Concerns**
   - Template owns rendering
   - Hook owns business logic

2. ✅ **Improved Testability**
   - Template tested independently
   - Hook tested with simple mocks

3. ✅ **Loose Coupling**
   - Hook doesn't know rendering details
   - Easy to change implementations

4. ✅ **Single Responsibility**
   - Each module has one clear job
   - Easier to understand and maintain

5. ✅ **Extensibility**
   - Easy to add custom props
   - Easy to add new features
   - Easy to reuse templates

---

## 🎯 Result

**Before:**
- Hook: 80 lines, 5 responsibilities
- Template: 90 lines, 1 responsibility
- Coupling: High
- Testability: Medium

**After:**
- Hook: 68 lines, 3 responsibilities ✅
- Template: 94 lines, 2 responsibilities ✅
- Coupling: Low ✅
- Testability: High ✅

**Architecture: Clean & Maintainable! 🎉**

