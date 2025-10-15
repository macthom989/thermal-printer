use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrinterInfo {
    pub name: String,
}

/// List all available printers
#[tauri::command]
pub fn list_printers() -> Result<Vec<PrinterInfo>, String> {
    let printers = super::driver::list_printers()
        .map_err(|e| format!("Failed to list printers: {}", e))?;

    Ok(printers
        .into_iter()
        .map(|name| PrinterInfo { name })
        .collect())
}

#[tauri::command]
pub fn print(printer_name: String, template_base64: String) -> Result<bool, String> {
    super::driver::print_base64(&printer_name, &template_base64)
        .map_err(|e| format!("Failed to print: {}", e))?;

    Ok(true)
}

/// Send test print to specified printer
#[tauri::command]
pub fn test_printer(printer_name: String) -> Result<bool, String> {
    super::driver::test_print(&printer_name)
        .map_err(|e| format!("Failed to test printer: {}", e))?;

    Ok(true)
}

