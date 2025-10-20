import { DEMO_ORDER_TICKET_DATA } from "@/constants/mock-data"
import type { OrderTicketData } from "@/types/templates"
import React from "react"
import { Br, Cut, Line, Text } from "react-thermal-printer"
import { ThermalPrinter } from "@/components/ThermalPrinter"

/**
 * Order ticket template for kitchen/bar printing
 * @param data - Order data including order number, table name, items, and timestamp
 */
export function getOrderTicketTemplate(data?: OrderTicketData) {
  const orderNumber = data?.orderNumber || DEMO_ORDER_TICKET_DATA.orderNumber
  const tableName = data?.tableName || DEMO_ORDER_TICKET_DATA.tableName
  const items = data?.items || DEMO_ORDER_TICKET_DATA.items
  const timestamp = data?.timestamp || DEMO_ORDER_TICKET_DATA.timestamp

  return (
    <ThermalPrinter>
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
    </ThermalPrinter>
  )
}

