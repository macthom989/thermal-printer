import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrintButton } from "@/components/PrintButton"

/**
 * Test Pattern Card
 * Prints a basic test pattern to verify printer functionality
 * No data needed for this template
 */
export function TestPatternCard() {
  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">🧪</span>
          Test Pattern
        </CardTitle>
        <CardDescription className="text-xs">Basic printer test with various fonts and styles</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PrintButton templateId="test-pattern" label="Print Test" className="w-full" size="sm" />
      </CardContent>
    </Card>
  )
}
