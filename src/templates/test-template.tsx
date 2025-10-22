import { ThermalPrinter } from "@/components/thermal-printer";
import { Text } from "react-thermal-printer";
import { DEFAULT_PRINTER_CONFIG } from "@/constants/printer";   

export function testTemplate() {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text size={{ width: 2, height: 2 }} align="center">RECEIPT</Text>
    </ThermalPrinter>
  )
}


