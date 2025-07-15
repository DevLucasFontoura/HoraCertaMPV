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
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconDownload,
} from "@tabler/icons-react"
import { z } from "zod"

import { useIsMobile } from "../../hooks/use-mobile"
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

  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState<number | ''>(new Date().getMonth() + 1)
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

  // Memoizar anos únicos dos dados
  const years = React.useMemo(() => {
    const yearsSet = new Set<number>()
    
    initialData.forEach(record => {
      try {
        // Converter data do formato DD/MM/YYYY para Date
        const [day, month, year] = record.data.split('/')
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        
        if (!isNaN(date.getTime())) {
          const yearValue = date.getFullYear()
          if (!isNaN(yearValue)) {
            yearsSet.add(yearValue)
          }
        }
      } catch (error) {
        console.warn('Erro ao processar data:', record.data, error)
      }
    })
    
    const result = Array.from(yearsSet).sort((a, b) => b - a) // Ordenar decrescente
    return result
  }, [initialData])

  // Atualizar ano e mês selecionados quando os dados mudarem
  React.useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0])
    }
    
    // Garantir que o mês atual seja selecionado se não houver mês selecionado
    if (selectedMonth === '') {
      setSelectedMonth(new Date().getMonth() + 1)
    }
  }, [years, selectedYear, selectedMonth])

  // Memoizar meses únicos para o ano selecionado
  const months = React.useMemo(() => {
    const monthsSet = new Set<number>()
    initialData.forEach(record => {
      try {
        // Converter data do formato DD/MM/YYYY para Date
        const [day, month, year] = record.data.split('/')
        const recordDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        
        if (!isNaN(recordDate.getTime()) && recordDate.getFullYear() === selectedYear) {
          const monthValue = recordDate.getMonth() + 1 // +1 porque getMonth() retorna 0-11
          if (!isNaN(monthValue)) {
            monthsSet.add(monthValue)
          }
        }
      } catch (error) {
        console.warn('Erro ao processar data:', record.data, error)
      }
    })
    return Array.from(monthsSet).sort((a, b) => a - b) // Ordenar crescente
  }, [initialData, selectedYear])

  // Memoizar dados filtrados
  const filteredData = React.useMemo(() => {
    // Se não há mês selecionado, retornar array vazio
    if (selectedMonth === '') {
      return []
    }

    // Criar um mapa para busca mais eficiente
    const dataMap = new Map()
    initialData.forEach(record => {
      try {
        const [day, month, year] = record.data.split('/')
        const key = `${day}-${month}-${year}`
        dataMap.set(key, record)
      } catch (error) {
        // Ignorar registros com data inválida
      }
    })

    // Obter o número de dias no mês selecionado
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
    
    // Criar array com todos os dias do mês
    const allDays = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${day.toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`
      const key = `${day.toString().padStart(2, '0')}-${selectedMonth.toString().padStart(2, '0')}-${selectedYear}`
      
      // Procurar se existe registro para este dia
      const existingRecord = dataMap.get(key)
      
      if (existingRecord) {
        allDays.push(existingRecord)
      } else {
        // Criar registro vazio para este dia
        allDays.push({
          id: `empty_${day}`,
          data: dateString,
          entrada: '',
          saidaAlmoco: '',
          retornoAlmoco: '',
          saida: '',
          totalHoras: undefined
        })
      }
    }
    
    return allDays
  }, [initialData, selectedYear, selectedMonth])

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
        const downloadData = filteredData.map((record, index) => {
      return {
        'Item': index + 1,
        'Data': record.data, // Usar a data já formatada
        'Entrada': record.entrada || '-',
        'Saída Almoço': record.saidaAlmoco || '-',
        'Retorno Almoço': record.retornoAlmoco || '-',
        'Saída': record.saida || '-',
        'Total Horas': record.totalHoras ? `${record.totalHoras.toFixed(2)}h` : '-'
      }
    })

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
      header: "Dia",
      cell: ({ row }) => {
        // Extrair o dia da data
        const day = row.original.data.split('/')[0]
        return (
          <div className="font-medium">
            {day}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "data",
      header: "Dia da Semana",
      cell: ({ row }) => {
        try {
          const [day, month, year] = row.original.data.split('/')
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
          const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' })
          return (
            <div className="font-medium">
              {dayOfWeek}
            </div>
          )
        } catch (error) {
          return (
            <div className="font-medium">
              -
            </div>
          )
        }
      },
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
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  })


  
  // Debug: verificar se há dados e paginação
  console.log('Dados filtrados:', filteredData.length, 'registros')
  console.log('Página atual:', pagination.pageIndex + 1, 'de', table.getPageCount())
  console.log('Pode ir para próxima página:', table.getCanNextPage())
  console.log('Pode ir para página anterior:', table.getCanPreviousPage())
  
  if (initialData.length === 0) {
    console.log('Nenhum dado recebido na tabela')
  } else {
    console.log('Dados recebidos:', initialData.length, 'registros, anos:', years, 'ano selecionado:', selectedYear)
  }

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
                  {years.length > 0 ? (
                    years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={selectedYear.toString()}>
                      {selectedYear}
                    </SelectItem>
                  )}
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
                      Dia {row.original.data.split('/')[0]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {row.original.data}
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
                        {row.original.data}
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
            Página {pagination.pageIndex + 1} de {table.getPageCount()} • {table.getFilteredSelectedRowModel().rows.length} de{" "}
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
                {years.length > 0 ? (
                  years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={selectedYear.toString()}>
                    {selectedYear}
                  </SelectItem>
                )}
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
                  {selectedMonth === '' ? 'Selecione um mês para visualizar os registros.' : 'Nenhum registro encontrado para o período selecionado.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Página {pagination.pageIndex + 1} de {table.getPageCount()} • {table.getFilteredSelectedRowModel().rows.length} de{" "}
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