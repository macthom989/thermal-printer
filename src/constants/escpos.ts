import type { EscPosConfig } from "@/types/escpos"

/**
 * ESC/POS Command Helper
 * Complete integration with @types/escpos definitions
 * Reference: https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/
 * @see @types/escpos for all type definitions
 */

// ==================== TYPE DEFINITIONS ====================
/**
 * Types based on @types/escpos definitions
 */
export type FEED_CONTROL_TYPE = "LF" | "GLF" | "FF" | "CR" | "HT" | "VT"
export type BITMAP_FORMAT_TYPE = "S8" | "D8" | "S24" | "D24"
export type QRCODE_LEVEL = "L" | "M" | "Q" | "H"
export type TXT_STYLE = "NORMAL" | "B" | "I" | "U" | "U2" | "BI" | "BIU" | "BIU2" | "BU" | "BU2" | "IU" | "IU2"
export type MIME_TYPE = "image/png" | "image/jpg" | "image/jpeg" | "image/gif" | "image/bmp"
export type BARCODE_TYPE = "UPC_A" | "UPC_E" | "EAN13" | "EAN8" | "CODE39" | "ITF" | "NW7" | "CODE93" | "CODE128"
export type TXT_ALIGN = "LT" | "CT" | "RT"

// ==================== BASIC CONTROL CHARACTERS ====================
/**
 * Basic control characters from @types/escpos command namespace
 * @see @types/escpos command.ESC, command.GS, etc.
 */
export const ESC = 0x1b // Escape character
export const GS = 0x1d // Group separator
export const FS = 0x1c // File separator
export const DLE = 0x10 // Data link escape
export const LF = 0x0a // Line feed
export const FF = 0x0c // Form feed
export const CR = 0x0d // Carriage return
export const EOT = 0x04 // End of transmission
export const NUL = 0x00 // Null character
export const HT = 0x09 // Horizontal tab
export const VT = 0x0b // Vertical tab
export const BS = 0x08 // Backspace
export const CAN = 0x18 // Cancel
export const CLR = 0x0c // Clear

// ==================== FEED CONTROL SEQUENCES ====================
/**
 * Feed control sequences
 * @see @types/escpos command.FEED_CONTROL_SEQUENCES
 */
export const FEED_CONTROL = {
  /** Print and line feed
   * @see @types/escpos command.FEED_CONTROL_SEQUENCES.CTL_LF
   */
  CTL_LF: [LF],

  /** Print and feed paper (without spaces between lines)
   * @see @types/escpos command.FEED_CONTROL_SEQUENCES.CTL_GLF
   */
  CTL_GLF: [0x4a, 0x00],

  /** Form feed
   * @see @types/escpos command.FEED_CONTROL_SEQUENCES.CTL_FF
   */
  CTL_FF: [FF],

  /** Carriage return
   * @see @types/escpos command.FEED_CONTROL_SEQUENCES.CTL_CR
   */
  CTL_CR: [CR],

  /** Horizontal tab
   * @see @types/escpos command.FEED_CONTROL_SEQUENCES.CTL_HT
   */
  CTL_HT: [HT],

  /** Vertical tab
   * @see @types/escpos command.FEED_CONTROL_SEQUENCES.CTL_VT
   */
  CTL_VT: [VT],
} as const

// ==================== HARDWARE CONTROL ====================
/**
 * Hardware control commands
 * @see @types/escpos command.HARDWARE
 */
export const HARDWARE = {
  /** Initialize printer - Clear buffer and reset modes
   * @see @types/escpos command.HARDWARE.HW_INIT
   */
  INIT: [ESC, 0x40],

  /** Printer select
   * @see @types/escpos command.HARDWARE.HW_SELECT
   */
  SELECT: [ESC, 0x3d, 0x01],

  /** Reset printer hardware
   * @see @types/escpos command.HARDWARE.HW_RESET
   */
  RESET: [ESC, 0x3f, 0x0a, 0x00],
} as const

// ==================== CHARACTER & LINE SPACING ====================
/**
 * Character spacing commands
 * @see @types/escpos command.CHARACTER_SPACING
 */
