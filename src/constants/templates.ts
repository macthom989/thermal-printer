// Demo data for Basic Receipt template
export const DEMO_RECEIPT_DATA = {
  storeName: "Demo Store",
  items: [
    { name: "Coffee", price: 5.0, quantity: 2 },
    { name: "Sandwich", price: 8.5, quantity: 1 },
    { name: "Cookie", price: 2.5, quantity: 3 },
  ],
  total: 24.5,
}

// Demo data for Order Ticket template
export const DEMO_ORDER_TICKET_DATA = {
  orderNumber: "001",
  tableName: "Table 5",
  items: [
    { name: "Burger", quantity: 2, notes: "No onions" },
    { name: "Fries", quantity: 2 },
    { name: "Coke", quantity: 1, notes: "Extra ice" },
  ],
  timestamp: new Date(),
}
