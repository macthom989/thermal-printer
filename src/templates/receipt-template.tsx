import { IReceipt } from "@/components/cards/receipt-card"
import { ThermalPrinter } from "@/components/thermal-printer"
import { TextWrapper } from "@/components/thermal-printer.character"
import { ESC_POS } from "@/constants/escpos"
import { DEFAULT_PRINTER_CONFIG } from "@/constants/printer"
import { Br, Image, Line, Raw, Row, Text } from "react-thermal-printer"

export function receiptTemplate(data?: IReceipt) {
  const defaultLineSpacing = 40
  const wrapLineSpacing = 32
  const logo = data?.business?.logoBase64
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      {logo && <Image src={logo} width={100} height={100} align="center" />}
      <Br />
      <Raw data={Uint8Array.from(ESC_POS.FEED.setLineSpacing(wrapLineSpacing))} />
      <TextWrapper size={{ width: 2, height: 2 }} align="center" bold>
        {data?.business?.businessName}
      </TextWrapper>
      <TextWrapper width={40} align="center">
        11011 Richmonds Ave, Ste 250 Houston TX77042
      </TextWrapper>
      <TextWrapper align="center">(999) 999 - 1234</TextWrapper>
      <Raw data={Uint8Array.from(ESC_POS.FEED.setLineSpacing(defaultLineSpacing))} />

      <Line character="=" />

      <Row left="Cashier" right="11.23.2024 12:01 PM" />
      <Row left="Order Code" right={<Text bold>Successful</Text>} />

      <Line character="=" />

      <Row left={<Text bold>Michelangelo</Text>} right={<Text bold={false}>(999) 999 - 1234</Text>} />
      <Row left="Current Point: 248" right="Total Visit: 12" />

      <Line character="=" />
      
    </ThermalPrinter>
  )
}
