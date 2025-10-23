import { IReceipt } from "@/components/cards/receipt-card"
import { HARDCODED_PRINTER_NAME } from "@/constants/printer"
import {
  testAlignTemplate,
  testBeepTemplate,
  testBoldTemplate,
  testCashDrawerTemplate,
  testFontTemplate,
  testImageTemplate,
  testInvertTemplate,
  testItalicTemplate,
  testSizeTemplate,
  testStrikethroughTemplate,
  testUnderlineTemplate,
} from "@/templates/quick-test"
import { receiptTemplate } from "@/templates/receipt-template"
import { tableTemplate } from "@/templates/table-template"
import { testTemplate } from "@/templates/test-template"
import type { TableData } from "@/types/templates"
import { uint8ArrayToBase64 } from "@/utils/base64"
import { invoke } from "@tauri-apps/api/core"
import type { JSX } from "react"
import { render } from "react-thermal-printer"
import { toast } from "sonner"

// Template Registry IDs
export const TEMPLATE_REGISTRY_IDS = {
  TEST: "test",
  RECEIPT: "receipt",
  BEEP_SIGNAL: "beep-signal",
  TABLE: "table",
  TEXT_BOLD: "text-bold",
  TEXT_UNDERLINE: "text-underline",
  TEXT_ALIGN: "text-align",
  TEXT_ITALIC: "text-italic",
  TEXT_INVERT: "text-invert",
  TEXT_FONT: "text-font",
  TEXT_SIZE: "text-size",
  CASH_DRAWER: "cash-drawer",
  IMAGE: "image",
  STRIKE_THROUGH: "strike-through",
} as const

export type TemplateId = (typeof TEMPLATE_REGISTRY_IDS)[keyof typeof TEMPLATE_REGISTRY_IDS]

// Template Data Mapping - Ensures type safety between templateId and data
export type TemplateData = {
  [TEMPLATE_REGISTRY_IDS.TEST]: undefined
  [TEMPLATE_REGISTRY_IDS.RECEIPT]: IReceipt
  [TEMPLATE_REGISTRY_IDS.TABLE]: TableData
  [TEMPLATE_REGISTRY_IDS.TEXT_BOLD]: undefined
  [TEMPLATE_REGISTRY_IDS.TEXT_UNDERLINE]: undefined
  [TEMPLATE_REGISTRY_IDS.TEXT_ALIGN]: undefined
  [TEMPLATE_REGISTRY_IDS.TEXT_ITALIC]: undefined
  [TEMPLATE_REGISTRY_IDS.TEXT_INVERT]: undefined
  [TEMPLATE_REGISTRY_IDS.TEXT_FONT]: undefined
  [TEMPLATE_REGISTRY_IDS.TEXT_SIZE]: undefined
  [TEMPLATE_REGISTRY_IDS.BEEP_SIGNAL]: undefined
  [TEMPLATE_REGISTRY_IDS.CASH_DRAWER]: undefined
  [TEMPLATE_REGISTRY_IDS.IMAGE]: undefined
  [TEMPLATE_REGISTRY_IDS.STRIKE_THROUGH]: string
}

// Template function type
type TemplateFunction<T> = (data?: T) => JSX.Element

// Template Registry - Maps template IDs to their render functions
type TemplateRegistry = {
  [K in TemplateId]: TemplateFunction<TemplateData[K]>
}

const TEMPLATES: TemplateRegistry = {
  [TEMPLATE_REGISTRY_IDS.TEST]: testTemplate,
  [TEMPLATE_REGISTRY_IDS.RECEIPT]: receiptTemplate,
  [TEMPLATE_REGISTRY_IDS.TABLE]: tableTemplate,
  [TEMPLATE_REGISTRY_IDS.BEEP_SIGNAL]: testBeepTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_BOLD]: testBoldTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_UNDERLINE]: testUnderlineTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_ALIGN]: testAlignTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_ITALIC]: testItalicTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_INVERT]: testInvertTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_FONT]: testFontTemplate,
  [TEMPLATE_REGISTRY_IDS.TEXT_SIZE]: testSizeTemplate,
  [TEMPLATE_REGISTRY_IDS.CASH_DRAWER]: testCashDrawerTemplate,
  [TEMPLATE_REGISTRY_IDS.IMAGE]: testImageTemplate,
  [TEMPLATE_REGISTRY_IDS.STRIKE_THROUGH]: testStrikethroughTemplate,
}

export const getTemplate = async <T extends TemplateId>(templateId: T, data?: TemplateData[T]): Promise<string> => {
  const templateFn = TEMPLATES[templateId]

  if (!templateFn) {
    throw new Error(`Template ${templateId} not supported`)
  }

  const template = templateFn(data)
  const uint8Array = await render(template)
  return uint8ArrayToBase64(uint8Array)
}

export const usePrint = () => {
  const print = async <T extends TemplateId>(templateId: T, data?: TemplateData[T]): Promise<void> => {
    try {
      const template = await getTemplate(templateId, data)
      await invoke("print", {
        printerName: HARDCODED_PRINTER_NAME,
        templateBase64: template,
      })
      toast.success(`Successfully printed ${templateId}`, {
        description: `Sent to ${HARDCODED_PRINTER_NAME}`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      toast.error("Print Failed", {
        description: errorMessage,
      })
      console.error(`Print error for ${templateId}:`, error)
      throw error
    }
  }

  return { print }
}
