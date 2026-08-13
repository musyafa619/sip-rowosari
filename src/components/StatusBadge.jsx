import { Badge } from '@/components/ui/badge'
import { statusLabels } from '@/data/dummy'

const statusVariant = {
  menunggu: 'warning',
  diproses: 'info',
  selesai: 'success',
}

export default function StatusBadge({ status }) {
  return (
    <Badge variant={statusVariant[status] || 'default'}>
      {statusLabels[status] || status}
    </Badge>
  )
}
