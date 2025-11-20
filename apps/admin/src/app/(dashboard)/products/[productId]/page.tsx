import { getProduct } from "@/actions/products"
import { getVariants, getStockLocations } from "@/actions/variants"
import { ProductForm } from "@/components/products/product-form"
import { VariantManager } from "@/components/products/variant-manager"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"

interface ProductPageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params
  const product = await getProduct(productId)
  const variants = await getVariants(productId)
  const stockLocations = await getStockLocations()

  if (!product) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <Separator />
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium mb-4">Product Details</h3>
          <ProductForm initialData={product} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Variants & Stock</h3>
          <VariantManager 
            productId={product.id} 
            variants={variants} 
            stockLocations={stockLocations} 
          />
        </div>
      </div>
    </div>
  )
}
