/**
 * Convert Uint8Array to base64 string for Tauri transmission
 */
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  // Browser environment
  if (typeof window !== "undefined" && typeof btoa !== "undefined") {
    const binary = String.fromCharCode(...uint8Array)
    return btoa(binary)
  }

  // Node.js environment
  if (typeof Buffer !== "undefined") {
    return Buffer.from(uint8Array).toString("base64")
  }

  throw new Error("No base64 encoding method available")
}

/**
 * Convert base64 string back to Uint8Array (if needed for debugging)
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  // Browser environment
  if (typeof window !== "undefined" && typeof atob !== "undefined") {
    const binary = atob(base64)
    return Uint8Array.from(binary, (char) => char.charCodeAt(0))
  }

  // Node.js environment
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"))
  }

  throw new Error("No base64 decoding method available")
}
