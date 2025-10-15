import type { BasicReceiptData, OrderTicketData, PrinterCheckboxOptions } from "@/types/templates"
import { getTestPatternTemplate } from "./testPattern"
import { getBasicReceiptTemplate } from "./basicReceipt"
import { getOrderTicketTemplate } from "./orderTicket"
import { getPrinterCheckboxTemplate } from "./printerCheckbox"
import type { JSX } from "react"

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

/**
 * Template function type
 * Takes optional data of type T and returns JSX.Element
 */
export type TemplateFunction<T> = (data?: T) => JSX.Element


/**
 * Type-safe template registry
 * Ensures all templates in TemplateDataMap are registered with correct data types
 */
type TemplateRegistry = {
  [K in TemplateId]: TemplateFunction<TemplateData[K]>
}


/**
 * Template registry - Direct mapping of template IDs to render functions
 * Uses 'satisfies' to ensure type safety without explicit type annotation
 * TypeScript will error if any template from TemplateDataMap is missing
 */
const TEMPLATE_REGISTRY: TemplateRegistry = {
  [TEMPLATE_REGISTRY_IDS.TEST_PATTERN]: getTestPatternTemplate,
  [TEMPLATE_REGISTRY_IDS.BASIC_RECEIPT]: getBasicReceiptTemplate,
  [TEMPLATE_REGISTRY_IDS.ORDER_TICKET]: getOrderTicketTemplate,
  [TEMPLATE_REGISTRY_IDS.PRINTER_CHECKBOX]: getPrinterCheckboxTemplate,
}

/**
 * Get template function by ID
 * Type-safe: returns template function with correct data type for the given template ID
 *
 * @example
 * const templateFn = getTemplateFunction('basic-receipt')
 * const element = templateFn({ items: [...], total: 100 })
 */
export function getTemplateFunction<T extends TemplateId>(templateId: T): TemplateFunction<TemplateData[T]> {
  const templateFn = TEMPLATE_REGISTRY[templateId]

  if (!templateFn) {
    throw new Error(`Template function not found for: ${templateId}`)
  }

  return templateFn
}

/**
 * Validate if a template ID is registered
 */
export function isRegisteredTemplate(templateId: string): templateId is TemplateId {
  return templateId in TEMPLATE_REGISTRY
}
