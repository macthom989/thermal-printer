export type EscPosCommand = readonly number[];
export type EscPosCommandFn = (value: number) => EscPosCommand;

export interface EscPosConfig {
  readonly CONTROL: {
    readonly INIT: EscPosCommand;
    readonly RESET: EscPosCommand;
    readonly CARRIAGE_RETURN: EscPosCommand;
    setPosition: (x: number, y: number) => EscPosCommand;
  };

  readonly FEED: {
    lines: EscPosCommandFn;
    readonly DEFAULT_LINE_SPACING: EscPosCommand;
    setLineSpacing: EscPosCommandFn;
  };

  readonly TEXT_FORMAT: {
    readonly ALIGN_LEFT: EscPosCommand;
    readonly ALIGN_CENTER: EscPosCommand;
    readonly ALIGN_RIGHT: EscPosCommand;
    readonly BOLD_ON: EscPosCommand;
    readonly BOLD_OFF: EscPosCommand;
    readonly UNDERLINE_OFF: EscPosCommand;
    readonly UNDERLINE_1_DOT: EscPosCommand;
    readonly UNDERLINE_2_DOTS: EscPosCommand;
    readonly ITALIC_ON: EscPosCommand;
    readonly ITALIC_OFF: EscPosCommand;
    readonly INVERT_ON: EscPosCommand;
    readonly INVERT_OFF: EscPosCommand;
    readonly FONT_A: EscPosCommand;
    readonly FONT_B: EscPosCommand;
    readonly FONT_C: EscPosCommand;
  };

  readonly CHARACTER_SIZE: {
    readonly NORMAL: EscPosCommand;
    setSize: (width: number, height: number) => EscPosCommand;
    readonly SMOOTHING_OFF: EscPosCommand;
    readonly SMOOTHING_ON: EscPosCommand;
  };

  readonly HARDWARE: {
    readonly CUT_FULL: EscPosCommand;
    readonly CUT_PARTIAL: EscPosCommand;
    readonly DRAWER_PIN2: EscPosCommand;
    readonly DRAWER_PIN5: EscPosCommand;
    beep: (times?: number, duration?: number) => EscPosCommand;
  };
}