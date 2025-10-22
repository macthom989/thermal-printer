import { Br, Line, Text, wrapText } from "react-thermal-printer";
import { DEFAULT_PRINTER_CONFIG } from "@/constants/printer";
import { Fragment } from "react";
import { get, map, max, padEnd, padStart, repeat, trim, zip } from "lodash";

// --- TYPE DEFINITIONS ---

type Alignment = 'left' | 'right' | 'center';

interface ThermalPrinterTableCellContext<TData> {
    value: TData[keyof TData];
    row: TData;
}

export interface ThermalPrinterTableColumnDef<TData> {
    accessorKey: keyof TData;
    header?: string;
    width: number;
    align?: Alignment;
    alignCell?: Alignment;
    cell?: (context: ThermalPrinterTableCellContext<TData>) => string;
}

interface ThermalPrinterTableProps<TData> {
    columns: ThermalPrinterTableColumnDef<TData>[];
    data: TData[];
    enableHeader?: boolean;
    enableDivider?: boolean;
    enableBorder?: boolean;
}

// --- CORE HELPER FUNCTIONS ---

function textAlign(text: string, width: number, align: Alignment = 'left'): string {
    const safeText = trim(String(text ?? ''));
    switch (align) {
        case 'right':
            return padStart(safeText, width, ' ');
        case 'center':
            const padding = width - safeText.length;
            const leftPad = Math.floor(padding / 2);
            const rightPad = padding - leftPad;
            return repeat(' ', leftPad) + safeText + repeat(' ', rightPad);
        default:
            return padEnd(safeText, width, ' ');
    }
}

function getWrappedHeader<TData>(columns: ThermalPrinterTableColumnDef<TData>[]): string[][] {
    return columns.map(col =>
        wrapText(col.header ?? '', { width: col.width, wordBreak: 'break-word' })
    );
}

function getWrappedRow<TData>(dataRow: TData, columns: ThermalPrinterTableColumnDef<TData>[]): string[][] {
    return map(columns, col => {
        const rawValue = get(dataRow, col.accessorKey, '');
        const displayText = col.cell
            ? col.cell({ value: rawValue, row: dataRow })
            : String(rawValue);
        return wrapText(displayText, { width: col.width, wordBreak: 'break-word' });
    });
}

function normalizeRowHeight(wrappedRow: string[][]): string[][] {
    const maxLines = max(map(wrappedRow, 'length')) || 1;
    return wrappedRow.map(lines => {
        const newLines = [...lines];
        while (newLines.length < maxLines) {
            newLines.push('');
        }
        return newLines;
    });
}

function transposeAndFormatLines<TData>(
    normalizedRow: string[][],
    columns: ThermalPrinterTableColumnDef<TData>[],
    align: "header" | "cell"
): string[] {
    const transposedLines = zip(...normalizedRow);
    return map(transposedLines, lineArray => {
        const contentCells = map(lineArray, (cellLineText: string, colIndex: number) => {
            const col = columns[colIndex];
            const alignText = align === "cell" ? col.alignCell : col.align;
            return textAlign(cellLineText, col.width, alignText);
        });
        // return '|' + contentCells.join('|') + '|';
        return contentCells.join('');
    });
}

function getRowLines<TData>(
    data: TData[],
    columns: ThermalPrinterTableColumnDef<TData>[]
): { printLines: string[]; originalDataRow: TData }[] {
    return data.map(dataObject => {
        const wrappedRow = getWrappedRow(dataObject, columns);
        const normalizedRow = normalizeRowHeight(wrappedRow);
        const printLines = transposeAndFormatLines(normalizedRow, columns, "cell");
        return { printLines, originalDataRow: dataObject };
    });
}

function getHeaderLines<TData>(
    columns: ThermalPrinterTableColumnDef<TData>[]
): string[] {
    const wrappedHeader = getWrappedHeader(columns);
    const normalizedHeader = normalizeRowHeight(wrappedHeader);
    return transposeAndFormatLines(normalizedHeader, columns, "header");
}

export function ThermalPrinterTable<TData>({
    columns,
    data,
    enableHeader = true,
    enableDivider = false,
    enableBorder = false,
}: ThermalPrinterTableProps<TData>) {
    const totalColumnWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const totalBorderWidth = enableBorder ? columns.length + 1 : 0; // N columns has N+1 borders
    const totalWidth = totalColumnWidth + totalBorderWidth;

    if (totalWidth !== DEFAULT_PRINTER_CONFIG.width) {
        throw new Error(`Total width must be equal to printer width: ${totalWidth} !== ${DEFAULT_PRINTER_CONFIG.width}`);
    }

    const headerLines = getHeaderLines(columns);
    const rowLines = getRowLines(data, columns);

    return (
        <>
            {enableHeader && headerLines.map((line, index) => (
                <Text key={index} bold>{line}</Text>
            ))}
            {enableDivider ? <Line /> : <Br />}
            {rowLines.map((rowLine, rowIndex) => (
                <Fragment key={rowIndex}>
                    {rowLine.printLines.map((line, lineIndex) =>
                        <Text key={`${rowIndex}-${lineIndex}`}>{line}</Text>
                    )}
                </Fragment>
            ))}
        </>
    );
}