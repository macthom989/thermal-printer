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
 * Tải, căn giữa, và tùy chỉnh kích thước hình ảnh để in trên máy in ESC/POS (giấy 80mm).
 * Đảm bảo ảnh không quá lớn so với giới hạn maxImageWidth.
 *
 * @param imageUrl URL của hình ảnh.
 * @param containerWidth Độ rộng tối đa (dot) của vùng in (mặc định 576 dot cho giấy 80mm).
 * @param maxImageWidth Độ rộng tối đa mong muốn cho ảnh (đảm bảo ảnh nhỏ vừa, mặc định 400 dot).
 * @param options Tùy chọn tùy chỉnh: padding, màu nền, chất lượng.
 * @returns Promise<string> Base64 Data URL của hình ảnh đã được căn giữa và scale.
 */
export function alignCenterImage(
    imageUrl: string,
    containerWidth: number = 576, 
    maxImageWidth: number = 256,
    options: {
        backgroundColor?: string
        imageType?: "image/png" | "image/jpeg"
        quality?: number
        padding?: number
        scaleUp?: boolean 
    } = {}
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const {
            backgroundColor = "white",
            imageType = "image/png",
            quality = 1,
            padding = 0,
            scaleUp = false,
        } = options

        const image = new Image()
        image.crossOrigin = "anonymous"

        image.onerror = () => {
            reject(new Error(`Failed to load image: ${imageUrl}`))
        }

        image.onload = () => {
            try {
                // 1. Tính toán kích thước ảnh gốc và giới hạn
                const originalWidth = image.width
                const originalHeight = image.height
                
                // Độ rộng tối đa có sẵn cho ảnh:
                // Chọn MIN(Giới hạn mong muốn, Container - Padding)
                const effectiveMaxWidth = Math.min(maxImageWidth, containerWidth - padding * 2);

                let finalImageWidth = originalWidth
                let finalImageHeight = originalHeight
                
                // 2. Tính toán tỷ lệ Scale
                const scaleFactor = effectiveMaxWidth / originalWidth

                // Điều kiện Scale: Cần thu nhỏ (Ảnh lớn hơn giới hạn)
                if (scaleFactor < 1) {
                    finalImageWidth = Math.round(originalWidth * scaleFactor)
                    finalImageHeight = Math.round(originalHeight * scaleFactor)
                } else if (scaleUp && scaleFactor > 1) {
                    // Nếu cho phép phóng to và ảnh nhỏ hơn giới hạn
                    finalImageWidth = Math.round(originalWidth * scaleFactor)
                    finalImageHeight = Math.round(originalHeight * scaleFactor)
                } else {
                    // Nếu ảnh đã nhỏ hơn giới hạn và không phóng to, giữ nguyên kích thước gốc
                    finalImageWidth = originalWidth;
                    finalImageHeight = originalHeight;
                }
                
                // --- Xử lý Canvas ---

                // 3. Kích thước Canvas (Canvas vẫn bằng độ rộng giấy 576 dot)
                const canvasWidth = containerWidth 
                const canvasHeight = finalImageHeight + padding * 2

                const canvas = document.createElement("canvas")
                canvas.width = canvasWidth
                canvas.height = canvasHeight

                const context = canvas.getContext("2d")
                if (!context) {
                    reject(new Error("Failed to get canvas context"))
                    return
                }

                // 4. Vẽ nền
                context.fillStyle = backgroundColor
                context.fillRect(0, 0, canvasWidth, canvasHeight)

                // 5. Tính toán vị trí để căn giữa ảnh (ảnh đã được scale)
                const x = (canvasWidth - finalImageWidth) / 2 // Căn giữa ảnh đã scale
                const y = padding 

                // 6. Vẽ ảnh đã scale
                context.drawImage(
                    image, 
                    x, 
                    y, 
                    finalImageWidth, 
                    finalImageHeight 
                )

                // 7. Chuyển đổi sang base64
                const dataUrl = canvas.toDataURL(imageType, quality)
                resolve(dataUrl)
            } catch (error) {
                reject(error)
            }
        }

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