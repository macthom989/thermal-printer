import { Cut, Printer } from "react-thermal-printer"
import { DEFAULT_PRINTER_CONFIG, PRINTER_CONFIGS } from "@/constants/printer"
import type { ComponentProps, ReactNode } from "react"

// Extract props type from Printer component
type PrinterProps = ComponentProps<typeof Printer>

/**
 * Props for ThermalPrinter wrapper component
 * Extends PrinterProps but makes all props optional since we provide defaults
 */
interface ThermalPrinterProps extends Partial<PrinterProps> {
  children: ReactNode
  /**
   * Preset configuration name
   * Use "epson" or "star" for predefined configs
   */
  preset?: keyof typeof PRINTER_CONFIGS
}

/**
 * Wrapper component for react-thermal-printer's Printer component
 * Provides default configuration to avoid repetition across templates
 * 
 * @example
 * ```tsx
 * // Basic usage with defaults (epson, width 48)
 * <ThermalPrinter>
 *   <Text>Hello World</Text>
 * </ThermalPrinter>
 * 
 * // Override specific props
 * <ThermalPrinter width={42}>
 *   <Text>Narrower receipt</Text>
 * </ThermalPrinter>
 * 
 * // Use preset configuration
 * <ThermalPrinter preset="star">
 *   <Text>Star printer</Text>
 * </ThermalPrinter>
 * ```
 */
export function ThermalPrinter({
  children,
  preset,
  type = DEFAULT_PRINTER_CONFIG.type,
  width = DEFAULT_PRINTER_CONFIG.width,
  ...props
}: ThermalPrinterProps) {
  // Apply preset if specified
  const presetConfig = preset === "star"
    ? { type: "star" as const, characterSet: "pc437_usa" as const }
    : {}

  return (
    <Printer
      type={type}
      width={width}
      {...presetConfig}
      {...props}
    >
      {children}
      <Cut partial lineFeeds={1} />
    </Printer>
  )
}

