import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { StaffRoleClient } from '@/components/staff/roles/client'
import { getStaffRoles } from '@/actions/staff-roles'
import { StaffRoleColumn } from '@/components/staff/roles/columns'

export default async function StaffRolesPage() {
  const roles = await getStaffRoles()

  const formattedRoles: StaffRoleColumn[] = (roles || []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    created_at: format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es }),
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StaffRoleClient data={formattedRoles} />
    </div>
  )
}
