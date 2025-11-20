'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/ui/data-table'
import { PickupLocation, StockLocation } from '@/actions/locations'
import { columns as pickupColumns } from './pickup-columns'
import { columns as stockColumns } from './stock-columns'
import { PickupLocationForm } from './pickup-location-form'
import { StockLocationForm } from './stock-location-form'
import { Separator } from '@/components/ui/separator'

interface LocationsClientProps {
  pickupLocations: PickupLocation[]
  stockLocations: StockLocation[]
}

export function LocationsClient({ pickupLocations, stockLocations }: LocationsClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logística y Agencias</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las agencias de recojo y almacenes de inventario.
          </p>
        </div>
      </div>
      <Separator />
      
      <Tabs defaultValue="pickup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pickup">Agencias de Recojo</TabsTrigger>
          <TabsTrigger value="stock">Almacenes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pickup" className="space-y-4">
          <div className="flex justify-end">
            <PickupLocationForm />
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
            <DataTable
              columns={pickupColumns}
              data={pickupLocations}
              filterPlaceholder="Buscar agencia..."
              filterColumn="name"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stock" className="space-y-4">
          <div className="flex justify-end">
            <StockLocationForm />
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
            <DataTable
              columns={stockColumns}
              data={stockLocations}
              filterPlaceholder="Buscar almacén..."
              filterColumn="name"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
