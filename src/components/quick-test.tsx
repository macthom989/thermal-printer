import { TEMPLATE_REGISTRY_IDS } from "@/hooks/usePrint"
import { useEffect, useState } from "react"
import { PrintButton } from "./print-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { IReceipt, receipt } from "./cards/receipt-card"
import { printDoubleColumnBase64 } from "@/utils/convert-strike-through"
import * as htmlToImage from 'html-to-image';

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

export const captureHtmlAsPngBase64 = async (componentRef: React.RefObject<HTMLDivElement>): Promise<string> => {
    if (!componentRef.current) {
        throw new Error("Target element not found for image capture.");
    }

    // html-to-image sẽ chụp và trả về Base64 PNG
    const dataUrl = await htmlToImage.toPng(componentRef.current, {
        cacheBust: true,
    });
    return dataUrl;
};

export interface IProcessedService {
    name: string;
    finalPriceFormatted: string;
    // descriptionBase64 chứa ảnh PNG cho dòng mô tả/gạch ngang
    descriptionBase64: string | null;
}
export interface IProcessedItem {
    name: string;
    services: IProcessedService[];
}
export interface IProcessedReceipt extends Omit<IReceipt, 'items'> {
    items: IProcessedItem[];
}

export const transformReceiptForPrinting = async (receipt: IReceipt): Promise<IProcessedReceipt> => {
    const processedItems: IProcessedItem[] = [];

    for (const item of receipt.items || []) {
        const processedServices: IProcessedService[] = [];

        for (const service of item.services || []) {
            let descriptionBase64: string | null = null;

            const hasPriceDifference = service.price !== service.finalPrice;
            const hasDescription = !!service.description;

            if (hasDescription || (hasPriceDifference && service.price)) {
                const descriptionText = service.description;
                const strikethroughText = hasPriceDifference ? service.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : undefined;

                if (descriptionText || strikethroughText) {
                    try {
                        descriptionBase64 = await printDoubleColumnBase64(
                            descriptionText,
                            strikethroughText ?? "",
                        );
                    } catch (error) {
                        descriptionBase64 = null;
                    }
                }
            }

            processedServices.push({
                name: service.name || '',
                finalPriceFormatted: (service.finalPrice as number)?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                descriptionBase64: descriptionBase64,
            });
        }
        processedItems.push({
            name: item.name || '',
            services: processedServices,
        });
    }

    return {
        ...receipt,
        items: processedItems,
    };
};
const PrintStrikethroughText = () => {
    const [processedReceipt, setProcessedReceipt] = useState<IProcessedReceipt | null>(null);
    useEffect(() => {
        const loadTemplateData = async () => {
            try {
                const processedData = await transformReceiptForPrinting(receipt);
                setProcessedReceipt(processedData);
            } catch (error) {
                console.error("Failed to prepare complex print template:", error);
            }
        };
        loadTemplateData();
    }, []);
    
    console.log(processedReceipt);

    return (
        <PrintButton
            templateId={TEMPLATE_REGISTRY_IDS.STRIKE_THROUGH}
            label={!processedReceipt ? "Loading..." : "Print Double Column Strikethrough (TEST)"}
            className="w-full"
            size="sm"
            data={processedReceipt}
            disabled={!processedReceipt}
        />
    )
}