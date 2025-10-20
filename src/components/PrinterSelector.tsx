import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLATE_REGISTRY_IDS, usePrint } from "@/hooks/usePrint"
import { HARDCODED_PRINTER_NAME } from "@/constants/printer"

export function PrinterSelector() {
  const { print, isPrinting } = usePrint()

  const handleTest = async () => {
    await print(TEMPLATE_REGISTRY_IDS.TEST_PATTERN)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Printer Configuration
        </CardTitle>
        <CardDescription>Hardcoded printer (configured in constants/printer.ts)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Current Printer:</span>
            <Badge variant="secondary" className="font-mono">
              {HARDCODED_PRINTER_NAME}
            </Badge>
          </div>

          <Button onClick={handleTest} disabled={isPrinting}>
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? "Printing..." : "Test Print"}
          </Button>
        </div>

        <p className="text-muted-foreground mt-3 text-xs">
          To change printer, edit <code className="text-foreground">HARDCODED_PRINTER_NAME</code> in{" "}
          <code className="text-foreground">src/constants/printer.ts</code>
        </p>
      </CardContent>
    </Card>
  )
}
