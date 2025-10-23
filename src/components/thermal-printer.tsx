import type { ComponentProps } from "react"
import { Cut, Printer } from "react-thermal-printer"
import { InitLineSpacing, InitPrinter, ResetPrinter } from "./thermal-printer.hardware"

type PrinterProps = ComponentProps<typeof Printer>

export function ThermalPrinter({ children, ...props }: PrinterProps) {
  return (
    <Printer {...props}>
      <ResetPrinter />
      <InitPrinter />
      <InitLineSpacing />
      {children}
      <Cut partial lineFeeds={1} />
    </Printer>
  )
}
