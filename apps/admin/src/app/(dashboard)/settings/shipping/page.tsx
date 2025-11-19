import { getTiers } from "@/actions/shipping"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TierUpdateForm } from "@/components/settings/tier-form"

interface Tier {
  id: string
  tier_scope: string
  puntos_minimos: number
  puntos_maximos: number
  costo: number
}

export default async function ShippingSettingsPage() {
  const tiers = (await getTiers()) as Tier[]

  const limaTiers = tiers.filter((t) => t.tier_scope === "lima_callao")
  const provinciaTiers = tiers.filter((t) => t.tier_scope === "provincia")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Configuración de Envíos
        </h2>
        <p className="text-muted-foreground">
          Gestiona los costos por tramos de puntos.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* LIMA */}
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/10">
          <CardHeader>
            <CardTitle>Lima Metropolitana & Callao</CardTitle>
            <CardDescription>
              Tarifas sugeridas para envío directo (Indrive/Motorizado).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {limaTiers.map((tier) => (
              <TierUpdateForm key={tier.id} tier={tier} />
            ))}
          </CardContent>
        </Card>

        {/* PROVINCIA */}
        <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/10">
          <CardHeader>
            <CardTitle>Provincias</CardTitle>
            <CardDescription>
              Costo de traslado a Agencia (Shalom/Marvisur).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {provinciaTiers.map((tier) => (
              <TierUpdateForm key={tier.id} tier={tier} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
