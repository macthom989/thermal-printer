import { Barcode, Br, Cut, Image, Line, Printer, QRCode, Raw, Row, Text } from "react-thermal-printer"
import { ThermalPrinter } from "@/components/ThermalPrinter"
import type { PrinterCheckboxOptions } from "@/types/templates"

/**
 * Printer checkbox template for testing printer capabilities
 * Dynamically renders selected printer features based on checkbox options
 * @param options - Selected printer options to test
 */
export function getPrinterCheckboxTemplate(options?: PrinterCheckboxOptions) {
  const hasAnySelection = options && Object.values(options).some(val => val === true)

  return (
    <ThermalPrinter preset="star">
      <Raw data={Uint8Array.from([0x1B, 0x3f, 0x0a, 0x00])} />
      <Raw data={Uint8Array.from([0x1B, 0x32, 0x00])} />
      {/* Header */}
      <Text align="center" bold size={{ width: 2, height: 2 }}>
        PRINTER TEST
      </Text>
      <Br />
      <Text align="center">Selected Options Test</Text>
      <Br />
      <Text align="left"> </Text>
      <Line />
      <Br />

      {!hasAnySelection && (
        <Printer type="epson" width={48}>
          <Text align="center">No options selected</Text>
          <Br />
          <Text align="center">Please select options to test</Text>
          <Br />
          <Text align="left"> </Text>
        </Printer>
      )}

      {/* Text Styles */}
      {(options?.bold || options?.doubleStrike || options?.underline || options?.invert || options?.fontA || options?.fontB || options?.size1x1 || options?.size2x1 || options?.size1x2 || options?.size2x2) && (
        <Printer type="epson" width={48}>
          <Text bold>TEXT STYLES:</Text>
          <Text bold={false} />
          <Br />
          <Line character="-" />
        </Printer>
      )}

      {options?.bold && (
        <Printer type="epson" width={48}>
          <Text bold>✓ Bold Text</Text>
          <Text bold={false} />
          <Br />
        </Printer>
      )}

      {options?.doubleStrike && (
        <Printer type="epson" width={48}>
          <Raw data={Uint8Array.from([0x1B, 0x47, 0x01])} />
          <Text>✓ Double Strike (Extra Bold)</Text>
          <Br />
          <Raw data={Uint8Array.from([0x1B, 0x47, 0x00])} />
        </Printer>
      )}

      {options?.underline && (
        <Printer type="epson" width={48}>
          <Text underline="1dot-thick">✓ Underlined Text</Text>
          <Raw data={Uint8Array.from([0x1B, 0x2D, 0x00])} />
          <Br />
        </Printer>
      )}

      {options?.invert && (
        <Printer type="epson" width={48}>
          <Text invert>✓ Inverted Text</Text>
          <Text invert={false} />
          <Br />
        </Printer>
      )}

      {options?.fontA && (
        <Printer type="epson" width={48}>
          <Raw data={Uint8Array.from([0x1B, 0x4D, 0x00])} />
          <Text>✓ Font A (12x24 - Standard)</Text>
          <Br />
        </Printer>
      )}

      {options?.fontB && (
        <Printer type="epson" width={48}>
          <Raw data={Uint8Array.from([0x1B, 0x4D, 0x01])} />
          <Text>✓ Font B (9x17 - Thin)</Text>
          <Br />
          <Raw data={Uint8Array.from([0x1B, 0x4D, 0x00])} />
        </Printer>
      )}

      {options?.size1x1 && (
        <Printer type="epson" width={48}>
          <Text size={{ width: 1, height: 1 }}>✓ Size 1x1 (Normal)</Text>
          <Br />
        </Printer>
      )}

      {options?.size2x1 && (
        <Printer type="epson" width={48}>
          <Text size={{ width: 2, height: 1 }}>✓ Size 2x1 (Wide)</Text>
          <Br />
        </Printer>
      )}

      {options?.size1x2 && (
        <Printer type="epson" width={48}>
          <Text size={{ width: 1, height: 2 }}>✓ Size 1x2 (Tall)</Text>
          <Br />
        </Printer>
      )}

      {options?.size2x2 && (
        <Printer type="epson" width={48}  >
          <Text size={{ width: 2, height: 2 }}>✓ Size 2x2 (Large)</Text>
          <Br />
        </Printer>
      )}

      {(options?.bold || options?.doubleStrike || options?.underline || options?.invert || options?.fontA || options?.fontB || options?.size1x1 || options?.size2x1 || options?.size1x2 || options?.size2x2) && <Br />}

      {/* Alignment */}
      {(options?.alignLeft || options?.alignCenter || options?.alignRight) && (
        <Printer type="epson" width={48}>
          <Text bold>ALIGNMENT:</Text>
          <Text bold={false} />
          <Br />
          <Line character="-" />
        </Printer>
      )}

      {options?.alignLeft && (
        <>
          <Text align="left">✓ Left Aligned</Text>
          <Br />
        </>
      )}

      {options?.alignCenter && (
        <>
          <Text align="center">✓ Center Aligned</Text>
          <Br />
        </>
      )}

      {options?.alignRight && (
        <>
          <Text align="right">✓ Right Aligned</Text>
          <Br />
        </>
      )}

      {/* Reset alignment back to default */}
      {(options?.alignLeft || options?.alignCenter || options?.alignRight) && (
        <Text align="left">Reset to left alignment</Text>
      )}

      {(options?.alignLeft || options?.alignCenter || options?.alignRight) && <Br />}

      {/* Special Elements */}
      {(options?.line || options?.row || options?.barcode || options?.qrCode || options?.image) && (
        <>
          <Text bold>SPECIAL ELEMENTS:</Text>
          <Text bold={false} />
          <Br />
          <Line character="-" />
        </>
      )}

      {options?.line && (
        <>
          <Text>✓ Line Element:</Text>
          <Line />
          <Br />
        </>
      )}

      {options?.row && (
        <>
          <Text>✓ Row Element:</Text>
          <Row left="Item Name" right="$10.00" />
          <Br />
        </>
      )}

      {options?.barcode && (
        <>
          <Text>✓ Barcode:</Text>
          <Br />
          <Barcode type="UPC-A" align="center" content="111111111111" />
          <Br />
        </>
      )}

      {options?.qrCode && (
        <>
          <Text>✓ QR Code:</Text>
          <Br />
          <QRCode align="center" content="https://github.com/seokju-na/react-thermal-printer" />
          <Br />
        </>
      )}

      {options?.image && (
        <>
          <Text>✓ Image:</Text>
          <Br />
          <Raw data={Uint8Array.from([0x1B, 0x61, 0x01])} />
          {options?.imageUrl && <Image src={options?.imageUrl} align="center" />}
          <Raw data={Uint8Array.from([0x1B, 0x61, 0x00])} />
        </>
      )}

      {(options?.line || options?.row || options?.barcode || options?.qrCode || options?.image) && <Br />}

      {/* ESC/POS Commands */}
      {(options?.initPrinter || options?.lineFeeds || options?.characterSpacing) && (
        <>
          <Text >ESC/POS COMMANDS:</Text>
          <Br />
          <Line character="-" />
        </>
      )}

      {options?.initPrinter && (
        <>
          <Text>✓ Initialize Printer (ESC @)</Text>
          <Br />
          <Text>Printer reset to default state</Text>
          <Br />
        </>
      )}

      {options?.lineFeeds && (
        <>
          <Text>✓ Line Feeds (3 blank lines):</Text>
          <Br />
          <Br />
          <Br />
          <Text>End of line feeds test</Text>
          <Br />
        </>
      )}

      {options?.characterSpacing && (
        <>
          <Text>✓ Character Spacing Test</Text>
          <Br />
        </>
      )}

      {(options?.initPrinter || options?.lineFeeds || options?.characterSpacing) && <Br />}

      {/* Footer */}
      <Line character="=" />
      <Text align="center">End of Test</Text>
      <Text align="center" size={{ width: 1, height: 1 }}>
        {new Date().toLocaleString()}
      </Text>

      {/* Cut Commands */}
      {options?.cutPartial && <Cut partial lineFeeds={3} />}
      {options?.cutFull && !options?.cutPartial && <Cut />}
      {!options?.cutPartial && !options?.cutFull && <Cut partial lineFeeds={3} />}
    </ThermalPrinter>
  )
}

