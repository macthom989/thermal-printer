import { Br, Cut, Line, Row, Text } from "react-thermal-printer"
import { ThermalPrinter } from "@/components/ThermalPrinter"
import { DEMO_RECEIPT_DATA } from "@/constants/mock-data"
import type { BasicReceiptData } from "@/types/templates"

/**
 * Basic receipt template for printing customer receipts
 * @param data - Receipt data including store name, items, and total
 */
export function getBasicReceiptTemplate(data?: BasicReceiptData) {
  const storeName = data?.storeName || DEMO_RECEIPT_DATA.storeName
  const items = data?.items || DEMO_RECEIPT_DATA.items
  const total = data?.total || DEMO_RECEIPT_DATA.total

  return (
    <ThermalPrinter>
      {/* Header */}
      <Text align="center" bold size={{ width: 2, height: 2 }}>
        {storeName}
      </Text>
      <Br />
      <Text align="center">Thank you for your purchase!</Text>
      <Br />
      <Line />
      <Br />

      {/* Items */}
      {items.map((item, index) => (
        <Row key={index} left={`${item.quantity || 1}x ${item.name}`} right={`$${item.price.toFixed(2)}`} />
      ))}

      <Br />
      <Line />
      <Br />

      {/* Total */}
      <Row left="TOTAL:" right="" />
      <Text align="right" bold size={{ width: 2, height: 2 }}>
        ${total.toFixed(2)}
      </Text>

      <Br />
      <Br />
      <Text align="center">Have a great day!</Text>

      <Cut partial lineFeeds={3} />
    </ThermalPrinter>
  )
}

