import * as htmlToImage from 'html-to-image';
export const printDoubleColumnBase64 = async (
    description?: string | null,
    strikethroughText?: string | null,
): Promise<string> => {

    const htmlString = ` 
    <div style="width: 576px; display: grid; grid-template-columns: 2fr 1fr" id="node">
            <div style="width: 100%; word-break: break-word; font-size: 26px; font-family: 'LS-Light'; font-weight: 100">
                (${description})
        </div>
        <div style="text-align: right; flex-shrink: 0;">
          <span style="text-decoration: line-through; text-decoration-thickness: 1px; font-size: 26px; font-family: 'Calibri'; font-weight: 100;">
            ${strikethroughText}
          </span>
        </div>
    </div>
`;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '0';
    tempContainer.style.left = '0';
    tempContainer.style.opacity = '0';
    tempContainer.style.pointerEvents = 'none';
    tempContainer.style.zIndex = '-1';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.color = 'black';

    document.body.appendChild(tempContainer);
    tempContainer.innerHTML = htmlString;

    const node = document.getElementById('node') as HTMLElement;

    if (!node) {
        throw new Error("Could not find the root element to capture in the temporary DOM.");
    }

    try {
        const dataUrl = await htmlToImage.toPng(node, {
            cacheBust: true,
        });
        return dataUrl;
    } catch (error) {
        console.error("HTML-to-Image capture failed (during toDataURL):", error);
        throw new Error("Failed to capture and convert complex HTML.");
    }
    finally {
        document.getElementById('node')?.remove();
    }
}