export const CHARACTER_SPACING = {
  /** Default character spacing
   * @see @types/escpos command.CHARACTER_SPACING.CS_DEFAULT
   */
  CS_DEFAULT: [ESC, 0x20, 0x00],

  /** Set character spacing command
   * @see @types/escpos command.CHARACTER_SPACING.CS_SET
   */
  CS_SET: (dots: number) => [ESC, 0x20, dots],
} as const

/**
 * Line spacing commands
 * @see @types/escpos command.LINE_SPACING
 */
export const LINE_SPACING = {
  /** Default line spacing (30 dots)
   * @see @types/escpos command.LINE_SPACING.LS_DEFAULT
   */
  LS_DEFAULT: [ESC, 0x32],

  /** Set line spacing command
   * @see @types/escpos command.LINE_SPACING.LS_SET
   */
  LS_SET: (dots: number) => [ESC, 0x33, dots],
} as const

// ==================== MARGINS ====================
/**
 * Margin commands
 * @see @types/escpos command.MARGINS
 */
export const MARGINS = {
  /** Set left margin (in dots)
   * @see @types/escpos command.MARGINS.LEFT (note: in types this is just the command, we add calculation)
   */
  LEFT: (dots: number) => {
    const nL = dots % 256
    const nH = Math.floor(dots / 256)
    return [GS, 0x4c, nL, nH]
  },

  /** Bottom margin
   * @see @types/escpos command.MARGINS.BOTTOM
   */
  BOTTOM: [ESC, 0x4f],

  /** Right margin
   * @see @types/escpos command.MARGINS.RIGHT
   */
  RIGHT: [ESC, 0x51],

  /** Set print position (absolute horizontal position) */
  PRINT_POSITION: (dots: number) => {
    const nL = dots % 256
    const nH = Math.floor(dots / 256)
    return [ESC, 0x24, nL, nH]
  },

  /** Set relative horizontal position (move cursor) */
  RELATIVE_POSITION: (dots: number) => {
    const nL = dots % 256
    const nH = Math.floor(dots / 256)
    return [ESC, 0x5c, nL, nH]
  },
} as const

// ==================== PAPER CONTROL ====================
/**
 * Paper control commands
 * @see @types/escpos command.PAPER
 */
export const PAPER = {
  /** Full cut paper
   * @see @types/escpos command.PAPER.PAPER_FULL_CUT
   */
  CUT_FULL: [GS, 0x56, 0x00],

  /** Partial cut paper
   * @see @types/escpos command.PAPER.PAPER_PART_CUT
   */
  CUT_PARTIAL: [GS, 0x56, 0x01],

  /** Cut paper type A
   * @see @types/escpos command.PAPER.PAPER_CUT_A
   */
  CUT_A: [GS, 0x56, 0x41],

  /** Cut paper type B
   * @see @types/escpos command.PAPER.PAPER_CUT_B
   */
  CUT_B: (lines: number = 3) => [GS, 0x56, 0x42, lines],
} as const

// ==================== TEXT FORMATTING ====================
/**
 * Text formatting commands
 * @see @types/escpos command.TEXT_FORMAT
 */
