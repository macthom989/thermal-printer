// Receipt types
export interface ReceiptItem {
  name: string
  price: number
  quantity?: number
}

export interface BasicReceiptData {
  storeName?: string
  items?: ReceiptItem[]
  total?: number
}

// Order types
export interface OrderItem {
  name: string
  quantity: number
  notes?: string
}

export interface OrderTicketData {
  orderNumber?: string
  tableName?: string
  items?: OrderItem[]
  timestamp?: Date
}

// Printer Checkbox Options
export interface PrinterCheckboxOptions {
  // Text Styles
  bold?: boolean
  doubleStrike?: boolean
  underline?: boolean
  invert?: boolean
  fontA?: boolean
  fontB?: boolean
  size1x1?: boolean
  size2x1?: boolean
  size1x2?: boolean
  size2x2?: boolean
  
  // Alignment
  alignLeft?: boolean
  alignCenter?: boolean
  alignRight?: boolean
  
  // Special Elements
  line?: boolean
  row?: boolean
  barcode?: boolean
  qrCode?: boolean
  image?: boolean
  imageUrl?: string
  // ESC/POS Commands
  initPrinter?: boolean
  cutPartial?: boolean
  cutFull?: boolean
  lineFeeds?: boolean
  characterSpacing?: boolean
}


