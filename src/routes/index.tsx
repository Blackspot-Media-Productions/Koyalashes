import { createFileRoute } from '@tanstack/react-router'
import Homepage from '~/app/Home'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Homepage />
}
