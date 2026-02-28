import Navbar from '../components/layout/Navbar'
import TaskForm from '../components/form/TaskForm'

export default function FormPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[60px] min-h-screen bg-[#0F172A] px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Submit New Design Task
        </h1>
        <div className="max-w-[800px] mx-auto">
          <TaskForm />
        </div>
      </main>
    </>
  )
}
