import { PrintButton } from "@/components/print-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DEMO_TABLE_DATA } from "@/constants/mock-data"
import { TEMPLATE_REGISTRY_IDS } from "@/hooks/usePrint"

export function TableCard() {
  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">🧾</span>
          Table
        </CardTitle>
        <CardDescription className="text-xs">
          Table template
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TABLE} data={DEMO_TABLE_DATA} label="Print Table" className="w-full" size="sm" />
      </CardContent>
    </Card>
  )
}
