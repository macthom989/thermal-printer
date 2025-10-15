import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TestPatternCard } from "./cards/TestPatternCard"
import { BasicReceiptCard } from "./cards/BasicReceiptCard"
import { OrderTicketCard } from "./cards/OrderTicketCard"

/**
 * Template List Component
 * Displays all available print templates as individual cards
 * Each card is responsible for fetching its own data
 */
export function TemplateList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Print Templates</CardTitle>
        <CardDescription>Click the buttons below to test different print templates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TestPatternCard />
          <BasicReceiptCard />
          <OrderTicketCard />
        </div>
      </CardContent>
    </Card>
  )
}
