use escpos::driver::Driver;
use printers::common::base::job::PrinterJobOptions;
use printers::common::base::printer::Printer;
use printers::{get_printer_by_name, get_printers};
use std::sync::Mutex;

/// WindowsDriver - Implements ESC/POS Driver trait for Windows printers
pub struct WindowsDriver {
    name: String,
    buffer: Mutex<Vec<u8>>,
}

impl WindowsDriver {
    /// Create a new WindowsDriver instance
    pub fn new(name: String) -> Self {
        Self {
            name,
            buffer: Mutex::new(Vec::new()),
        }
    }

    /// Get the Windows printer instance
    fn get_instance(&self) -> Option<Printer> {
        get_printer_by_name(&self.name)
    }
}

impl Driver for WindowsDriver {
    fn name(&self) -> String {
        self.name.clone()
    }

    fn write(&self, data: &[u8]) -> escpos::errors::Result<()> {
        self.buffer
            .lock()
            .map_err(|e| escpos::errors::PrinterError::Io(format!("Lock error: {}", e)))?
            .extend_from_slice(data);
        Ok(())
    }

    fn read(&self, _buf: &mut [u8]) -> escpos::errors::Result<usize> {
        Ok(0)
    }

    fn flush(&self) -> escpos::errors::Result<()> {
        let printer = self.get_instance().ok_or(escpos::errors::PrinterError::Input(
            format!("Printer not found: {}", self.name),
        ))?;

        let buffer_data: Vec<u8> = self
            .buffer
            .lock()
            .map_err(|e| escpos::errors::PrinterError::Io(format!("Lock error: {}", e)))?
            .drain(..)
            .collect();

        printer
            .print(&buffer_data, PrinterJobOptions::none())
            .map_err(|e| escpos::errors::PrinterError::Io(e.to_string()))?;

        Ok(())
    }
}

/// Get list of all available printers
pub fn list_printers() -> anyhow::Result<Vec<String>> {
    let printers = get_printers();
    Ok(printers.into_iter().map(|p| p.name).collect())
}

/// Print base64 encoded data to specified printer
pub fn print_base64(printer_name: &str, base64_data: &str) -> anyhow::Result<()> {
    use base64::{Engine as _, engine::general_purpose};
    let bytes = general_purpose::STANDARD.decode(base64_data)?;
    
    let driver = WindowsDriver::new(printer_name.to_string());
    driver.write(&bytes)?;
    driver.flush()?;

    Ok(())
}

/// Send test print to specified printer
pub fn test_print(printer_name: &str) -> anyhow::Result<()> {
    // Simple test receipt ESC/POS commands
    let test_data = vec![
        0x1b, 0x40, // Initialize printer
        0x1b, 0x61, 0x01, // Center align
        0x1b, 0x21, 0x30, // Double width and height
        b'T', b'E', b'S', b'T', 0x0a, // "TEST\n"
        0x1b, 0x21, 0x00, // Normal size
        b'P', b'r', b'i', b'n', b't', b'e', b'r', 0x0a, // "Printer\n"
        0x1b, 0x61, 0x00, // Left align
        0x0a, 0x0a, 0x0a, // 3 line feeds
        0x1d, 0x56, 0x01, // Partial cut
    ];

    let driver = WindowsDriver::new(printer_name.to_string());
    driver.write(&test_data)?;
    driver.flush()?;

    Ok(())
}

