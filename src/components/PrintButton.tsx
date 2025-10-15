import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrint } from "@/hooks/usePrint"
import type { TemplateId, TemplateData } from "@/hooks/templates/registry"
import type { ComponentProps } from "react"

/**
 * Type-safe print button props
 * Generic T ensures data type matches templateId
 */
interface PrintButtonProps<T extends TemplateId> {
  templateId: T
  data?: TemplateData[T]
  label?: string
  variant?: ComponentProps<typeof Button>["variant"]
  size?: ComponentProps<typeof Button>["size"]
  disabled?: boolean
  className?: string
  showIcon?: boolean
}

/**
 * Reusable type-safe print button component
 *
 * @example
 * // With data (type-safe)
 * <PrintButton
 *   templateId="basic-receipt"
 *   data={{ items: [...], total: 100 }}
 *   label="Print Receipt"
 * />
 *
 * // Without data
 * <PrintButton
 *   templateId="test-pattern"
 *   label="Test Printer"
 * />
 */
export function PrintButton<T extends TemplateId>({
  templateId,
  data,
  label = "Print",
  variant = "default",
  size = "default",
  disabled = false,
  className,
  showIcon = true,
}: PrintButtonProps<T>) {
  const { print } = usePrint()

  const handleClick = async () => {
    await print(templateId, data)
  }

  return (
    <Button onClick={handleClick} disabled={disabled} variant={variant} size={size} className={className}>
      {showIcon && <Printer className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  )
}
