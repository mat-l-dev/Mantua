'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

export default function ShowcasePage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Apple Design System</h1>
        <p className="text-muted-foreground text-lg">
          Componentes de interfaz implementados con estética minimalista y funcional.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Botones */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Botones</CardTitle>
            <CardDescription>Variantes de interacción principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Primary (Default)</p>
                <div className="flex flex-col gap-2 items-start">
                  <Button>Default</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Secondary</p>
                <div className="flex flex-col gap-2 items-start">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="secondary" size="sm">Small</Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Destructive</p>
                <div className="flex flex-col gap-2 items-start">
                  <Button variant="destructive">Delete</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Ghost & Outline</p>
                <div className="flex flex-col gap-2 items-start">
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Indicadores de estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Formularios */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Formularios</CardTitle>
            <CardDescription>Inputs y controles de selección</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="usuario@ejemplo.com" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal cursor-pointer">
                  Aceptar términos y condiciones
                </Label>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">Notificaciones</Label>
                  <p className="text-xs text-muted-foreground">
                    Recibir alertas por correo
                  </p>
                </div>
                <Switch id="notifications" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tipografía y Colores */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Tipografía</CardTitle>
            <CardDescription>Jerarquía visual del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">H1 Title</h1>
              <p className="text-xs text-muted-foreground">text-4xl font-extrabold</p>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tight">H2 Title</h2>
              <p className="text-xs text-muted-foreground">text-3xl font-semibold</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">H3 Title</h3>
              <p className="text-xs text-muted-foreground">text-2xl font-semibold</p>
            </div>
            <div className="space-y-1">
              <p className="leading-7 not-first:mt-6">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-xs text-muted-foreground">body text</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