export const TEXT_FORMAT = {
  /** Normal text size and style
   * @see @types/escpos command.TEXT_FORMAT.TXT_NORMAL
   */
  NORMAL: [ESC, 0x21, 0x00],

  /** Double height text
   * @see @types/escpos command.TEXT_FORMAT.TXT_2HEIGHT
   */
  DOUBLE_HEIGHT: [ESC, 0x21, 0x10],

  /** Double width text
   * @see @types/escpos command.TEXT_FORMAT.TXT_2WIDTH
   */
  DOUBLE_WIDTH: [ESC, 0x21, 0x20],

  /** Quadruple size (double width & height)
   * @see @types/escpos command.TEXT_FORMAT.TXT_4SQUARE
   */
  QUAD_SIZE: [ESC, 0x21, 0x30],

  /** Custom text size
   * @see @types/escpos command.TEXT_FORMAT.TXT_CUSTOM_SIZE
   */
  CUSTOM_SIZE: (width: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, height: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
    const widthValue = (width - 1) << 4
    const heightValue = height - 1
    return [ESC, 0x21, widthValue | heightValue]
  },

  /** Text height values
   * @see @types/escpos command.TEXT_FORMAT.TXT_HEIGHT
   */
  TXT_HEIGHT: {
    1: 0x00,
    2: 0x01,
    3: 0x02,
    4: 0x03,
    5: 0x04,
    6: 0x05,
    7: 0x06,
    8: 0x07,
  },

  /** Text width values
   * @see @types/escpos command.TEXT_FORMAT.TXT_WIDTH
   */
  TXT_WIDTH: {
    1: 0x00,
    2: 0x10,
    3: 0x20,
    4: 0x30,
    5: 0x40,
    6: 0x50,
    7: 0x60,
    8: 0x70,
  },

  /** Bold ON
   * @see @types/escpos command.TEXT_FORMAT.TXT_BOLD_ON
   */
  BOLD_ON: [ESC, 0x45, 0x01],

  /** Bold OFF
   * @see @types/escpos command.TEXT_FORMAT.TXT_BOLD_OFF
   */
  BOLD_OFF: [ESC, 0x45, 0x00],

  /** Underline 1-dot ON
   * @see @types/escpos command.TEXT_FORMAT.TXT_UNDERL_ON
   */
  UNDERL_ON: [ESC, 0x2d, 0x01],

  /** Underline 2-dot ON (thicker)
   * @see @types/escpos command.TEXT_FORMAT.TXT_UNDERL2_ON
   */
  UNDERL2_ON: [ESC, 0x2d, 0x02],

  /** Underline OFF
   * @see @types/escpos command.TEXT_FORMAT.TXT_UNDERL_OFF
   */
  UNDERL_OFF: [ESC, 0x2d, 0x00],

  /** Italic ON
   * @see @types/escpos command.TEXT_FORMAT.TXT_ITALIC_ON
   */
  ITALIC_ON: [ESC, 0x34],

  /** Italic OFF
   * @see @types/escpos command.TEXT_FORMAT.TXT_ITALIC_OFF
   */
  ITALIC_OFF: [ESC, 0x35],

  /** Font type A
   * @see @types/escpos command.TEXT_FORMAT.TXT_FONT_A
   */
  FONT_A: [ESC, 0x4d, 0x00],

  /** Font type B
   * @see @types/escpos command.TEXT_FORMAT.TXT_FONT_B
   */
  FONT_B: [ESC, 0x4d, 0x01],

  /** Font type C
   * @see @types/escpos command.TEXT_FORMAT.TXT_FONT_C
   */
  FONT_C: [ESC, 0x4d, 0x02],

  /** Left alignment
   * @see @types/escpos command.TEXT_FORMAT.TXT_ALIGN_LT
   */
  ALIGN_LT: [ESC, 0x61, 0x00],

  /** Center alignment
   * @see @types/escpos command.TEXT_FORMAT.TXT_ALIGN_CT
   */
  ALIGN_CT: [ESC, 0x61, 0x01],

  /** Right alignment
   * @see @types/escpos command.TEXT_FORMAT.TXT_ALIGN_RT
   */
  ALIGN_RT: [ESC, 0x61, 0x02],
} as const

// ==================== BARCODE FORMATTING ====================
/**
 * Barcode formatting commands
 * @see @types/escpos command.BARCODE_FORMAT
 */
export const BARCODE_FORMAT = {
  /** HRI barcode chars OFF
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_TXT_OFF
   */
  TXT_OFF: [GS, 0x48, 0x00],

  /** HRI barcode chars above
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_TXT_ABV
   */
  TXT_ABV: [GS, 0x48, 0x01],

  /** HRI barcode chars below
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_TXT_BLW
   */
  TXT_BLW: [GS, 0x48, 0x02],

  /** HRI barcode chars both above and below
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_TXT_BTH
   */
  TXT_BTH: [GS, 0x48, 0x03],

  /** Font type A for HRI barcode chars
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_FONT_A
   */
  FONT_A: [GS, 0x66, 0x00],

  /** Font type B for HRI barcode chars
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_FONT_B
   */
  FONT_B: [GS, 0x66, 0x01],

  /** Set barcode height [1-255]
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_HEIGHT
   */
  HEIGHT: (height: number = 100) => [GS, 0x68, height],

  /** Barcode width values [2-6]
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_WIDTH
   */
  WIDTH: {
    1: [GS, 0x77, 0x02],
    2: [GS, 0x77, 0x03],
    3: [GS, 0x77, 0x04],
    4: [GS, 0x77, 0x05],
    5: [GS, 0x77, 0x06],
  },

  /** Default barcode height (100)
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_HEIGHT_DEFAULT
   */
  HEIGHT_DEFAULT: [GS, 0x68, 0x64],

  /** Default barcode width
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_WIDTH_DEFAULT
   */
  WIDTH_DEFAULT: [GS, 0x77, 0x01],

  /** Barcode types
   * @see @types/escpos command.BARCODE_FORMAT.BARCODE_*
   */
  TYPE: {
    UPC_A: [GS, 0x6b, 0x00],
    UPC_E: [GS, 0x6b, 0x01],
    EAN13: [GS, 0x6b, 0x02],
    EAN8: [GS, 0x6b, 0x03],
    CODE39: [GS, 0x6b, 0x04],
    ITF: [GS, 0x6b, 0x05],
    NW7: [GS, 0x6b, 0x06],
    CODE93: [GS, 0x6b, 0x48],
    CODE128: [GS, 0x6b, 0x49],
  },
} as const

