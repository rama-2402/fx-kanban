import Navbar from '../components/layout/Navbar'
import KanbanBoard from '../components/kanban/KanbanBoard'

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[60px] min-h-screen bg-[#0F172A] px-4 sm:px-6 py-6 overflow-x-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          FX Design Tracker — Dashboard
        </h1>
        <KanbanBoard />
      </main>
    </>
  )
}
