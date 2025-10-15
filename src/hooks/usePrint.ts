import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { render } from "react-thermal-printer"
import { uint8ArrayToBase64 } from "@/utils/base64"
import { getTemplateFunction } from "./templates/registry"
import { HARDCODED_PRINTER_NAME } from "@/constants/printer"
import type { TemplateId, TemplateData } from "@/hooks/templates/registry"

/**
 * Type-safe print hook
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
  /**
   * Type-safe print function
   * Generic parameter T ensures data type matches templateId
   */
  const print = async <T extends TemplateId>(templateId: T, data?: TemplateData[T]): Promise<void> => {
    try {
      // Get type-safe template function
      const templateFn = getTemplateFunction(templateId)

      // Get template JSX
      const template = templateFn(data)
      // Render template to uint8Array
      const uint8Array = await render(template)

      // Convert to base64
      const base64Data = uint8ArrayToBase64(uint8Array)

      // Send to printer via Tauri
      await invoke("print", {
        printerName: HARDCODED_PRINTER_NAME,
        templateBase64: base64Data,
      })
      toast.success(`${templateId} printed successfully!`)
    } catch (error) {
      toast.error(`Failed to print: ${error}`)
      throw error
    }
  }

  return {
    print,
  }
}
