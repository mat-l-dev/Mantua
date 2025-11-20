import { StaffForm } from '@/components/staff/users/staff-form'
import { getStaffMember } from '@/actions/staff'
import { getStaffRoles } from '@/actions/staff-roles'

export default async function EditStaffPage({ params }: { params: Promise<{ staffId: string }> }) {
  const { staffId } = await params
  const staff = await getStaffMember(staffId)
  const roles = await getStaffRoles()

  if (!staff) {
    return <div>Usuario no encontrado</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StaffForm initialData={staff} roles={roles} />
    </div>
  )
}
