# 🖨️ Type-Safe Print System Architecture

## Overview

This document explains the refactored print system architecture that provides **type-safe printing** across the entire application with **global printer state** and a **template registry pattern**.

---

## 🎯 Key Features

✅ **Type-Safe Template System** - Template IDs and data types are validated at compile-time  
✅ **Global Printer Context** - Printer selection persists across components and page reloads  
✅ **Template Registry Pattern** - No switch statements, easy to extend  
✅ **Lightweight Hooks** - Print from anywhere without loading all templates  
✅ **Reusable Components** - `PrintButton` component for consistent UX  

---

## 🏗️ Architecture Layers

### Layer 1: Global Context
**File:** `src/contexts/PrinterContext.tsx`

Provides global printer state with localStorage persistence:

```typescript
const { printers, selectedPrinter, setSelectedPrinter, refreshPrinters, isLoading } = usePrinter()
```

**Features:**
- Loads available printers on mount
- Persists selected printer to localStorage (`SELECTED_PRINTER`)
- Auto-selects first printer if none selected
- Shared across entire application

---

### Layer 2: Type System
**File:** `src/types/templates.ts`

Defines the **source of truth** for template → data type mapping:

```typescript
export type TemplateDataMap = {
  'test-pattern': undefined
  'basic-receipt': BasicReceiptData
  'order-ticket': OrderTicketData
}

export type TemplateId = keyof TemplateDataMap
```

**Adding a new template:**
1. Add interface for data (e.g., `InvoiceData`)
2. Add mapping: `'invoice': InvoiceData`
3. TypeScript enforces correct usage everywhere!

---

### Layer 3: Template Registry
**File:** `src/hooks/templates/registry.ts`

Type-safe registry that maps template IDs to renderer functions:

```typescript
export type TemplateRenderer<T> = (data?: T) => Promise<string>

export function getTemplateRenderer<T extends TemplateId>(
  templateId: T
): TemplateRenderer<TemplateDataMap[T]>
```

**Benefits:**
- ✅ No switch statements
- ✅ Open/Closed Principle compliance
- ✅ Type safety enforced by mapped types
- ✅ Easy to extend

---

### Layer 4: Template Hooks
**Location:** `src/hooks/templates/use*Template.tsx`

Each template is self-contained in its own hook:

```typescript
export const useBasicReceiptTemplate = () => {
  const getBasicReceiptTemplate = async (
    data?: BasicReceiptData
  ): Promise<string> => {
    // 1. Define JSX template inline
    const template = <Printer>...</Printer>
    
    // 2. Render to ESC/POS commands
    const uint8Array = await render(template)
    
    // 3. Convert to base64
    return uint8ArrayToBase64(uint8Array)
  }
  
  return { getBasicReceiptTemplate }
}
```

**Single Responsibility:**
- Each template manages its own rendering logic
- JSX defined directly in hook (not imported)
- Returns base64 string ready for printing

---

### Layer 5: Print Hook
**File:** `src/hooks/usePrint.ts`

Type-safe print function with generic constraints:

```typescript
export function usePrint() {
  const print = async <T extends TemplateId>(
    templateId: T,
    data?: TemplateDataMap[T]  // ← Type matches templateId automatically!
  ): Promise<void> => {
    const renderer = getTemplateRenderer(templateId)
    const base64Data = await renderer(data)
    await invoke("print_template", { printerName, base64Data })
  }
  
  return { print, isPrinting }
}
```

**Type Safety Example:**
```typescript
// ✅ Valid - data matches BasicReceiptData
print('basic-receipt', { items: [...], total: 100 })

// ❌ Compile Error - wrong data type!
print('basic-receipt', { orderNumber: '123' })

// ✅ Valid - data matches OrderTicketData
print('order-ticket', { orderNumber: '123', items: [...] })
```

---

### Layer 6: UI Components

#### PrintButton Component
**File:** `src/components/PrintButton.tsx`

Generic, type-safe, reusable button:

```typescript
<PrintButton 
  templateId="basic-receipt"
  data={{ items: cartItems, total: 100 }}
  label="Print Receipt"
  variant="default"
/>
```

**Type Safety:**
- `data` prop type is inferred from `templateId`
- TypeScript prevents wrong data types at compile-time

#### PrinterSelector Component
**File:** `src/components/PrinterSelector.tsx`

Uses global context, no props needed:

```typescript
<PrinterSelector />  // Automatically connected to global state
```

---

## 📊 Data Flow

```
User Action (e.g., Click Print Button)
    ↓
usePrint() hook
    ↓
getTemplateRenderer<T>(templateId: T)
    ↓
Template Hook (e.g., useBasicReceiptTemplate)
    ↓
    ├─ Define JSX template with data
    ├─ render(template) → Uint8Array (ESC/POS)
    └─ uint8ArrayToBase64() → Base64
    ↓
invoke("print_template", { printerName, base64Data })
    ↓
Rust Backend → Thermal Printer
    ↓
Toast notification (success/error)
```

---

## 💡 Usage Examples

### Example 1: Checkout Page

