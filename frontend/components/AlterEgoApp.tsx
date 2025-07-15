"use client"

import { useClone } from "@/contexts/CloneContext"
import InitialScreen from "@/components/InitialScreen"
import GraphView from "@/components/GraphView"

export default function AlterEgoApp() {
  const { clones } = useClone()

  return <div className="min-h-screen bg-white">{clones.length === 0 ? <InitialScreen /> : <GraphView />}</div>
}
