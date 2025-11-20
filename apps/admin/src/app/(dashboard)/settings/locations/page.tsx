import { getPickupLocations, getStockLocations } from '@/actions/locations'
import { LocationsClient } from '@/components/settings/locations/locations-client'

export default async function LocationsPage() {
  const pickupLocations = await getPickupLocations()
  const stockLocations = await getStockLocations()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <LocationsClient 
        pickupLocations={pickupLocations} 
        stockLocations={stockLocations} 
      />
    </div>
  )
}