// ==================== QR CODE ====================
/**
 * QR code formatting commands
 * @see @types/escpos command.CODE2D_FORMAT
 */
export const CODE2D_FORMAT = {
  /** QR code error correction levels
   * @see @types/escpos command.CODE2D_FORMAT.QR_LEVEL_*
   */
  QR_LEVEL: {
    /** 7% recovery
     * @see @types/escpos command.CODE2D_FORMAT.QR_LEVEL_L
     */
    L: "L" as const,
    /** 15% recovery
     * @see @types/escpos command.CODE2D_FORMAT.QR_LEVEL_M
     */
    M: "M" as const,
    /** 25% recovery
     * @see @types/escpos command.CODE2D_FORMAT.QR_LEVEL_Q
     */
    Q: "Q" as const,
    /** 30% recovery
     * @see @types/escpos command.CODE2D_FORMAT.QR_LEVEL_H
     */
    H: "H" as const,
  },

  /** Error correction level byte values */
  ERROR_LEVEL: {
    L: 0x30,
    M: 0x31,
    Q: 0x32,
    H: 0x33,
  },

  /** Set QR code model */
  MODEL: (model: 1 | 2 = 2) => [GS, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, model, 0x00],

  /** Set QR code size (1-16) */
  SIZE: (size: number = 3) => [GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, size],

  /** Set error correction level */
  ERROR: (level: 0x30 | 0x31 | 0x32 | 0x33 = 0x30) => [GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, level],
} as const

// ==================== IMAGE FORMATTING ====================
/**
 * Image formatting commands
 * @see @types/escpos command.IMAGE_FORMAT
 */
export const IMAGE_FORMAT = {
  /** Raster image normal size
   * @see @types/escpos command.IMAGE_FORMAT.S_RASTER_N
   */
  RASTER_N: [GS, 0x76, 0x30, 0x00],

  /** Raster image double width
   * @see @types/escpos command.IMAGE_FORMAT.S_RASTER_2W
   */
  RASTER_2W: [GS, 0x76, 0x30, 0x01],

  /** Raster image double height
   * @see @types/escpos command.IMAGE_FORMAT.S_RASTER_2H
   */
  RASTER_2H: [GS, 0x76, 0x30, 0x02],

  /** Raster image quadruple
   * @see @types/escpos command.IMAGE_FORMAT.S_RASTER_Q
   */
  RASTER_Q: [GS, 0x76, 0x30, 0x03],
} as const

// ==================== BITMAP FORMATTING ====================
/**
 * Bitmap formatting commands
 * @see @types/escpos command.BITMAP_FORMAT
 */
export const BITMAP_FORMAT = {
  /** Single density 8-dot
   * @see @types/escpos command.BITMAP_FORMAT.BITMAP_S8
   */
  S8: [ESC, 0x2a, 0x00],

  /** Double density 8-dot
   * @see @types/escpos command.BITMAP_FORMAT.BITMAP_D8
   */
  D8: [ESC, 0x2a, 0x01],

  /** Single density 24-dot
   * @see @types/escpos command.BITMAP_FORMAT.BITMAP_S24
   */
  S24: [ESC, 0x2a, 0x20],

  /** Double density 24-dot
   * @see @types/escpos command.BITMAP_FORMAT.BITMAP_D24
   */
  D24: [ESC, 0x2a, 0x21],
} as const

