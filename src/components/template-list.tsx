import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TestCard } from "./cards/test-card"
import { TableCard } from "./cards/table-card"

export function TemplateList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Print Templates</CardTitle>
        <CardDescription>Click the buttons below to test different print templates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TestCard />
          <TableCard />
        </div>
      </CardContent>
    </Card>
  )
}
