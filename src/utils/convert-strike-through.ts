/**
 * Measure the width of text with the specified font size.
 * @param text - Text.
 * @param fontSizePx - Kích thước font chữ (pixel).
 * @returns Chiều rộng của văn bản tính bằng pixel.
 */

const FONT_FAMILY = "Arial, Helvetica, monospace";

const measureTextWidth = (text: string, fontSizePx: number): number => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.font = `${fontSizePx}px ${FONT_FAMILY}`;
    return ctx.measureText(text).width;
};

const wrapText = (text: string, maxWidth: number, fontSizePx: number, fontFamily: string): string[] => {
    if (!text || !maxWidth || !fontSizePx) return [];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [text];

    ctx.font = `${fontSizePx}px ${fontFamily}`;

    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;

        if (ctx.measureText(testLine).width < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};


export const printDoubleColumnBase64 = (
    description: string,
    strikethroughText: string,
    svgTotalWidth: number = 576,
    fontSizePx: number = 24
): Promise<string> => {

    const PADDING = 0;
    const FONT_COLOR = '#666666';
    const lineHeight = fontSizePx * 1.5;

    const descX = PADDING;
    const strikethroughWidth = measureTextWidth(strikethroughText, fontSizePx);

    const maxDescWidth = svgTotalWidth - PADDING - 10 - strikethroughWidth;

    const descLines = wrapText(description, maxDescWidth, fontSizePx, FONT_FAMILY);

    const requiredHeight = descLines.length * lineHeight;

    const strikethroughX = svgTotalWidth - PADDING - strikethroughWidth;
    const textY_initial = PADDING + fontSizePx;
    const lineY = textY_initial - (fontSizePx * 0.35);

    const descriptionSvgLines = descLines.map((line, index) => {
        const y = PADDING + fontSizePx + index * lineHeight;
        return `<text x="${descX}" y="${y}" style="font-family: ${FONT_FAMILY}; font-size: ${fontSizePx}px; fill: ${FONT_COLOR}">
            ${line}
        </text>`;
    }).join('');

    const svgString = `
        <svg width="${svgTotalWidth}" height="${requiredHeight}" xmlns="http://www.w3.org/2000/svg">
            
            ${descriptionSvgLines} 
            
            <text x="${strikethroughX}" y="${textY_initial}" style="font-family: ${FONT_FAMILY}; font-size: ${fontSizePx}px; fill: ${FONT_COLOR}">
                ${strikethroughText}
            </text>

            <line 
                x1="${strikethroughX}" 
                y1="${lineY}" 
                x2="${svgTotalWidth - PADDING}" 
                y2="${lineY}" 
                stroke="#000000" 
                stroke-width="0.5"
            />
        </svg>
    `;
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const encodedSvg = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

        img.onload = () => {
            canvas.width = svgTotalWidth;
            canvas.height = requiredHeight;
            ctx?.drawImage(img, 0, 0);

            resolve(canvas.toDataURL('image/png'));
        };

        img.onerror = () => reject(new Error("Failed to load SVG for conversion."));

        img.src = encodedSvg;
    });
};