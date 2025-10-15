# 📁 Code Structure - Best Practices

## 🎯 Organizing Principles

### 1. **Constants** → `src/constants/`
Immutable values, configurations, default data

### 2. **Types** → `src/types/`
TypeScript interfaces, type definitions

### 3. **Helpers/Utils** → `src/utils/`
Pure functions, utility helpers

### 4. **Hooks** → `src/hooks/`
React hooks with business logic

### 5. **Components** → `src/components/`
React UI components

---

## 📂 Project Structure

```
src/
├── contexts/            ← Global state management
│   └── PrinterContext.tsx  ← Global printer state + localStorage
│
├── constants/           ← Constants & configs
│   └── templates.ts     ← Template configs, default demo data
│
├── types/               ← TypeScript types
│   └── templates.ts     ← Template data interfaces & type mapping
│
├── utils/               ← Helper functions
│   ├── base64.ts        ← Base64 conversion
│   └── template-helpers.ts  ← Template utilities
│
├── hooks/               ← React hooks
│   ├── usePrinter.ts    ← Access global printer context
│   ├── usePrint.ts      ← Type-safe print function
│   └── templates/       ← Template hooks (with inline JSX)
│       ├── registry.ts  ← Template registry (no switch statement!)
│       ├── useTestPatternTemplate.tsx
│       ├── useBasicReceiptTemplate.tsx
│       └── useOrderTicketTemplate.tsx
│
├── components/          ← UI components
│   ├── PrintButton.tsx  ← Reusable type-safe print button
│   ├── PrinterSelector.tsx  ← Global printer selection
│   ├── TemplateList.tsx
│   └── ui/              ← shadcn/ui components
│
├── templates/           ← Legacy (can be deleted)
│
└── App.tsx             ← Main application (wrapped in PrinterProvider)
```

---

## 📋 File Organization

### `src/constants/templates.ts`

**Purpose:** Constants and default configurations

```tsx
// ✅ Template metadata configs
export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  {
    id: "test-pattern",
    name: "Test Pattern",
    description: "...",
    icon: "🧪",
    category: "Test",
  },
  // ...
]

// ✅ Default demo data
export const DEFAULT_DEMO_RECEIPT_ITEMS = [...]
export const DEFAULT_DEMO_RECEIPT_TOTAL = 24.5
export const DEFAULT_DEMO_ORDER_ITEMS = [...]
```

**Contains:**
- ✅ Template configurations
- ✅ Default demo data
- ✅ Immutable constants

---

### `src/types/templates.ts`

**Purpose:** TypeScript type definitions

```tsx
// ✅ Receipt types
export interface ReceiptItem {
  name: string
  price: number
  quantity?: number
}

export interface BasicReceiptData {
  storeName?: string
  items?: ReceiptItem[]
  total?: number
}

// ✅ Order types
export interface OrderItem {
  name: string
  quantity: number
  notes?: string
}

export interface OrderTicketData {
  orderNumber?: string
  tableName?: string
  items?: OrderItem[]
  timestamp?: Date
}
```

**Contains:**
- ✅ Interface definitions
- ✅ Type aliases
- ✅ Shared types

---

### `src/utils/template-helpers.ts`

**Purpose:** Pure utility functions

```tsx
// ✅ Get template name by ID
export function getTemplateName(templateId: string): string {
  return TEMPLATE_CONFIGS.find(t => t.id === templateId)?.name || "Template"
}

// ✅ Get template config
export function getTemplateConfig(templateId: string) {
  return TEMPLATE_CONFIGS.find(t => t.id === templateId)
}

// ✅ Validate template ID
export function isValidTemplateId(templateId: string): boolean {
  return TEMPLATE_CONFIGS.some(t => t.id === templateId)
}
```

**Contains:**
- ✅ Pure functions
- ✅ No side effects
- ✅ Reusable utilities

---

### `src/hooks/useBasicReceiptTemplate.tsx`

**Purpose:** Template-specific hook with inline JSX

```tsx
import { DEFAULT_DEMO_RECEIPT_ITEMS, DEFAULT_DEMO_RECEIPT_TOTAL } from "@/constants/templates"
import type { BasicReceiptData } from "@/types/templates"

export const useBasicReceiptTemplate = () => {
  const getBasicReceiptTemplate = async (
    data?: BasicReceiptData
  ): Promise<string> => {
    const items = data?.items || DEFAULT_DEMO_RECEIPT_ITEMS
    const total = data?.total || DEFAULT_DEMO_RECEIPT_TOTAL

    const template = (
      <Printer type="epson" width={48}>
        {/* Inline JSX template */}
      </Printer>
    )

    const uint8Array = await render(template)
    return uint8ArrayToBase64(uint8Array)
  }

  return { getBasicReceiptTemplate }
}
```

