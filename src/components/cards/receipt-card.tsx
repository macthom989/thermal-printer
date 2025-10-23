import { PrintButton } from "@/components/print-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TEMPLATE_REGISTRY_IDS } from "@/hooks/usePrint"
import { alignCenterImage, alignCenterImageFromBase64 } from "@/utils/align-bit-image"
import { useEffect, useState } from "react"
export interface IReceiptBusiness {
  businessName?: string | null
  phoneNumber?: string | null
  address?: string | null
  logoBase64?: string | null
  storeLogoObjFid?: string | null
}

export interface IReceiptCashier {
  name?: string | null
  orderCode?: string | null
  checkinTime?: string | null
}

export interface IReceiptService {
  name?: string | null
  finalPrice?: string | number | null
  description?: string | null
  price?: string | number | null
}

export interface IReceiptItemGroupedService {
  name?: string | null
  services?: IReceiptService[]
}

export interface IReceiptSummary {
  subTotal?: string | number | null
  totalDiscount?: string | number | null
  itemDiscount?: string | number | null
  promotion?: string | number | null
  reward?: string | number | null
  tip?: string | number | null
  serviceFee?: string | number | null
  cashDiscount?: string | number | null
  total?: string | number | null
}

export interface IReceiptPaymentMethod {
  name?: string | null
  amount?: string | number | null
  description?: string | null
}

export interface IReceiptCustomer {
  name?: string | null
  phone?: string | null
  totalPoint?: string | number | null
  totalVisit?: string | number | null
}

export interface IReceiptCancelInformation {
  amount?: string | number | null
  date?: string | null
  reason?: string | null
  byStaff?: string | null
}

export interface IReceiptSignature {
  objFid?: string | null
  base64?: string | null
}
export interface IReceipt {
  business?: IReceiptBusiness
  cashier?: IReceiptCashier
  customer?: IReceiptCustomer
  items?: IReceiptItemGroupedService[]
  summary?: IReceiptSummary
  paymentMethods?: IReceiptPaymentMethod[]
  cancelInformation?: IReceiptCancelInformation
  headerMessage?: string | null
  businessNote?: string | null
  footerMessage?: string | null
  marketingMessage?: string | null
  barcode?: string | null
  signature?: IReceiptSignature | null
}

export const receipt: IReceipt = {
  business: {
    businessName: "Fastboy Coffee",
    phoneNumber: "+84123456789",
    address: "11011 Richmond Ave, Ste 900, Houston, TX 77042",
    storeLogoObjFid: "019a0f19-74be-7ed3-881f-a453c5d45670.jpg",
    logoBase64: "/src/assets/logo.png",
  },
  barcode: "OD251022-30223635",
  cashier: {
    name: "Cashier Name",
    orderCode: "OD251022-30223635",
    checkinTime: "2025-10-22T08:23:43+00:00",
  },
  customer: {
    name: "",
    phone: null,
  },
  items: [
    {
      name: "kunde.gideon",
      services: [
        {
          name: "Basic Polish #3",
          finalPrice: 4618,
          description: null,
          price: 4618,
        },
        {
          name: "Basic Repair #9",
          finalPrice: 1155,
          description: null,
          price: 1155,
        },
        {
          name: "Deluxe Manicure #11",
          finalPrice: 1099,
          description: "Teste code e teste line",
          price: 1099,
        },
      ],
    },
    {
      name: "tamara.bogisich",
      services: [
        {
          name: "Basic Repair #9",
          finalPrice: 1155,
          description: null,
          price: 1155,
        },
        {
          name: "Deluxe Fill #15",
          finalPrice: 1725,
          description: "Teste code e te",
          price: 1725,
        },
        {
          name: "Deluxe Fill #15",
          finalPrice: 888,
          description: "Deluxe Fill #15",
          price: 900,
        },
      ],
    },
  ],
  summary: {
    subTotal: 10640,
    total: 10640,
    totalDiscount: 0,
    itemDiscount: 0,
    promotion: 0,
    reward: 0,
    tip: null,
  },
  paymentMethods: [
    {
      name: "Cash",
      amount: 10640,
      description: "(Got $120.00 - Change $13.60)",
    },
  ],
  businessNote: null,
}

export function ReceiptCard() {
  const [logo, setLogo] = useState<string>()

  useEffect(() => {
    const fetchLogo = async () => {
      if (!receipt.business?.logoBase64) return
      const logo = await alignCenterImage(receipt.business.logoBase64)
      if (logo) {
        setLogo(logo)
      }
    }
    fetchLogo()
  }, [receipt.business?.logoBase64])

  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">🧪</span>
          Receipt
        </CardTitle>
        <CardDescription className="text-xs">Print a receipt</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PrintButton
          templateId={TEMPLATE_REGISTRY_IDS.RECEIPT}
          data={{ ...receipt, business: { ...receipt.business, logoBase64: logo } }}
          label="Print Receipt"
          className="w-full"
          size="sm"
        />
      </CardContent>
    </Card>
  )
}
