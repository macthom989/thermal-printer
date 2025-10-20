import { Cut, Text } from "react-thermal-printer"
import { ThermalPrinter } from "@/components/ThermalPrinter"

/**
 * Test pattern template for printer capability testing
 * Tests various text sizes, alignments, styles, and layouts
 */
export function getTestPatternTemplate() {
  return (
    <ThermalPrinter>
      <Text align="center" >
        HELLO WORLD
      </Text>
      <Cut partial lineFeeds={3} />
    </ThermalPrinter>
  )
}