**Contains:**
- ✅ Template rendering logic
- ✅ Inline JSX (not imported)
- ✅ Base64 conversion
- ✅ Uses constants from `@/constants`
- ✅ Uses types from `@/types`

---

### `src/hooks/usePrinterOperations.ts`

**Purpose:** Business logic orchestration

```tsx
import { getTemplateName } from "@/utils/template-helpers"
import { useTestPatternTemplate } from "./useTestPatternTemplate"
import { useBasicReceiptTemplate } from "./useBasicReceiptTemplate"
import { useOrderTicketTemplate } from "./useOrderTicketTemplate"

export function usePrinterOperations() {
  const { getTestPatternTemplate } = useTestPatternTemplate()
  const { getBasicReceiptTemplate } = useBasicReceiptTemplate()
  const { getOrderTicketTemplate } = useOrderTicketTemplate()

  const printTemplate = async (templateId: string, customData?: any) => {
    let base64Data: string

    switch (templateId) {
      case "test-pattern":
        base64Data = await getTestPatternTemplate()
        break
      case "basic-receipt":
        base64Data = await getBasicReceiptTemplate(customData)
        break
      // ...
    }

    await invoke("print_template", { base64Data })
  }

  return { printTemplate }
}
```

---

## 🎯 Benefits

### Before (Mixed Organization)

```
src/lib/templates.tsx   ← Mixed: configs + types + helpers + factories
```

**Problems:**
- ❌ Everything mixed together
- ❌ Hard to find specific things
- ❌ Not following conventions
- ❌ Difficult to maintain

### After (Organized Structure)

```
src/
├── constants/templates.ts       ← Configs & defaults
├── types/templates.ts           ← Type definitions
├── utils/template-helpers.ts    ← Utility functions
└── hooks/use*Template.tsx       ← Business logic
```

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Easy to find what you need
- ✅ Follows community conventions
- ✅ Scalable and maintainable

---

## 📊 Import Patterns

### Components Import Constants
```tsx
// App.tsx
import { TEMPLATE_CONFIGS } from "@/constants/templates"

<TemplateList templates={TEMPLATE_CONFIGS} />
```

### Hooks Import Constants + Types
```tsx
// useBasicReceiptTemplate.tsx
import { DEFAULT_DEMO_RECEIPT_ITEMS } from "@/constants/templates"
import type { BasicReceiptData } from "@/types/templates"

const items = data?.items || DEFAULT_DEMO_RECEIPT_ITEMS
```

### Business Logic Uses Helpers
```tsx
// usePrinterOperations.ts
import { getTemplateName } from "@/utils/template-helpers"

const templateName = getTemplateName(templateId)
```

---

## 🔄 Data Flow

```
Constants (constants/)
    ↓
Types (types/)
    ↓
Helpers (utils/)
    ↓
Template Hooks (hooks/)
    ↓
Operations Hook (hooks/)
    ↓
Components (components/)
    ↓
App (App.tsx)
```

---

## 📝 Naming Conventions

### Constants
- ✅ `UPPER_SNAKE_CASE` for constants
- ✅ `PascalCase` for interfaces/types in constants
- ✅ Prefix with category: `TEMPLATE_`, `DEFAULT_`, `CONFIG_`

```tsx
export const TEMPLATE_CONFIGS = [...]
export const DEFAULT_DEMO_RECEIPT_ITEMS = [...]
```

### Types
- ✅ `PascalCase` for interfaces
- ✅ Suffix with type name: `Data`, `Props`, `Config`

```tsx
export interface BasicReceiptData { ... }
export interface ReceiptItem { ... }
```

### Helpers
- ✅ `camelCase` for functions
- ✅ Verb prefix: `get`, `is`, `has`, `validate`

```tsx
export function getTemplateName() { ... }
export function isValidTemplateId() { ... }
```

### Hooks
- ✅ `use` prefix
- ✅ `PascalCase` for hook names

```tsx
export const useBasicReceiptTemplate = () => { ... }
```

---

## ✅ Checklist

When adding new features:

**Constants:**
- [ ] Are configs in `constants/`?
- [ ] Are default values in `constants/`?
- [ ] Using `UPPER_SNAKE_CASE`?

**Types:**
- [ ] Are interfaces in `types/`?
- [ ] Using descriptive names?
- [ ] Exported for reuse?

**Helpers:**
- [ ] Are utils in `utils/`?
- [ ] Functions pure (no side effects)?
- [ ] Well-named with verbs?

**Hooks:**
- [ ] Business logic in hooks?
- [ ] JSX inline (not imported)?
- [ ] Using constants and types?

---

## 🚀 Result

**Clean, Organized, Maintainable Code Structure! 🎉**

- ✅ Separation of Concerns
- ✅ Easy to Navigate
- ✅ Follows Best Practices
- ✅ Scalable Architecture
- ✅ Production Ready

