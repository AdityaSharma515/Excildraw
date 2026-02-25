import { cookies } from "next/headers"
import DashBoardClient, { Board } from "./DashBoardClient"

export default async function DashboardPage() {
  const cookieStore = await cookies()

    let boards:Board[] = []
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const res = await fetch(`${BASE_URL}/boards`, {
          headers: {
            Cookie: cookieStore.toString(),
          },
          cache: "no-store",
        })
        const data = await res.json()
        boards=data.boards
      } catch (error) {
        console.error("Failed to fetch boards")
      } 

  return (
    <DashBoardClient boards={boards} />
  )
}