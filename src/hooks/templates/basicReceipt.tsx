import { uint8ArrayToBase64 } from "@/utils/base64"
import { useEffect } from "react"
import { Br, Cut, Line, Printer, render, Row, Text } from "react-thermal-printer"
import { DEMO_RECEIPT_DATA } from "@/constants/templates"
import type { BasicReceiptData } from "@/types/templates"

// Function to get basic receipt template
export function getBasicReceiptTemplate(data?: BasicReceiptData) {
  const storeName = data?.storeName || DEMO_RECEIPT_DATA.storeName
  const items = data?.items || DEMO_RECEIPT_DATA.items
  const total = data?.total || DEMO_RECEIPT_DATA.total

  return (
    <Printer type="epson" width={48}>
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
    </Printer>
  )
}

// Custom hook for basic receipt
export function useBasicReceipt() {
  useEffect(() => {
    console.log('basic-receipt hook initialized')
  }, [])

  const renderBasicReceipt = async (data?: BasicReceiptData): Promise<string> => {
    const template = getBasicReceiptTemplate(data)
    const uint8Array = await render(template)
    const base64 = uint8ArrayToBase64(uint8Array)
    return base64
  }

  return {
    renderBasicReceipt,
  }
}
