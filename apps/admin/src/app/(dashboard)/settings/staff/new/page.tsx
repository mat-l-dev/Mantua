import { StaffForm } from '@/components/staff/users/staff-form'
import { getStaffRoles } from '@/actions/staff-roles'

export default async function NewStaffPage() {
  const roles = await getStaffRoles()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StaffForm roles={roles} />
    </div>
  )
}
