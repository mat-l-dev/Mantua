"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateTierCost } from "@/actions/shipping"
import { Loader2, Check, Save } from "lucide-react"

export function TierUpdateForm({ tier }: { tier: any }) {
  const [cost, setCost] = useState(tier.costo)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const res = await updateTierCost(tier.id, Number(cost))
    setLoading(false)

    if (res.error) {
      alert("Error al guardar")
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-zinc-950 shadow-sm">
      <div className="space-y-1">
        <div className="font-medium text-sm">
          {tier.puntos_minimos} - {tier.puntos_maximos} Puntos
        </div>
        <div className="text-xs text-muted-foreground capitalize">
          {tier.nombre_tier}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">S/</span>
        <Input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-24 h-8 text-right"
          step="0.01"
        />
        <Button
          size="sm"
          variant={saved ? "outline" : "default"}
          className={
            saved ? "text-green-600 border-green-200 bg-green-50" : ""
          }
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
