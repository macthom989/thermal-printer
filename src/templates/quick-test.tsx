import { ThermalPrinter } from "@/components/thermal-printer"
import {
  TextBold,
  TextFontA,
  TextFontB,
  TextFontC,
  TextItalic,
  TextUnderline1DotThick,
  TextUnderline2DotsThick,
} from "@/components/thermal-printer.character"
import { BeepSignal } from "@/components/thermal-printer.hardware"
import { BITMAP_FORMAT, ESC_POS, IMAGE_FORMAT } from "@/constants/escpos"
import { DEFAULT_PRINTER_CONFIG } from "@/constants/printer"
import { alignCenterImage } from "@/utils/align-bit-image"
import { Cashdraw, Image, Printer, Raw, Row, Text } from "react-thermal-printer"

export const testBoldTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text>1. Normal Text</Text>
      <TextBold>2. Text Bold</TextBold>
      <Text>3. Normal Text</Text>
    </ThermalPrinter>
  )
}

export const testUnderlineTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text>1. Normal Text</Text>
      <TextUnderline1DotThick>2. Text Underline 1 Dot Thick</TextUnderline1DotThick>
      <TextUnderline2DotsThick>3. Text Underline 2 Dots Thick</TextUnderline2DotsThick>
      <Text>4. Normal Text</Text>
    </ThermalPrinter>
  )
}

export const testAlignTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text align="left">1. Text Align Left</Text>
      <Text align="center">2. Text Align Center</Text>
      <Text align="right">3. Text Align Right</Text>
      <Text>4. Normal Text</Text>
    </ThermalPrinter>
  )
}

export const testItalicTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text>1. Normal Text</Text>
      <TextItalic>2. Text Italic</TextItalic>
      <Text>3. Normal Text</Text>
    </ThermalPrinter>
  )
}

export const testInvertTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text>1. Normal Text</Text>
      <Text invert>2. Text Invert</Text>
      <Text>3. Normal Text</Text>
    </ThermalPrinter>
  )
}

export const testFontTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text>1. Normal Text</Text>
      <TextFontA>2. Text Font A</TextFontA>
      <TextFontB>3. Text Font B</TextFontB>
      <TextFontC>4. Text Font C</TextFontC>
    </ThermalPrinter>
  )
}

export const testSizeTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text size={{ width: 1, height: 1 }}>1. Normal Text</Text>
      <Text size={{ width: 2, height: 2 }}>2. Text Size 2x2</Text>
      <Text size={{ width: 1, height: 2 }}>3. Text Size 1x2</Text>
      <Text size={{ width: 2, height: 1 }}>4. Text Size 2x1</Text>
      <Text>5. Normal Text</Text>
    </ThermalPrinter>
  )
}

export const testBeepTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <TextFontA>1. Text Font A</TextFontA>
      <BeepSignal times={2} />
    </ThermalPrinter>
  )
}

export const testCashDrawerTemplate = () => {
  return (
    <Printer {...DEFAULT_PRINTER_CONFIG}>
      <Cashdraw pin="2pin" />
    </Printer>
  )
}

const mockImageCenter = async () => {
  return await alignCenterImage("/src/assets/react.svg")
}

const mockImageBase64 = await mockImageCenter()

export const testImageTemplate = () => {
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Text align="center">Centered Image</Text>
      <Image src={mockImageBase64} />
      <Text align="center">The end</Text>
    </ThermalPrinter>
  )
}

export const testStrikethroughTemplate = (base64Image?: string) => {
    const x = debug
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <Row
        gap={6}
        left={
          <Text wordBreak="break-word">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </Text>
        }
        right={<Text align="right">$200.000</Text>}
      />
      {base64Image && <Image src={base64Image} />}
    </ThermalPrinter>
  )
}
