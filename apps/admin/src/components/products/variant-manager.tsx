'use client'

import { useState } from "react"
import { VariantWithStock, createVariant, updateVariant, deleteVariant, updateStock } from "@/actions/variants"
import { Database } from "@mantua/shared/types/database.types"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash, Edit, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@mantua/shared/utils/format"

interface VariantManagerProps {
  productId: string
  variants: VariantWithStock[]
  stockLocations: Database['public']['Tables']['stock_locations']['Row'][]
}

export function VariantManager({ productId, variants, stockLocations }: VariantManagerProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<VariantWithStock | null>(null)
  const [managingStock, setManagingStock] = useState<VariantWithStock | null>(null)
  const [loading, setLoading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    selling_price: 0
  })

  const resetForm = () => {
    setFormData({ name: "", sku: "", selling_price: 0 })
    setEditingVariant(null)
    setManagingStock(null)
  }

  const handleCreate = async () => {
    try {
      setLoading(true)
      await createVariant({
        product_id: productId,
        name: formData.name,
        sku: formData.sku,
        selling_price: formData.selling_price
      })
      toast({ title: "Variant created" })
      setIsCreateOpen(false)
      resetForm()
    } catch {
      toast({ title: "Error creating variant", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingVariant) return
    try {
      setLoading(true)
      await updateVariant(editingVariant.id, {
        name: formData.name,
        sku: formData.sku,
        selling_price: formData.selling_price
      })
      toast({ title: "Variant updated" })
      setEditingVariant(null)
      resetForm()
    } catch {
      toast({ title: "Error updating variant", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return
    try {
      setLoading(true)
      await deleteVariant(id)
      toast({ title: "Variant deleted" })
    } catch {
      toast({ title: "Error deleting variant", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (locationId: string, quantity: number) => {
    if (!managingStock) return
    try {
      await updateStock(managingStock.id, locationId, quantity)
      toast({ title: "Stock updated" })
    } catch {
      toast({ title: "Error updating stock", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Variants</h3>
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Variant
        </Button>
      </div>

      <div className="rounded-lg border border-input">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No variants found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell>{variant.name || "Default"}</TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell>{formatCurrency(variant.selling_price)}</TableCell>
                  <TableCell>
                    {variant.product_stock.reduce((acc, stock) => acc + stock.quantity, 0)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setManagingStock(variant)
                      }}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingVariant(variant)
                        setFormData({
                          name: variant.name || "",
                          sku: variant.sku || "",
                          selling_price: variant.selling_price
                        })
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(variant.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Variant</DialogTitle>
            <DialogDescription>Add a new variant to this product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Large, Red"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Unique SKU"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingVariant} onOpenChange={(open) => !open && setEditingVariant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sku">SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVariant(null)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Dialog */}
      <Dialog open={!!managingStock} onOpenChange={(open) => !open && setManagingStock(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Stock - {managingStock?.name}</DialogTitle>
            <DialogDescription>Update stock quantities for each location.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {stockLocations.map((location) => {
              const currentStock = managingStock?.product_stock.find(s => s.location_id === location.id)?.quantity || 0
              return (
                <div key={location.id} className="flex items-center justify-between border border-input p-3 rounded-lg">
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-muted-foreground">{location.address || "No address"}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`stock-${location.id}`} className="sr-only">Quantity</Label>
                    <Input
                      id={`stock-${location.id}`}
                      type="number"
                      className="w-24"
                      defaultValue={currentStock}
                      onBlur={(e) => handleStockUpdate(location.id, Number(e.target.value))}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setManagingStock(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
