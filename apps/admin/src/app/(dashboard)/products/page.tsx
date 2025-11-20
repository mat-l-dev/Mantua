export const dynamic = 'force-dynamic'

import { getProducts } from '@/actions/products'
import { ProductClient } from '@/components/products/client'
import { ProductColumn } from '@/components/products/columns'

export const metadata = {
  title: 'Productos | Admin',
  description: 'Gestiona los productos de tu tienda',
}

export default async function ProductsPage() {
  const products = await getProducts()

  const formattedProducts: ProductColumn[] = (products || []).map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku || 'N/A',
    selling_price: product.selling_price,
    cost_price: product.cost_price,
    puntos_acarreo: product.puntos_acarreo,
    is_active: product.is_active,
    published: product.published ?? false,
    created_at: new Date(product.created_at).toISOString(),
  }))

  return (
    <div className="flex-col animate-fade-in">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}
