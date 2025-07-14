"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconDownload,
} from "@tabler/icons-react"
import { z } from "zod"

import { useIsMobile } from "../../hooks/use-mobile"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { cn } from "@/lib/utils"

export const historicoSchema = z.object({
  id: z.string(),
  data: z.string(),
  entrada: z.string().optional(),
  saidaAlmoco: z.string().optional(),
  retornoAlmoco: z.string().optional(),
  saida: z.string().optional(),
  totalHoras: z.number().optional(),
})

export function HistoricoTable({
  data: initialData,
  showHeaderControls = true,
  pageSize = 10,
}: {
  data: z.infer<typeof historicoSchema>[]
  showHeaderControls?: boolean
  pageSize?: number
}) {
  const [data, setData] = React.useState(() => initialData)
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState<number | ''>('')
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  })
  const isMobile = useIsMobile()

  // Atualizar dados quando initialData mudar
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Obter anos únicos dos dados
  const getUniqueYears = () => {
    const years = new Set<number>()
    initialData.forEach(record => {
      const year = new Date(record.data).getFullYear()
      years.add(year)
    })
    return Array.from(years).sort((a, b) => b - a) // Ordenar decrescente
  }

  // Obter meses únicos para o ano selecionado
  const getUniqueMonths = () => {
    const months = new Set<number>()
    initialData.forEach(record => {
      const recordDate = new Date(record.data)
      if (recordDate.getFullYear() === selectedYear) {
        months.add(recordDate.getMonth() + 1) // +1 porque getMonth() retorna 0-11
      }
    })
    return Array.from(months).sort((a, b) => a - b) // Ordenar crescente
  }

  // Filtrar dados baseado no ano e mês selecionados
  const getFilteredData = () => {
    return initialData.filter(record => {
      const recordDate = new Date(record.data)
      const recordYear = recordDate.getFullYear()
      const recordMonth = recordDate.getMonth() + 1

      if (recordYear !== selectedYear) return false
      
      if (selectedMonth !== '' && recordMonth !== selectedMonth) return false
      
      return true
    })
  }

  const filteredData = getFilteredData()

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    setSelectedMonth('') // Resetar mês quando ano mudar
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Resetar página
  }

  const handleMonthChange = (month: number | '') => {
    setSelectedMonth(month)
    setPagination(prev => ({ ...prev, pageIndex: 0 })) // Resetar página
  }

  const handleDownloadXLSX = () => {
    // Criar dados para download
    const downloadData = filteredData.map((record, index) => ({
      'Item': index + 1,
      'Data': new Date(record.data).toLocaleDateString('pt-BR'),
      'Entrada': record.entrada || '-',
      'Saída Almoço': record.saidaAlmoco || '-',
      'Retorno Almoço': record.retornoAlmoco || '-',
      'Saída': record.saida || '-',
      'Total Horas': record.totalHoras ? `${record.totalHoras.toFixed(2)}h` : '-'
    }))

    // Converter para CSV (simples, sem biblioteca externa)
    const headers = Object.keys(downloadData[0])
    const csvContent = [
      headers.join(','),
      ...downloadData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n')

    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `historico_${selectedYear}${selectedMonth ? `_${selectedMonth}` : ''}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns: ColumnDef<z.infer<typeof historicoSchema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Item",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.index + 1}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => (
        <div className="font-medium">
          {new Date(row.original.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "entrada",
      header: "Entrada",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.entrada || '-'}
        </div>
      ),
    },
    {
      accessorKey: "saidaAlmoco",
      header: "Saída Almoço",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.saidaAlmoco || '-'}
        </div>
      ),
    },
    {
      accessorKey: "retornoAlmoco",
      header: "Retorno Almoço",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.retornoAlmoco || '-'}
        </div>
      ),
    },
    {
      accessorKey: "saida",
      header: "Saída",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.saida || '-'}
        </div>
      ),
    },
    {
      accessorKey: "totalHoras",
      header: "Saldo Horas",
      cell: ({ row }) => {
        if (!row.original.totalHoras) return <div className="font-medium">-</div>;
        
        const config = { dailyWorkHours: 8, lunchBreakHours: 1 }; // Configuração padrão
        const expectedHours = config.dailyWorkHours;
        const workedHours = row.original.totalHoras;
        const balance = workedHours - expectedHours;
        
        const isPositive = balance >= 0;
        const colorClass = isPositive ? "text-green-600" : "text-red-600";
        const sign = isPositive ? "+" : "";
        
        return (
          <div className={`font-medium ${colorClass}`}>
            {sign}{balance.toFixed(2)}h
          </div>
        );
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
  })

  const years = getUniqueYears()
  const months = getUniqueMonths()

  if (isMobile) {
    return (
      <div className="space-y-4">
        {showHeaderControls && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMonth === '' ? 'todos' : selectedMonth.toString()} onValueChange={(value) => handleMonthChange(value === 'todos' ? '' : parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">
                    <em>Todos</em>
                  </SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(2000, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <IconLayoutColumns className="mr-2 h-4 w-4" />
                  Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="space-y-2">
          {table.getRowModel().rows.map((row) => (
            <Drawer key={row.id}>
              <DrawerTrigger asChild>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Item {row.index + 1}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(row.original.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Detalhes do Registro</DrawerTitle>
                  <DrawerDescription>
                    Informações completas do registro de ponto
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Data</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(row.original.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Entrada</p>
                      <p className="text-sm text-muted-foreground">
                        {row.original.entrada || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Saída Almoço</p>
                      <p className="text-sm text-muted-foreground">
                        {row.original.saidaAlmoco || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Retorno Almoço</p>
                      <p className="text-sm text-muted-foreground">
                        {row.original.retornoAlmoco || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Saída</p>
                      <p className="text-sm text-muted-foreground">
                        {row.original.saida || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Horas</p>
                      <p className="text-sm text-muted-foreground">
                        {row.original.totalHoras ? `${row.original.totalHoras.toFixed(2)}h` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Fechar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))}
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showHeaderControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMonth === '' ? 'todos' : selectedMonth.toString()} onValueChange={(value) => handleMonthChange(value === 'todos' ? '' : parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">
                  <em>Todos</em>
                </SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {new Date(2000, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadXLSX}
            >
              <IconDownload className="mr-2 h-4 w-4" />
              Baixar XLSX
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <IconLayoutColumns className="mr-2 h-4 w-4" />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  // Adiciona borda arredondada na primeira e última coluna
                  const isFirst = idx === 0;
                  const isLast = idx === headerGroup.headers.length - 1;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn({
                        'rounded-tl-md': isFirst,
                        'rounded-tr-md': isLast,
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum registro encontrado para o período selecionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 