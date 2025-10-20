import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrintButton } from "@/components/PrintButton"
import { DEMO_ORDER_TICKET_DATA } from "@/constants/mock-data"

/**
 * Order Ticket Card
 * Each card controls its own data fetching logic
 */
export function OrderTicketCard() {
  // This card is responsible for getting its own data
  // In a real app, you would:
  // - Fetch from API: const { data } = useQuery('order', fetchLatestOrder)
  // - Get from WebSocket: const data = useWebSocket('/orders/latest')
  // - Get from state: const data = useAppSelector(state => state.orders.current)
  // - Receive as props: const { orderData } = props

  const orderData = {
    ...DEMO_ORDER_TICKET_DATA,
    timestamp: new Date(), // Always use current time
  }

  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">📝</span>
          Order Ticket
        </CardTitle>
        <CardDescription className="text-xs">
          Kitchen/bar order ticket
          <br />
          <span className="text-muted-foreground text-[10px]">
            {orderData.tableName} • Order #{orderData.orderNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PrintButton
          templateId="order-ticket"
          data={orderData}
          label="Print Order"
          className="w-full"
          size="sm"
        />
      </CardContent>
    </Card>
  )
}
