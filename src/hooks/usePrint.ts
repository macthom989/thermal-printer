import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { render } from "react-thermal-printer"
import { useState } from "react"
import { uint8ArrayToBase64 } from "@/utils/base64"
import { HARDCODED_PRINTER_NAME } from "@/constants/printer"
import { getTestPatternTemplate } from "@/templates/testPattern"
import { getOrderTicketTemplate } from "@/templates/orderTicket"
import { getBasicReceiptTemplate } from "@/templates/basicReceipt"
import { getPrinterCheckboxTemplate } from "@/templates/printerCheckbox"
import type { JSX } from "react"
import type { BasicReceiptData, OrderTicketData, PrinterCheckboxOptions } from "@/types/templates"

// Template Registry IDs
export const TEMPLATE_REGISTRY_IDS = {
  TEST_PATTERN: 'test-pattern',
  BASIC_RECEIPT: 'basic-receipt',
  ORDER_TICKET: 'order-ticket',
  PRINTER_CHECKBOX: 'printer-checkbox',
} as const

export type TemplateId = typeof TEMPLATE_REGISTRY_IDS[keyof typeof TEMPLATE_REGISTRY_IDS]

// Template Data Mapping - Ensures type safety between templateId and data
export type TemplateData = {
  [TEMPLATE_REGISTRY_IDS.TEST_PATTERN]: undefined
  [TEMPLATE_REGISTRY_IDS.BASIC_RECEIPT]: BasicReceiptData
  [TEMPLATE_REGISTRY_IDS.ORDER_TICKET]: OrderTicketData
  [TEMPLATE_REGISTRY_IDS.PRINTER_CHECKBOX]: PrinterCheckboxOptions
}

// Template function type
type TemplateFunction<T> = (data?: T) => JSX.Element

// Template Registry - Maps template IDs to their render functions
type TemplateRegistry = {
  [K in TemplateId]: TemplateFunction<TemplateData[K]>
}

const TEMPLATE_FUNCTIONS: TemplateRegistry = {
  [TEMPLATE_REGISTRY_IDS.TEST_PATTERN]: getTestPatternTemplate,
  [TEMPLATE_REGISTRY_IDS.BASIC_RECEIPT]: getBasicReceiptTemplate,
  [TEMPLATE_REGISTRY_IDS.ORDER_TICKET]: getOrderTicketTemplate,
  [TEMPLATE_REGISTRY_IDS.PRINTER_CHECKBOX]: getPrinterCheckboxTemplate,
}

export const useGetTemplate = () => {
  const getTemplate = async <T extends TemplateId>(templateId: T, data?: TemplateData[T]): Promise<string> => {
    const templateFn = TEMPLATE_FUNCTIONS[templateId]
    
    if (!templateFn) {
      throw new Error(`Template ${templateId} not supported`)
    }
    
    // TypeScript now correctly infers the type relationship between templateId and data
    const template = templateFn(data)
    const uint8Array = await render(template)
    return uint8ArrayToBase64(uint8Array)
  }

  return {
    getTemplate,
  }
}

/**
 * Type-safe print hook with loading state
 * Provides a print function that ensures templateId and data types match
 *
 * @example
 * const { print, isPrinting } = usePrint()
 *
 * // Type-safe: data must match BasicReceiptData
 * await print('basic-receipt', {
 *   storeName: 'My Store',
 *   items: [...],
 *   total: 100
 * })
 *
 * // TypeScript error: wrong data type!
 * await print('basic-receipt', { orderNumber: '123' })
 */
export function usePrint() {
  const { getTemplate } = useGetTemplate()
  const [isPrinting, setIsPrinting] = useState(false)

  /**
   * Type-safe print function
   * Generic parameter T ensures data type matches templateId
   */
  const print = async <T extends TemplateId>(templateId: T, data?: TemplateData[T]): Promise<void> => {
    if (isPrinting) {
      toast.warning("A print job is already in progress")
      return
    }

    setIsPrinting(true)
    try {
      // Get type-safe template function
      const template = await getTemplate(templateId, data)

      // Send to printer via Tauri
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
    } finally {
      setIsPrinting(false)
    }
  }

  return {
    print,
    isPrinting,
  }
}