// ==================== GSV0 FORMAT ====================
/**
 * GSV0 formatting commands
 * @see @types/escpos command.GSV0_FORMAT
 */
export const GSV0_FORMAT = {
  /** Normal size
   * @see @types/escpos command.GSV0_FORMAT.GSV0_NORMAL
   */
  NORMAL: [GS, 0x76, 0x30, 0x00],

  /** Double width
   * @see @types/escpos command.GSV0_FORMAT.GSV0_DW
   */
  DW: [GS, 0x76, 0x30, 0x01],

  /** Double height
   * @see @types/escpos command.GSV0_FORMAT.GSV0_DH
   */
  DH: [GS, 0x76, 0x30, 0x02],

  /** Double width & height
   * @see @types/escpos command.GSV0_FORMAT.GSV0_DWDH
   */
  DWDH: [GS, 0x76, 0x30, 0x03],
} as const

// ==================== BEEP ====================
/**
 * Printer buzzer command
 * @see @types/escpos command.BEEP
 */
export const BEEP = {
  /** Printer buzzer command prefix
   * @see @types/escpos command.BEEP
   */
  CMD: [ESC, 0x42],

  /** Beep with custom times and duration */
  BEEP: (times: number = 3, duration: number = 5) => [ESC, 0x42, times, duration],

  /** Quick beep (1 time, short) */
  QUICK: [ESC, 0x42, 1, 3],

  /** Long beep (1 time, long) */
  LONG: [ESC, 0x42, 1, 9],

  /** Error beep (3 times, short) */
  ERROR: [ESC, 0x42, 3, 5],
} as const

// ==================== COLOR ====================
/**
 * Color commands for two-color printers
 * @see @types/escpos command.COLOR
 */
export const COLOR = {
  /** Black color
   * @see @types/escpos command.COLOR[0]
   */
  BLACK: [ESC, 0x72, 0x00],

  /** Red color
   * @see @types/escpos command.COLOR[1]
   */
  RED: [ESC, 0x72, 0x01],
} as const

// ==================== CASH DRAWER ====================
/**
 * Cash drawer commands
 * @see @types/escpos command.CASH_DRAWER
 */
export const CASH_DRAWER = {
  /** Send pulse to pin 2
   * @see @types/escpos command.CASH_DRAWER.CD_KICK_2
   */
  KICK_PIN2: [ESC, 0x70, 0x00, 0x19, 0xfa],

  /** Send pulse to pin 5
   * @see @types/escpos command.CASH_DRAWER.CD_KICK_5
   */
  KICK_PIN5: [ESC, 0x70, 0x01, 0x19, 0xfa],

  /** Custom pulse */
  CUSTOM: (pin: 0 | 1, pulseOn: number = 0x19, pulseOff: number = 0xfa) => [ESC, 0x70, pin, pulseOn, pulseOff],
} as const

// ==================== SCREEN (for customer display) ====================
/**
 * Customer display screen commands
 * @see @types/escpos command.SCREEN
 */
