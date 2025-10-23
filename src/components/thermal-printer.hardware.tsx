import { ESC_POS } from "@/constants/escpos";
import { Raw } from "react-thermal-printer";

export const ResetPrinter = () => {
    return (
        <Raw data={Uint8Array.from(ESC_POS.CONTROL.RESET)} />
    )
}

export const InitPrinter = () => {
    return (
        <Raw data={Uint8Array.from(ESC_POS.CONTROL.INIT)} />
    )
}

export function BeepSignal({ times = 1, duration = 2 }: { times?: number, duration?: number }) {
    return (
        <Raw data={Uint8Array.from(ESC_POS.HARDWARE.beep(times, duration))} />
    )
}

export const InitLineSpacing = () => {
    return (
        <Raw data={Uint8Array.from(ESC_POS.FEED.setLineSpacing(40))} />
    )
}