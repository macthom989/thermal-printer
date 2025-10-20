import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TEMPLATE_REGISTRY_IDS, usePrint } from "@/hooks/usePrint"
import type { PrinterCheckboxOptions } from "@/types/templates"

export function PrinterCheckbox() {
  const { print, isPrinting } = usePrint()
  const [options, setOptions] = useState<PrinterCheckboxOptions>({})
  const [imageUrl, setImageUrl] = useState("https://res.cloudinary.com/dfyqylutr/image/upload/v1760557111/15825362_a7pzi7.png")

  const selectedCount = Object.values(options).filter(Boolean).length

  const handleCheckboxChange = (key: keyof PrinterCheckboxOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelectAll = (keys: (keyof PrinterCheckboxOptions)[]) => {
    setOptions(prev => {
      const newOptions = { ...prev } as Record<string, boolean | string | undefined>
      keys.forEach(key => {
        if (key !== 'imageUrl') {
          newOptions[key] = true
        }
      })
      return newOptions as PrinterCheckboxOptions
    })
  }

  const handleDeselectAll = (keys: (keyof PrinterCheckboxOptions)[]) => {
    setOptions(prev => {
      const newOptions = { ...prev } as Record<string, boolean | string | undefined>
      keys.forEach(key => {
        if (key !== 'imageUrl') {
          newOptions[key] = false
        }
      })
      return newOptions as PrinterCheckboxOptions
    })
  }

  const handleResetAll = () => {
    setOptions({})
    setImageUrl("https://res.cloudinary.com/dfyqylutr/image/upload/v1760557111/15825362_a7pzi7.png")
  }

  const handlePrint = async () => {
    await print(TEMPLATE_REGISTRY_IDS.PRINTER_CHECKBOX, { ...options, imageUrl })
  }

  const textStyleKeys: (keyof PrinterCheckboxOptions)[] = ['bold', 'doubleStrike', 'underline', 'invert', 'fontA', 'fontB', 'size1x1', 'size2x1', 'size1x2', 'size2x2']
  const alignmentKeys: (keyof PrinterCheckboxOptions)[] = ['alignLeft', 'alignCenter', 'alignRight']
   const specialElementKeys: (keyof PrinterCheckboxOptions)[] = ['line', 'row', 'barcode', 'qrCode', 'image']
   const escposKeys: (keyof PrinterCheckboxOptions)[] = ['initPrinter', 'cutPartial', 'cutFull', 'lineFeeds', 'characterSpacing']

   return (
     <Card>
       <CardHeader>
         <div className="flex items-center justify-between">
           <div>
             <CardTitle>Printer Options Tester</CardTitle>
             <CardDescription>
               Select printer features to test • {selectedCount} option{selectedCount !== 1 ? 's' : ''} selected
             </CardDescription>
           </div>
           {selectedCount > 0 && (
             <Button
               variant="outline"
               size="sm"
               onClick={handleResetAll}
               className="text-xs"
             >
               Reset All
             </Button>
           )}
         </div>
       </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Styles Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Text Styles</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(textStyleKeys)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeselectAll(textStyleKeys)}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="bold"
                 checked={options.bold || false}
                 onCheckedChange={() => handleCheckboxChange('bold')}
               />
               <label htmlFor="bold" className="text-sm cursor-pointer">
                 Bold
               </label>
             </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="doubleStrike"
                 checked={options.doubleStrike || false}
                 onCheckedChange={() => handleCheckboxChange('doubleStrike')}
               />
               <label htmlFor="doubleStrike" className="text-sm cursor-pointer">
                 Double Strike
               </label>
             </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="underline"
                checked={options.underline || false}
                onCheckedChange={() => handleCheckboxChange('underline')}
              />
              <label htmlFor="underline" className="text-sm cursor-pointer">
                Underline
              </label>
            </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="invert"
                 checked={options.invert || false}
                 onCheckedChange={() => handleCheckboxChange('invert')}
               />
               <label htmlFor="invert" className="text-sm cursor-pointer">
                 Invert
               </label>
             </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="fontA"
                 checked={options.fontA || false}
                 onCheckedChange={() => handleCheckboxChange('fontA')}
               />
               <label htmlFor="fontA" className="text-sm cursor-pointer">
                 Font A
               </label>
             </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="fontB"
                 checked={options.fontB || false}
                 onCheckedChange={() => handleCheckboxChange('fontB')}
               />
               <label htmlFor="fontB" className="text-sm cursor-pointer">
                 Font B
               </label>
             </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="size1x1"
                checked={options.size1x1 || false}
                onCheckedChange={() => handleCheckboxChange('size1x1')}
              />
              <label htmlFor="size1x1" className="text-sm cursor-pointer">
                Size 1x1
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="size2x1"
                checked={options.size2x1 || false}
                onCheckedChange={() => handleCheckboxChange('size2x1')}
              />
              <label htmlFor="size2x1" className="text-sm cursor-pointer">
                Size 2x1
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="size1x2"
                checked={options.size1x2 || false}
                onCheckedChange={() => handleCheckboxChange('size1x2')}
              />
              <label htmlFor="size1x2" className="text-sm cursor-pointer">
                Size 1x2
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="size2x2"
                checked={options.size2x2 || false}
                onCheckedChange={() => handleCheckboxChange('size2x2')}
              />
              <label htmlFor="size2x2" className="text-sm cursor-pointer">
                Size 2x2
              </label>
            </div>
          </div>
        </div>

        {/* Alignment Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Alignment</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(alignmentKeys)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeselectAll(alignmentKeys)}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alignLeft"
                checked={options.alignLeft || false}
                onCheckedChange={() => handleCheckboxChange('alignLeft')}
              />
              <label htmlFor="alignLeft" className="text-sm cursor-pointer">
                Left
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alignCenter"
                checked={options.alignCenter || false}
                onCheckedChange={() => handleCheckboxChange('alignCenter')}
              />
              <label htmlFor="alignCenter" className="text-sm cursor-pointer">
                Center
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alignRight"
                checked={options.alignRight || false}
                onCheckedChange={() => handleCheckboxChange('alignRight')}
              />
              <label htmlFor="alignRight" className="text-sm cursor-pointer">
                Right
              </label>
            </div>
          </div>
        </div>

        {/* Special Elements Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Special Elements</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(specialElementKeys)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeselectAll(specialElementKeys)}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="line"
                checked={options.line || false}
                onCheckedChange={() => handleCheckboxChange('line')}
              />
              <label htmlFor="line" className="text-sm cursor-pointer">
                Line
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="row"
                checked={options.row || false}
                onCheckedChange={() => handleCheckboxChange('row')}
              />
              <label htmlFor="row" className="text-sm cursor-pointer">
                Row
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="barcode"
                checked={options.barcode || false}
                onCheckedChange={() => handleCheckboxChange('barcode')}
              />
              <label htmlFor="barcode" className="text-sm cursor-pointer">
                Barcode
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="qrCode"
                checked={options.qrCode || false}
                onCheckedChange={() => handleCheckboxChange('qrCode')}
              />
              <label htmlFor="qrCode" className="text-sm cursor-pointer">
                QR Code
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="image"
                checked={options.image || false}
                onCheckedChange={() => handleCheckboxChange('image')}
              />
              <label htmlFor="image" className="text-sm cursor-pointer">
                Image
              </label>
            </div>
            {options.image && (
              <div className="mt-3">
                <label htmlFor="imageUrl" className="text-xs text-muted-foreground mb-1 block">
                  Image URL:
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ESC/POS Commands Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">ESC/POS Commands</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(escposKeys)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeselectAll(escposKeys)}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="initPrinter"
                 checked={options.initPrinter || false}
                 onCheckedChange={() => handleCheckboxChange('initPrinter')}
               />
               <label htmlFor="initPrinter" className="text-sm cursor-pointer">
                 Init Printer
               </label>
             </div>
             <div className="flex items-center space-x-2">
               <Checkbox
                 id="cutPartial"
                checked={options.cutPartial || false}
                onCheckedChange={() => handleCheckboxChange('cutPartial')}
              />
              <label htmlFor="cutPartial" className="text-sm cursor-pointer">
                Partial Cut
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cutFull"
                checked={options.cutFull || false}
                onCheckedChange={() => handleCheckboxChange('cutFull')}
              />
              <label htmlFor="cutFull" className="text-sm cursor-pointer">
                Full Cut
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lineFeeds"
                checked={options.lineFeeds || false}
                onCheckedChange={() => handleCheckboxChange('lineFeeds')}
              />
              <label htmlFor="lineFeeds" className="text-sm cursor-pointer">
                Line Feeds
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="characterSpacing"
                checked={options.characterSpacing || false}
                onCheckedChange={() => handleCheckboxChange('characterSpacing')}
              />
              <label htmlFor="characterSpacing" className="text-sm cursor-pointer">
                Char Spacing
              </label>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={handlePrint}
            disabled={isPrinting || selectedCount === 0}
            className="w-full"
            size="lg"
          >
            {isPrinting ? 'Printing...' : `Print Selected Options (${selectedCount})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

