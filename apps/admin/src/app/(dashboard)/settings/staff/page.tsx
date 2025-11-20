import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { StaffClient } from '@/components/staff/users/client'
import { getStaffMembers } from '@/actions/staff'
import { StaffColumn } from '@/components/staff/users/columns'

export default async function StaffPage() {
  const staff = await getStaffMembers()

  const formattedStaff: StaffColumn[] = staff.map((item) => ({
    id: item.id,
    name: `${item.first_name} ${item.last_name}`,
    email: item.email || 'No disponible',
    role: item.staff_roles?.name || 'Sin Rol',
    is_active: item.is_active || false,
    created_at: format(new Date(item.created_at), "d 'de' MMMM, yyyy", { locale: es }),
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StaffClient data={formattedStaff} />
    </div>
  )
}
