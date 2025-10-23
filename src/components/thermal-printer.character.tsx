import { CHARACTER_SPACING, ESC_POS } from "@/constants/escpos"
import { Raw, Text, textLength, TextProps, TextSize, wrapText } from "react-thermal-printer"
import { Fragment, ReactNode } from "react"
import { DEFAULT_PRINTER_CONFIG } from "@/constants/printer"
import { InitLineSpacing } from "./thermal-printer.hardware"

export function TextBold({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.BOLD_ON)} />
      <Text>{children}</Text>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.BOLD_OFF)} />
    </div>
  )
}

export function TextUnderline1DotThick({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_1_DOT)} />
      <Text>{children}</Text>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_OFF)} />
    </div>
  )
}

export function TextUnderline2DotsThick({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_2_DOTS)} />
      <Text>{children}</Text>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_OFF)} />
    </div>
  )
}

export function TextItalic({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.ITALIC_ON)} />
      <Text>{children}</Text>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.ITALIC_OFF)} />
    </div>
  )
}

export function TextFontA({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.FONT_A)} />
      <Text>{children}</Text>
    </div>
  )
}

export function TextFontB({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.FONT_B)} />
      <Text>{children}</Text>
    </div>
  )
}

export function TextFontC({ children }: { children: ReactNode }) {
  return (
    <div>
      <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.FONT_C)} />
      <Text>{children}</Text>
    </div>
  )
}

export function StrikethroughText({ children }: { children: string }) {
  // Tạo một chuỗi gạch ngang có độ dài tương ứng
  const dashes = "-".repeat(children.length)

  return (
    <>
      {/* In văn bản gốc */}
      <Raw data={Uint8Array.from(ESC_POS.CONTROL.CARRIAGE_RETURN)} />
      <Text inline={true}>{children}</Text>
      <Raw data={Uint8Array.from(ESC_POS.CONTROL.CARRIAGE_RETURN)} />
      {/* In đè các dấu gạch ngang */}
      {/* prop `inline` để không tự động xuống dòng sau khi in xong */}
      <Text inline={true}>{dashes}</Text>
    </>
  )
}

type TextWrapperProps = Omit<TextProps, "children" | "width"> & {
  children?: string | null
  width?: number
}

export const TextWrapper = ({ ...props }: TextWrapperProps) => {
  const text = props.children
    ? wrapText(props.children, {
        size: props.size?.width,
        width: props.width || DEFAULT_PRINTER_CONFIG.width,
        wordBreak: "break-word",
      }).map((line) => line.trim())
    : []

  return (
    <>
      {text.map((line, index) => (
        <Fragment key={index}>
          <Text align={props.align} wordBreak={props.wordBreak} {...props}>
            {line}
          </Text>
          {props.bold && <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.BOLD_OFF)} />}
        </Fragment>
      ))}
    </>
  )
}
