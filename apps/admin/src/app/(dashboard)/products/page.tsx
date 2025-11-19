import { getProducts } from "@/actions/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">
            Total: {products.length} productos
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">
            Aún no hay productos. ¡Crea uno para empezar!
          </p>
          <Link href="/products/new">
            <Button>Crear Primer Producto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {product.image_path && (
                <img
                  src={product.image_path}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {product.description}
              </p>
              <div className="space-y-1 mb-4 text-sm">
                <p>
                  <span className="font-medium">Precio:</span> S/ {product.price}
                </p>
                <p>
                  <span className="font-medium">Costo:</span> S/ {product.cost}
                </p>
                <p>
                  <span className="font-medium">Puntos:</span>{" "}
                  {product.puntos_acarreo}
                </p>
              </div>
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
