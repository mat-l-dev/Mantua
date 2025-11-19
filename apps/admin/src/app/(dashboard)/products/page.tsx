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

  const formattedProducts: ProductColumn[] = (products || []).map((product: any) => ({
    id: product.id,
    name: product.name,
    sku: product.sku || 'N/A',
    selling_price: product.selling_price,
    cost_price: product.cost_price,
    puntos_acarreo: product.puntos_acarreo,
    is_active: product.is_active,
    created_at: new Date(product.created_at).toISOString(),
  }))

  return <ProductClient data={formattedProducts} />
}
