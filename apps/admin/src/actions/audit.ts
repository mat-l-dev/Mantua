'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getAuditLogs() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }

  return data
}
