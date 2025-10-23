import type { Printer } from "react-thermal-printer"
import type { ComponentProps } from "react"

// Extract props type from Printer component
type PrinterProps = ComponentProps<typeof Printer>

/**
 * Hardcoded printer configuration
 * Change this to match your thermal printer name
 */
export const HARDCODED_PRINTER_NAME = "POS-80-Series (6)"

/**
 * Default printer settings for all templates
 * Provides consistent printer configuration across the application
 */
export const DEFAULT_PRINTER_CONFIG = {
  type: "epson",
  width: 48,
} as const satisfies Partial<PrinterProps>