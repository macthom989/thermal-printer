import { ESC_POS } from "@/constants/escpos"
import { Raw, Text } from "react-thermal-printer"

export function TextBold({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.BOLD_ON)} />
            <Text>{children}</Text>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.BOLD_OFF)} />
        </div>
    )
}

export function TextUnderline1DotThick({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_1_DOT)} />
            <Text>{children}</Text>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_OFF)} />
        </div>
    )
}

export function TextUnderline2DotsThick({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_2_DOTS)} />
            <Text>{children}</Text>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.UNDERLINE_OFF)} />
        </div>
    )
}

export function TextItalic({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.ITALIC_ON)} />
            <Text>{children}</Text>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.ITALIC_OFF)} />
        </div>
    )
}

export function TextFontA({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.FONT_A)} />
            <Text>{children}</Text>
        </div>
    )
}

export function TextFontB({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.FONT_B)} />
            <Text>{children}</Text>
        </div>
    )
}

export function TextFontC({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Raw data={Uint8Array.from(ESC_POS.TEXT_FORMAT.FONT_C)} />
            <Text>{children}</Text>
        </div>
    )
}

export function StrikethroughText({ children }: { children: string}) {
    // Tạo một chuỗi gạch ngang có độ dài tương ứng
    const dashes = '-'.repeat(children.length);
  
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
    );
  };