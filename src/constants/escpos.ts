import type { EscPosConfig } from '@/types/escpos';

export const ESC_POS: EscPosConfig = {
    CONTROL: {
        INIT: [0x1B, 0x40],
        RESET: [0x1B, 0x3f, 0x0a, 0x00],
        CARRIAGE_RETURN: [0x0D] ,
        setPosition: (x, y) => [0x1B, 0x24, x % 256, y % 256],
    },
    FEED: {
        setLineSpacing: (n) => [0x1B, 0x33, n],
        DEFAULT_LINE_SPACING: [0x1B, 0x32],
        lines: (n = 1) => [0x1B, 0x64, n],
    },
    TEXT_FORMAT: {
        ALIGN_LEFT: [0x1B, 0x61, 0],
        ALIGN_CENTER: [0x1B, 0x61, 1],
        ALIGN_RIGHT: [0x1B, 0x61, 2],
        BOLD_ON: [0x1B, 0x45, 1],
        BOLD_OFF: [0x1B, 0x45, 0],
        UNDERLINE_OFF: [0x1B, 0x2D, 0],
        UNDERLINE_1_DOT: [0x1B, 0x2D, 1],
        UNDERLINE_2_DOTS: [0x1B, 0x2D, 2],
        ITALIC_ON: [0x1B, 0x37, 1],
        ITALIC_OFF: [0x1B, 0x37, 0],
        INVERT_ON: [0x1D, 0x42, 1],
        INVERT_OFF: [0x1D, 0x42, 0],
        FONT_A: [0x1B, 0x4D, 0],
        FONT_B: [0x1B, 0x4D, 1],
        FONT_C: [0x1B, 0x4D, 2],
    },
    CHARACTER_SIZE: {
        NORMAL: [0x1D, 0x21, 0x00],
        // Keep this function because width/height is dynamic
        setSize: (width, height) => {
            const value = ((width - 1) << 4) | (height - 1);
            return [0x1D, 0x21, value];
        },
        SMOOTHING_OFF: [0x1D, 0x62, 0x00],
        SMOOTHING_ON: [0x1D, 0x62, 0x01],
    },
    HARDWARE: {
        CUT_FULL: [0x1D, 0x56, 0x00],
        CUT_PARTIAL: [0x1D, 0x56, 0x01],
        DRAWER_PIN2: [0x1B, 0x70, 0, 25, 250],
        DRAWER_PIN5: [0x1B, 0x70, 1, 25, 250],
        beep: (times = 1, duration = 2) => [0x1B, 0x42, times, duration],
    },
};