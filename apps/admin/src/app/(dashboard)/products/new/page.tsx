import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nuevo Producto</h2>
        <p className="text-muted-foreground">Crear un nuevo producto en el catálogo.</p>
      </div>

      <ProductForm />
    </div>
  )
}