```typescript
import { usePrint } from '@/hooks/usePrint'
import type { BasicReceiptData } from '@/types/templates'

function CheckoutPage() {
  const { print, isPrinting } = usePrint()
  const [cart] = useCart()
  
  const handleCheckout = async () => {
    const receiptData: BasicReceiptData = {
      storeName: 'My Store',
      items: cart.items,
      total: cart.total
    }
    
    // Type-safe print call
    await print('basic-receipt', receiptData)
    
    // Continue with checkout...
  }
  
  return (
    <Button onClick={handleCheckout} disabled={isPrinting}>
      {isPrinting ? 'Printing...' : 'Checkout & Print'}
    </Button>
  )
}
```

---

### Example 2: Kitchen Order (with PrintButton)

```typescript
import { PrintButton } from '@/components/PrintButton'
import type { OrderTicketData } from '@/types/templates'

function KitchenPage({ order }) {
  const orderData: OrderTicketData = {
    orderNumber: order.id,
    tableName: order.table,
    items: order.items,
    timestamp: new Date()
  }
  
  return (
    <div>
      <h2>Order #{order.id}</h2>
      <PrintButton 
        templateId="order-ticket"
        data={orderData}
        label="Send to Kitchen"
      />
    </div>
  )
}
```

---

### Example 3: Settings Page (Printer Selection)

```typescript
import { PrinterSelector } from '@/components/PrinterSelector'

function SettingsPage() {
  // PrinterSelector automatically uses global context
  return (
    <div>
      <h2>Printer Settings</h2>
      <PrinterSelector />
      
      <p className="mt-4 text-sm text-muted-foreground">
        Selected printer is saved and will be used across the entire app.
      </p>
    </div>
  )
}
```

---

### Example 4: Multiple Print Buttons in One Component

```typescript
import { PrintButton } from '@/components/PrintButton'

function OrderSummaryPage({ order, receipt }) {
  return (
    <div className="flex gap-2">
      <PrintButton 
        templateId="basic-receipt"
        data={receipt}
        label="Print Receipt"
        variant="default"
      />
      
      <PrintButton 
        templateId="order-ticket"
        data={order}
        label="Print Kitchen Ticket"
        variant="secondary"
      />
    </div>
  )
}
```

---

## 🔧 How to Add a New Template

### Step 1: Create Data Interface
**File:** `src/types/templates.ts`

```typescript
export interface InvoiceData {
  invoiceNumber: string
  customerName: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
}
```

---

### Step 2: Add to Template Data Map
**File:** `src/types/templates.ts`

```typescript
export type TemplateDataMap = {
  'test-pattern': undefined
  'basic-receipt': BasicReceiptData
  'order-ticket': OrderTicketData
  'invoice': InvoiceData  // ← Add new template
}
```

---

### Step 3: Create Template Hook
**File:** `src/hooks/templates/useInvoiceTemplate.tsx`

```typescript
import { uint8ArrayToBase64 } from "@/utils/base64"
import { Br, Cut, Line, Printer, render, Row, Text } from "react-thermal-printer"
import type { InvoiceData } from "@/types/templates"

export const useInvoiceTemplate = () => {
  const getInvoiceTemplate = async (
    data?: InvoiceData
  ): Promise<string> => {
    const template = (
      <Printer type="epson" width={48}>
        <Text align="center" bold size={{ width: 2, height: 2 }}>
          INVOICE
        </Text>
        <Br />
        <Text>Invoice #: {data?.invoiceNumber}</Text>
        <Text>Customer: {data?.customerName}</Text>
        <Br />
        <Line />
        
        {/* Items */}
        {data?.items.map((item, index) => (
          <Row 
            key={index} 
            left={item.name} 
            right={`$${item.price.toFixed(2)}`} 
          />
        ))}
        
        <Line />
        <Row left="Subtotal:" right={`$${data?.subtotal.toFixed(2)}`} />
        <Row left="Tax:" right={`$${data?.tax.toFixed(2)}`} />
        <Row left="Total:" right={`$${data?.total.toFixed(2)}`} />
        
        <Cut partial lineFeeds={3} />
      </Printer>
    )
    
    const uint8Array = await render(template)
    return uint8ArrayToBase64(uint8Array)
  }
  
  return { getInvoiceTemplate }
}
```

---

### Step 4: Register in Registry
**File:** `src/hooks/templates/registry.ts`

```typescript
import { useInvoiceTemplate } from "./useInvoiceTemplate"

function initializeRegistry(): TemplateRegistry {
  const { getTestPatternTemplate } = useTestPatternTemplate()
  const { getBasicReceiptTemplate } = useBasicReceiptTemplate()
  const { getOrderTicketTemplate } = useOrderTicketTemplate()
  const { getInvoiceTemplate } = useInvoiceTemplate()  // ← Import

  return {
    "test-pattern": getTestPatternTemplate as TemplateRenderer<undefined>,
    "basic-receipt": getBasicReceiptTemplate as TemplateRenderer<TemplateDataMap["basic-receipt"]>,
    "order-ticket": getOrderTicketTemplate as TemplateRenderer<TemplateDataMap["order-ticket"]>,
    "invoice": getInvoiceTemplate as TemplateRenderer<TemplateDataMap["invoice"]>,  // ← Register
  }
}
```

