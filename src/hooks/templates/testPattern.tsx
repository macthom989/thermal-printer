import { uint8ArrayToBase64 } from "@/utils/base64"
import { useEffect } from "react"
import { Br, Cut, Line, Printer, render, Row, Text } from "react-thermal-printer"

// Function to get test pattern template
export function getTestPatternTemplate() {
    return (
        <Printer type="epson" width={48}>
            {/* Header */}
            <Text align="center" bold size={{ width: 2, height: 2 }}>
                PRINTER TEST
            </Text>
            <Br />
            <Line />
            <Br />

            {/* Font Sizes */}
            <Text bold>Font Size Tests:</Text>
            <Br />
            <Text>Normal text</Text>
            <Text size={{ width: 2, height: 1 }}>Width x2</Text>
            <Text size={{ width: 1, height: 2 }}>Height x2</Text>
            <Text size={{ width: 2, height: 2 }}>Both x2</Text>
            <Br />

            {/* Alignment */}
            <Line />
            <Text bold>Alignment Tests:</Text>
            <Br />
            <Text align="left">Left aligned</Text>
            <Text align="center">Center aligned</Text>
            <Text align="right">Right aligned</Text>
            <Br />

            {/* Text Styles */}
            <Line />
            <Text bold>Text Style Tests:</Text>
            <Br />
            <Text>Normal text</Text>
            <Text bold>Bold text</Text>
            <Text underline="1dot-thick">Underlined text</Text>
            <Text bold underline="1dot-thick">
                Bold + Underline
            </Text>
            <Br />

            {/* Row Layout */}
            <Line />
            <Text bold>Row Layout Test:</Text>
            <Br />
            <Row left="Item 1" right="$10.00" />
            <Row left="Item 2" right="$25.50" />
            <Row left="Item 3" right="$7.99" />
            <Line />
            <Row left="TOTAL:" right="$43.49" />
            <Br />

            {/* Line Spacing */}
            <Line />
            <Text bold>Line Spacing Test:</Text>
            <Br />
            <Text>Line 1</Text>
            <Text>Line 2</Text>
            <Text>Line 3</Text>
            <Br />
            <Br />

            {/* Footer */}
            <Line character="=" />
            <Text align="center">End of Test</Text>
            <Text align="center" size={{ width: 1, height: 1 }}>
                {new Date().toLocaleString()}
            </Text>

            <Cut partial lineFeeds={3} />
        </Printer>
    )
}

// Custom hook for test pattern
export function useTestPattern() {
    useEffect(() => {
        console.log('test-pattern hook initialized')
    }, [])

    const renderTestPattern = async (): Promise<string> => {
        const template = getTestPatternTemplate()
        const uint8Array = await render(template)
        const base64 = uint8ArrayToBase64(uint8Array)
        return base64
    }

    return {
        renderTestPattern,
    }
}
