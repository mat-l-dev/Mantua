import { StaffRoleForm } from '@/components/staff/roles/role-form'
import { getStaffRole } from '@/actions/staff-roles'

export default async function EditStaffRolePage({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params
  const role = await getStaffRole(roleId)

  if (!role) {
    return <div>Rol no encontrado</div>
  }

  const formattedRole = {
    ...role,
    permissions: role.permissions as Record<string, boolean>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StaffRoleForm initialData={formattedRole} />
    </div>
  )
}
