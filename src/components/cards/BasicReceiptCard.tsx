import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrintButton } from "@/components/PrintButton"
import { DEMO_RECEIPT_DATA } from "@/constants/mock-data"

/**
 * Basic Receipt Card
 * Each card controls its own data fetching logic
 */
export function BasicReceiptCard() {
  // This card is responsible for getting its own data
  // In a real app, you would:
  // - Fetch from API: const { data } = useQuery('receipt', fetchReceipt)
  // - Get from state: const data = useAppSelector(state => state.cart.receipt)
  // - Receive as props: const { receiptData } = props
  
  const receiptData = DEMO_RECEIPT_DATA

  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">🧾</span>
          Basic Receipt
        </CardTitle>
        <CardDescription className="text-xs">
          Simple sales receipt template
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PrintButton templateId="basic-receipt" data={receiptData} label="Print Receipt" className="w-full" size="sm" />
      </CardContent>
    </Card>
  )
}
