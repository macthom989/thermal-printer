import { TEMPLATE_REGISTRY_IDS } from "@/hooks/usePrint"
import { useEffect, useState } from "react"
import { PrintButton } from "./print-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { printDoubleColumnBase64 } from "@/utils/convert-strike-through"

export const QuickTest = () => {
    return (
        <Card       >
            <CardHeader>
                <CardTitle>Print Templates</CardTitle>
                <CardDescription>Click the buttons below to test different print templates</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_BOLD} label="Print Bold Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_UNDERLINE} label="Print Underline Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_ALIGN} label="Print Align Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_ITALIC} label="Print Italic Text" className="w-full" size="sm" disabled />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_INVERT} label="Print Invert Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_FONT} label="Print Font Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_SIZE} label="Print Size Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.TEXT_FONT} label="Print Font Text" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.BEEP_SIGNAL} label="Print Beep Signal" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.CASH_DRAWER} label="Print Cash Drawer" className="w-full" size="sm" />
                    <PrintButton templateId={TEMPLATE_REGISTRY_IDS.IMAGE} label="Print Image" className="w-full" size="sm" />
                    <PrintStrikethroughText />
                </div>
            </CardContent>
        </Card>
    )
}


const PrintStrikethroughText = () => {
    const [base64Data, setBase64Data] = useState<string | null>(null)

    useEffect(() => {
        const fetchBase64 = async () => {
            try {
                const strikethroughPrice = "$300.000"
                const result = await printDoubleColumnBase64(
                    "Món hàng A nó rất là dài dài dài dài dài Món hàng A nó rất là dài dài dài dài dài Món hàng A nó rất là dài dài dài dài dài",
                    strikethroughPrice,
                    576,
                )
                setBase64Data(result)
            } catch (error) {
                console.error("Failed to convert double column text to Base64:", error)
                setBase64Data(null)
            }
        }
        fetchBase64()
    }, [])

    return (
        <PrintButton
            templateId={TEMPLATE_REGISTRY_IDS.STRIKE_THROUGH}
            label="Print Double Column Strikethrough"
            className="w-full"
            size="sm"
            data={base64Data ?? undefined}
            disabled={!base64Data}
        />
    )
}