export const SCREEN = {
  /** Backspace - moves cursor one position left
   * @see @types/escpos command.SCREEN.BS
   */
  BS: [BS],

  /** Horizontal tab - moves cursor one position right
   * @see @types/escpos command.SCREEN.HT
   */
  HT: [HT],

  /** Line feed - moves cursor down one line
   * @see @types/escpos command.SCREEN.LF
   */
  LF: [LF],

  /** Move cursor up one line
   * @see @types/escpos command.SCREEN.US_LF
   */
  US_LF: [0x1f, 0x0a],

  /** Home - moves cursor to top left
   * @see @types/escpos command.SCREEN.HOM
   */
  HOM: [VT],

  /** Carriage return - moves cursor to left of current line
   * @see @types/escpos command.SCREEN.CR
   */
  CR: [CR],

  /** Move cursor to right of current line
   * @see @types/escpos command.SCREEN.US_CR
   */
  US_CR: [0x1f, 0x0d],

  /** Move cursor to bottom
   * @see @types/escpos command.SCREEN.US_B
   */
  US_B: [0x1f, 0x42],

  /** Move cursor to nth position on mth line
   * @see @types/escpos command.SCREEN.US_$
   */
  US_$: [0x1f, 0x24],

  /** Clear all displayed characters
   * @see @types/escpos command.SCREEN.CLR
   */
  CLR: [CLR],

  /** Clear line containing cursor
   * @see @types/escpos command.SCREEN.CAN
   */
  CAN: [CAN],

  /** Select overwrite mode
   * @see @types/escpos command.SCREEN.US_MD1
   */
  US_MD1: [0x1f, 0x01],

  /** Select vertical scroll mode
   * @see @types/escpos command.SCREEN.US_MD2
   */
  US_MD2: [0x1f, 0x02],

  /** Select horizontal scroll mode
   * @see @types/escpos command.SCREEN.US_MD3
   */
  US_MD3: [0x1f, 0x03],

  /** Turn cursor display on/off
   * @see @types/escpos command.SCREEN.US_C
   */
  US_C: [0x1f, 0x43],

  /** Set blink interval
   * @see @types/escpos command.SCREEN.US_E
   */
  US_E: [0x1f, 0x45],

  /** Set counter time
   * @see @types/escpos command.SCREEN.US_T
   */
  US_T: [0x1f, 0x54],

  /** Display time counter
   * @see @types/escpos command.SCREEN.US_U
   */
  US_U: [0x1f, 0x55],

  /** Set brightness
   * @see @types/escpos command.SCREEN.US_X
   */
  US_X: [0x1f, 0x58],

  /** Select/cancel reverse display
   * @see @types/escpos command.SCREEN.US_r
   */
  US_r: [0x1f, 0x72],

  /** Set DTR signal state
   * @see @types/escpos command.SCREEN.US_v
   */
  US_v: [0x1f, 0x76],
} as const

export const ESC_POS: EscPosConfig = {
  CONTROL: {
    INIT: HARDWARE.INIT,
    RESET: HARDWARE.RESET,
    CARRIAGE_RETURN: FEED_CONTROL.CTL_CR,
    setPosition: (x) => MARGINS.PRINT_POSITION(x),
  },
  FEED: {
    setLineSpacing: (n) => LINE_SPACING.LS_SET(n),
    DEFAULT_LINE_SPACING: LINE_SPACING.LS_DEFAULT,
    lines: (n = 1) => [0x1b, 0x64, n],
  },
  TEXT_FORMAT: {
    ALIGN_LEFT: TEXT_FORMAT.ALIGN_LT,
    ALIGN_CENTER: TEXT_FORMAT.ALIGN_CT,
    ALIGN_RIGHT: TEXT_FORMAT.ALIGN_RT,
    BOLD_ON: TEXT_FORMAT.BOLD_ON,
    BOLD_OFF: TEXT_FORMAT.BOLD_OFF,
    UNDERLINE_OFF: TEXT_FORMAT.UNDERL_OFF,
    UNDERLINE_1_DOT: TEXT_FORMAT.UNDERL_ON,
    UNDERLINE_2_DOTS: TEXT_FORMAT.UNDERL2_ON,
    ITALIC_ON: TEXT_FORMAT.ITALIC_ON,
    ITALIC_OFF: TEXT_FORMAT.ITALIC_OFF,
    FONT_A: TEXT_FORMAT.FONT_A,
    FONT_B: TEXT_FORMAT.FONT_B,
    FONT_C: TEXT_FORMAT.FONT_C,

    INVERT_ON: [0x1d, 0x42, 1],
    INVERT_OFF: [0x1d, 0x42, 0],
    // Keep this function because width/height is dynamic
  },
  CHARACTER_SIZE: {
    NORMAL: TEXT_FORMAT.NORMAL,
    setSize: (width, height) => {
      const value = ((width - 1) << 4) | (height - 1)
      return [0x1d, 0x21, value]
    },
    SMOOTHING_OFF: [0x1d, 0x62, 0x00],
    SMOOTHING_ON: [0x1d, 0x62, 0x01],
  },
  HARDWARE: {
    CUT_FULL: PAPER.CUT_FULL,
    CUT_PARTIAL: PAPER.CUT_PARTIAL,
    DRAWER_PIN2: CASH_DRAWER.KICK_PIN2,
    DRAWER_PIN5: CASH_DRAWER.KICK_PIN5,
    beep: BEEP.BEEP,
  },
}
