import React from "react"
import { uint8ArrayToBase64 } from "@/utils/base64"
import { useEffect } from "react"
import { Br, Cut, Line, Printer, render, Text } from "react-thermal-printer"
import { DEMO_ORDER_TICKET_DATA } from "@/constants/templates"
import type { OrderTicketData } from "@/types/templates"

// Function to get order ticket template
export function getOrderTicketTemplate(data?: OrderTicketData) {
  const orderNumber = data?.orderNumber || DEMO_ORDER_TICKET_DATA.orderNumber
  const tableName = data?.tableName || DEMO_ORDER_TICKET_DATA.tableName
  const items = data?.items || DEMO_ORDER_TICKET_DATA.items
  const timestamp = data?.timestamp || DEMO_ORDER_TICKET_DATA.timestamp

  return (
    <Printer type="epson" width={48}>
      {/* Header */}
      <Text align="center" bold size={{ width: 2, height: 2 }}>
        ORDER #{orderNumber}
      </Text>
      <Br />
      <Text align="center" bold>
        {tableName}
      </Text>
      <Br />
      <Text align="center">{timestamp.toLocaleTimeString()}</Text>
      <Br />
      <Line />
      <Br />

      {/* Items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Text bold size={{ width: 2, height: 2 }}>
            {item.quantity}x {item.name}
          </Text>
          <Br />
          {item.notes && (
            <>
              <Text> Note: {item.notes}</Text>
              <Br />
            </>
          )}
          <Br />
        </React.Fragment>
      ))}

      <Line />
      <Br />
      <Text align="center">End of Order</Text>

      <Cut partial lineFeeds={3} />
    </Printer>
  )
}

// Custom hook for order ticket
export function useOrderTicket() {
  useEffect(() => {
    console.log('order-ticket hook initialized')
  }, [])

  const renderOrderTicket = async (data?: OrderTicketData): Promise<string> => {
    const template = getOrderTicketTemplate(data)
    const uint8Array = await render(template)
    const base64 = uint8ArrayToBase64(uint8Array)
    return base64
  }

  return {
    renderOrderTicket,
  }
}
