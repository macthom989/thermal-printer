import { Button } from "@/components/ui/button"
import type { TemplateData, TemplateId } from "@/hooks/usePrint"
import { usePrint } from "@/hooks/usePrint"
import { useCallback, type ComponentProps } from "react"

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

export function PrintButton<T extends TemplateId>({
  templateId,
  data,
  label = "Print",
  variant = "default",
  size = "default",
  disabled = false,
  className,
}: PrintButtonProps<T>) {
  const { print } = usePrint()

  const handleClick = useCallback(async () => {
    await print(templateId, data)
  }, [print, templateId, data])

  return (
    <Button onClick={handleClick} disabled={disabled} variant={variant} size={size} className={className}>
      {label}
    </Button>
  )
}
