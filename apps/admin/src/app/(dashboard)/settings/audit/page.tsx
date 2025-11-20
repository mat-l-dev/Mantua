import { getAuditLogs } from '@/actions/audit'
import { AuditClient } from '@/components/settings/audit/client'
import { AuditLog } from '@/components/settings/audit/columns'

export const dynamic = 'force-dynamic'

export default async function AuditPage() {
  const logs = await getAuditLogs()

  // Transform database types to UI types if necessary, or cast safely
  const formattedLogs: AuditLog[] = logs?.map(log => ({
    id: log.id,
    table_name: log.table_name,
    record_id: log.record_id,
    action: log.action,
    old_data: log.old_data as Record<string, unknown> | null,
    new_data: log.new_data as Record<string, unknown> | null,
    changed_by: log.changed_by,
    ip_address: log.ip_address,
    user_agent: log.user_agent,
    created_at: log.created_at
  })) || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AuditClient data={formattedLogs} />
    </div>
  )
}
