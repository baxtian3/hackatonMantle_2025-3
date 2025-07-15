"use client"

import { CloneProvider } from "@/contexts/CloneContext"
import AlterEgoApp from "@/components/AlterEgoApp"

export default function Home() {
  return (
    <CloneProvider>
      <AlterEgoApp />
    </CloneProvider>
  )
}