---

### Step 5: Add to Constants (Optional - for demo)
**File:** `src/constants/templates.ts`

```typescript
export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  // ... existing templates
  {
    id: "invoice",
    name: "Invoice",
    description: "Detailed customer invoice",
    icon: "📄",
    category: "Invoice",
  },
]
```

---

### Step 6: Use in Your App

```typescript
import { usePrint } from '@/hooks/usePrint'

function InvoicePage({ invoice }) {
  const { print } = usePrint()
  
  const handlePrint = async () => {
    await print('invoice', {
      invoiceNumber: invoice.number,
      customerName: invoice.customer,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total
    })
  }
  
  return <Button onClick={handlePrint}>Print Invoice</Button>
}
```

**Done! 🎉** TypeScript now enforces correct data types for the invoice template!

---

## ✅ Type Safety Guarantees

### 1. Template ID Validation
```typescript
// ❌ Compile Error - unknown template
print('unknown-template', {})

// ✅ Only accepts registered template IDs
print('basic-receipt', { items: [], total: 0 })
```

### 2. Data Type Matching
```typescript
// ❌ Compile Error - data doesn't match template
print('basic-receipt', { orderNumber: '123' })

// ✅ Data type matches BasicReceiptData
print('basic-receipt', { items: [], total: 0 })
```

### 3. Required Data Enforcement
```typescript
// ❌ Compile Error - test-pattern doesn't accept data
print('test-pattern', { items: [] })

// ✅ test-pattern requires no data
print('test-pattern')
```

### 4. Registry Completeness
```typescript
// If you add a template to TemplateDataMap but forget to register it:
// ❌ TypeScript will show an error in registry.ts

type TemplateRegistry = {
  [K in TemplateId]: TemplateRenderer<TemplateDataMap[K]>
}
// ↑ This ensures ALL templates in TemplateDataMap are registered
```

---

## 🎯 Benefits Summary

| Before Refactoring | After Refactoring |
|-------------------|-------------------|
| ❌ Switch statement (violates Open/Closed) | ✅ Registry pattern (extensible) |
| ❌ Each component has separate state | ✅ Global printer context |
| ❌ Printer not persisted | ✅ localStorage persistence |
| ❌ Heavy hook loads all templates | ✅ Lightweight print hook |
| ❌ No type safety | ✅ **Full type safety** |
| ❌ Manual error-prone updates | ✅ TypeScript enforces correctness |
| ❌ Duplicate printer selection logic | ✅ Reusable PrintButton component |

---

## 🧪 Testing Type Safety

To verify type safety works, try these in your IDE:

```typescript
// Test 1: Wrong template ID
print('nonexistent', {})  
// ❌ Should show: Argument of type '"nonexistent"' is not assignable to parameter of type 'TemplateId'

// Test 2: Wrong data type
print('basic-receipt', { orderNumber: '123' })
// ❌ Should show: Type '{ orderNumber: string }' is not assignable to type 'BasicReceiptData'

// Test 3: Missing required data
const data: BasicReceiptData = { items: [] }
print('basic-receipt', data)
// ⚠️ Should show warning: Property 'total' is missing

// Test 4: Extra data passed to template that doesn't accept it
print('test-pattern', { items: [] })
// ❌ Should show: Expected 1 arguments, but got 2
```

---

## 📝 Code Organization

```
src/
├── contexts/
│   └── PrinterContext.tsx           ← Global printer state
│
├── types/
│   └── templates.ts                 ← Source of truth for types
│
├── hooks/
│   ├── usePrinter.ts                ← Access global context
│   ├── usePrint.ts                  ← Type-safe print function
│   └── templates/
│       ├── registry.ts              ← Template registry
│       ├── useTestPatternTemplate.tsx
│       ├── useBasicReceiptTemplate.tsx
│       └── useOrderTicketTemplate.tsx
│
├── components/
│   ├── PrintButton.tsx              ← Reusable type-safe button
│   ├── PrinterSelector.tsx          ← Global printer selection
│   └── TemplateList.tsx             ← Demo UI
│
├── constants/
│   └── templates.ts                 ← Template configs & demo data
│
└── utils/
    ├── base64.ts                    ← Base64 conversion
    └── template-helpers.ts          ← Template utilities
```

---

## 🚀 Production Ready

This architecture is:

- ✅ **Type-safe** - Compile-time validation prevents runtime errors
- ✅ **Scalable** - Easy to add new templates without modifying existing code
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Testable** - Each layer can be tested independently
- ✅ **User-friendly** - Global printer state persists across sessions
- ✅ **DRY** - No code duplication

---

## 📚 Related Documentation

- [`CODE-STRUCTURE.md`](./CODE-STRUCTURE.md) - Overall code organization
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Common issues and fixes
- [`README.md`](./README.md) - Project overview and setup

---

**Happy Printing! 🖨️✨**

