import TopBar from "@/components/TopBar"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex-1 w-full max-w-7xl mx-auto">
        <TopBar />
        {children}
      </div>
    </>
  )
}
