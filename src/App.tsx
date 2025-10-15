import { Printer } from "lucide-react"
import { Toaster } from "sonner"
import { PrinterSelector } from "./components/PrinterSelector"
import { TemplateList } from "./components/TemplateList"
import { PrinterCheckbox } from "./components/PrinterCheckbox"
import { Badge } from "@/components/ui/badge"

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <div className="from-background to-muted min-h-screen bg-gradient-to-br">
        <div className="container mx-auto max-w-7xl p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-primary rounded-lg p-3">
                <Printer className="text-primary-foreground h-8 w-8" />
              </div>
              <div>
                <h1 className="text-foreground text-4xl font-bold">Thermal Printer Test</h1>
                <p className="text-muted-foreground mt-1">Test thermal printer templates and manage print jobs</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline">React + Tauri</Badge>
              <Badge variant="outline">ESC/POS</Badge>
              <Badge variant="outline">Windows</Badge>
              <Badge variant="outline">Type-Safe</Badge>
            </div>
          </div>

          {/* Printer Selector */}
          <div className="mb-6">
            <PrinterSelector />
          </div>

          {/* Template List */}
          <TemplateList />

          {/* Printer Options Tester */}
          <div className="mt-6">
            <PrinterCheckbox />
          </div>
        </div>
      </div>
    </>
  )
}
