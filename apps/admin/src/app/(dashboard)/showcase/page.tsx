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
    <div className="flex-col animate-fade-in">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <h1 className="text-3xl font-bold">Apple Design System</h1>
        <p className="text-muted-foreground">Componentes completamente implementados</p>

        <Card>
          <CardHeader>
            <CardTitle>Botones</CardTitle>
            <CardDescription>Todas las variantes disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Azul (Default)</p>
              <div className="flex gap-2 flex-wrap">
                <Button>Default</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Verde (Secondary)</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="secondary">Secondary</Button>
                <Button variant="secondary" size="sm">Small</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Rojo (Destructive)</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="destructive">Delete</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Outline</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Ghost</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formularios</CardTitle>
            <CardDescription>Inputs y controles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="usuario@ejemplo.com" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="check" />
              <Label htmlFor="check" className="font-normal">Aceptar términos</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="switch" />
              <Label htmlFor="switch" className="font-normal">Notificaciones</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Etiquetas y estados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            ✅ Apple Design System completamente implementado y funcional
          </p>
        </div>
      </div>
    </div>
  )
}
