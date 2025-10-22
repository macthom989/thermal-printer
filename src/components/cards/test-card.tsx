import { PrintButton } from "@/components/print-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATE_REGISTRY_IDS } from "@/hooks/usePrint";

export function TestCard() {
  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">🧪</span>
          Test
        </CardTitle>
        <CardDescription className="text-xs">Basic printer test with various fonts and styles</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEST} label="Print Test" className="w-full" size="sm" />
      </CardContent>
    </Card>
  )
}
