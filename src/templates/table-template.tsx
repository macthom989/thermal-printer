import { ThermalPrinterTable } from "@/components/thermal-printer.table";
import { ThermalPrinter } from "@/components/thermal-printer";
import type { TableData } from "@/types/templates";
import type { ThermalPrinterTableColumnDef } from "@/components/thermal-printer.table";
import { DEFAULT_PRINTER_CONFIG } from "@/constants/printer";

interface InvoiceItem {
  id: number;
  name: string;
  qty: number;
  unitPrice: number;  
  total: number;
}

const columns: ThermalPrinterTableColumnDef<InvoiceItem>[] = [
  {
    header: "#",
    accessorKey: "id",
    align: 'center',
    alignCell: 'center',
    width: 3,
  },
  {
    header: "Item Name Item Name Item Name Item Name Item Name Item Name Item Name Item Name ",
    accessorKey: "name",
    width: 20,
    align: 'center',
    alignCell: 'center',
  },
  {
    header: "Qty",
    accessorKey: "qty",
    width: 5,
    align: 'center',
    alignCell: 'center',
  },
  {
    header: "Price",
    accessorKey: "unitPrice",
    width: 10,
    align: 'center',
    cell: ({ value }) => value.toLocaleString(),
    alignCell: 'center',
  },
  {
    header: "Total",
    accessorKey: "total",
    width: 10,
    align: 'center',
    cell: ({ value }) => value.toLocaleString(),
    alignCell: 'center',
  },
];


export function tableTemplate(data?: TableData) {
  const dataTable: InvoiceItem[] = [
    { id: 1, name: data?.items?.[0]?.name || "", qty: data?.items?.[0]?.quantity || 0, unitPrice: data?.items?.[0]?.price || 0, total: data?.items?.[0]?.price || 0 * (data?.items?.[0]?.quantity || 0) },
    { id: 2, name: data?.items?.[1]?.name || "", qty: data?.items?.[1]?.quantity || 0, unitPrice: data?.items?.[1]?.price || 0, total: data?.items?.[1]?.price || 0 * (data?.items?.[1]?.quantity || 0) },
    { id: 3, name: data?.items?.[2]?.name || "", qty: data?.items?.[2]?.quantity || 0, unitPrice: data?.items?.[2]?.price || 0, total: data?.items?.[2]?.price || 0 * (data?.items?.[2]?.quantity || 0) },
  ];
  return (
    <ThermalPrinter {...DEFAULT_PRINTER_CONFIG}>
      <ThermalPrinterTable columns={columns} data={dataTable} />
    </ThermalPrinter>
  )
}

