// escpos-bitmap-encoder.ts

/**
 * Hàm chính: Chuyển đổi Base64 PNG thành dữ liệu Bitmap nhị phân ESC/POS (GS v 0).
 * THỰC HIỆN TRONG TRÌNH DUYỆT sử dụng Canvas API.
 * @param base64Image - Chuỗi Base64 Data URL (PNG) của ảnh đã gộp.
 * @param threshold - Ngưỡng đen/trắng (0-255). Mặc định 128 (trung bình).
 * @returns {Promise<Uint8Array>} - Mảng byte lệnh ESC/POS hoàn chỉnh.
 */
export const createEscposBitmapCommand = (
    base64Image: string,
    threshold: number = 128
): Promise<Uint8Array> => {
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Cần thiết nếu ảnh có nguồn khác

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error("Canvas context not available."));

            const widthDots = img.width;
            const heightDots = img.height;
            
            canvas.width = widthDots;
            canvas.height = heightDots;
            
            // Vẽ ảnh lên Canvas
            ctx.drawImage(img, 0, 0);

            // Lấy dữ liệu Pixel thô (RGBa)
            const imageData = ctx.getImageData(0, 0, widthDots, heightDots);
            const data = imageData.data;
            
            // Dữ liệu Bitmap ESC/POS (Mảng byte 1-bit)
            const bitmapData: number[] = [];
            let byte = 0;
            let bitPosition = 0; // Vị trí bit (0-7) trong byte hiện tại

            // ----------------------------------------------------
            // BƯỚC 1: Xử lý và Mã hóa Byte (Hàm lõi)
            // ----------------------------------------------------
            
            for (let y = 0; y < heightDots; y++) {
                for (let x = 0; x < widthDots; x++) {
                    const i = (y * widthDots + x) * 4; // Vị trí pixel (R, G, B, A)
                    
                    // Tính độ sáng (Luminance) hoặc giá trị xám (Đơn giản là trung bình RGB)
                    const luminance = 
                        (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);

                    // Áp dụng thuật toán Ngưỡng (Thresholding)
                    // Nếu sáng hơn ngưỡng -> Trắng (0), Ngược lại -> Đen (1)
                    // ESC/POS: Bit 1 = ĐEN (Nóng), Bit 0 = TRẮNG (Không nóng)
                    const isBlack = luminance < threshold;

                    if (isBlack) {
                        // Đặt bit (Lệnh dịch bit: 1 << (7 - bitPosition))
                        // Vì ESC/POS thường yêu cầu thứ tự bit từ MSB (bit 7) đến LSB (bit 0)
                        byte |= (1 << (7 - bitPosition)); 
                    }

                    bitPosition++;

                    // Khi đủ 8 bit (1 byte), thêm vào mảng và reset
                    if (bitPosition === 8) {
                        bitmapData.push(byte);
                        byte = 0;
                        bitPosition = 0;
                    }
                }
                
                // Xử lý đệm byte (Padding) nếu chiều rộng ảnh không chia hết cho 8
                if (bitPosition !== 0) {
                    bitmapData.push(byte);
                    byte = 0;
                    bitPosition = 0;
                }
            }

            // ----------------------------------------------------
            // BƯỚC 2: Xây dựng Lệnh ESC/POS (GS v 0)
            // ----------------------------------------------------
            
            const xByteSize = bitmapData.length / heightDots; // Chiều rộng tính bằng byte
            
            const xL = xByteSize % 256;
            const xH = Math.floor(xByteSize / 256);
            const yL = heightDots % 256;
            const yH = Math.floor(heightDots / 256);

            // Lệnh GS v 0 m xL xH yL yH d1...dk
            const header = [
                0x1D, 0x76, 0x30, // GS v 0 (Lệnh in Raster Bit Image)
                0x00,             // m (Chế độ in - 0x00: Normal)
                xL, xH,           // Chiều rộng theo byte
                yL, yH            // Chiều cao theo dot
            ];
            
            const fullCommand = new Uint8Array(header.length + bitmapData.length);
            fullCommand.set(header, 0);
            fullCommand.set(bitmapData, header.length);
            
            resolve(fullCommand);
        };

        img.onerror = () => reject(new Error("Failed to load image for bitmap conversion."));

        // Bắt đầu tải ảnh
        img.src = base64Image;
    });
};