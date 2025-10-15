/**
 * Convert image URL to base64 data URL
 * Uses fetch API (bypasses CORS in Tauri)
 * 
 * @param url - Image URL (http://, https://)
 * @returns Promise<string> - Base64 data URL (data:image/png;base64,...)
 * 
 * @example
 * const base64 = await imageUrlToBase64("https://example.com/image.png")
 * // Returns: "data:image/png;base64,iVBORw0KGgo..."
 */
export async function imageUrlToBase64(url: string): Promise<string> {
    try {
        // Use fetch API (in Tauri, this runs in Rust and bypasses CORS)
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
        }

        // Convert response to blob
        const blob = await response.blob()

        // Convert blob to base64 data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error('Failed to read image blob'))
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        throw new Error(`Failed to convert image URL to base64: ${error}`)
    }
}

/**
 * Align image to center without scaling
 * @param imageUrl - Image URL (http:// or data:image/...)
 * @param containerWidth - Container width in pixels (default: 576px ~= 48mm * 12 dots/mm)
 * @param options - Additional options
 * @returns Promise<string> - Base64 data URL of centered image
 */
export function alignCenterImage(
    imageUrl: string,
    containerWidth: number = 576,
    options: {
        backgroundColor?: string
        imageType?: "image/png" | "image/jpeg"
        quality?: number
        padding?: number
    } = {}
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const {
            backgroundColor = "white",
            imageType = "image/png",
            quality = 1,
            padding = 0,
        } = options

        const image = new Image()

        // Enable CORS for external images
        image.crossOrigin = "anonymous"

        image.onerror = () => {
            reject(new Error(`Failed to load image: ${imageUrl}`))
        }

        image.onload = () => {
            try {
                // Use original image dimensions (no scaling)
                const imageWidth = image.width
                const imageHeight = image.height

                // Calculate canvas dimensions
                // Width: use containerWidth or image width (whichever is larger for centering)
                const canvasWidth = Math.max(containerWidth, imageWidth + padding * 2)
                const canvasHeight = imageHeight + padding * 2

                // Create canvas
                const canvas = document.createElement("canvas")
                canvas.width = canvasWidth
                canvas.height = canvasHeight

                const context = canvas.getContext("2d")
                if (!context) {
                    reject(new Error("Failed to get canvas context"))
                    return
                }

                // Fill background
                context.fillStyle = backgroundColor
                context.fillRect(0, 0, canvasWidth, canvasHeight)

                // Calculate position to center image
                const x = (canvasWidth - imageWidth) / 2
                const y = padding

                // Draw image at original size, centered
                context.drawImage(image, x, y, imageWidth, imageHeight)

                // Convert to base64
                const dataUrl = canvas.toDataURL(imageType, quality)
                resolve(dataUrl)
            } catch (error) {
                reject(error)
            }
        }

        // Load image
        image.src = imageUrl
    })
}

/**
 * Align image from base64 string
 * @param base64String - Base64 image string (without data:image prefix)
 * @param containerWidth - Container width in pixels
 * @param options - Additional options
 */
export function alignCenterImageFromBase64(
    base64String: string,
    containerWidth: number = 576,
    options?: Parameters<typeof alignCenterImage>[2]
): Promise<string> {
    const dataUrl = `data:image/png;base64,${base64String}`
    return alignCenterImage(dataUrl, containerWidth, options)
}