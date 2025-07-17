"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Update the interfaces to match the new English backend structure
export interface CloneMessage {
  role: "user" | "clone"
  content: string
}

export interface Clone {
  id: string
  type: "clone_0" | "fork"
  seed?: string
  origin?: string
  fork_type?: "Future" | "Parallel universe" | "Unknown"
  messages: CloneMessage[]
  x?: number
  y?: number
}

export interface GraphNode {
  id: string
  name: string
  type: "clone_0" | "bifurcación"
  fork_type?: string
  clone: Clone
}

export interface GraphLink {
  source: string
  target: string
}

interface CloneContextType {
  clones: Clone[]
  graphData: { nodes: GraphNode[]; links: GraphLink[] }
  selectedClone: Clone | null
  isLoading: boolean
  error: string | null
  createClone0: (userSeed: string) => Promise<void>
  continueClone0: (id: string, message: string) => Promise<void>
  forkClone: (parentId: string, forkType: string) => Promise<void>
  continueBifurcated: (id: string, message: string) => Promise<void>
  selectClone: (clone: Clone | null) => void
  setError: (error: string | null) => void
}

const CloneContext = createContext<CloneContextType | undefined>(undefined)

// Update API endpoints
const API_BASE = "http://localhost:3001"

export function CloneProvider({ children }: { children: ReactNode }) {
  const [clones, setClones] = useState<Clone[]>([])
  const [selectedClone, setSelectedClone] = useState<Clone | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update the updateGraphData function
  const updateGraphData = (clonesData: Clone[]) => {
    const nodes: GraphNode[] = clonesData.map((clone) => ({
      id: clone.id,
      name: clone.type === "clone_0" ? "Original Clone" : `${clone.fork_type}`,
      type: clone.type,
      fork_type: clone.fork_type,
      clone,
    }))

    const links: GraphLink[] = clonesData
      .filter((clone) => clone.origin)
      .map((clone) => ({
        source: clone.origin!,
        target: clone.id,
      }))

    return { nodes, links }
  }

  const graphData = updateGraphData(clones)

  // Update the createClone0 function
  const createClone0 = async (userSeed: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/create-clone0`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_seed: userSeed }),
      })

      if (!response.ok) throw new Error("Error creating clone")

      const data = await response.json()
      const newClone: Clone = {
        id: data.id,
        type: "clone_0",
        seed: userSeed,
        messages: [{ role: "clone", content: data.clone_response }],
      }

      setClones([newClone])
      setSelectedClone(newClone)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the continueClone0 function
  const continueClone0 = async (id: string, message: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/continue-clone0`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_message: message }),
      })

      if (!response.ok) throw new Error("Error continuing conversation")

      const data = await response.json()

      setClones((prev) =>
        prev.map((clone) =>
          clone.id === id
            ? {
                ...clone,
                messages: [
                  ...clone.messages,
                  { role: "user", content: message },
                  { role: "clone", content: data.clone_response },
                ],
              }
            : clone,
        ),
      )

      if (selectedClone?.id === id) {
        setSelectedClone((prev) =>
          prev
            ? {
                ...prev,
                messages: [
                  ...prev.messages,
                  { role: "user", content: message },
                  { role: "clone", content: data.clone_response },
                ],
              }
            : null,
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the forkClone function
  const forkClone = async (parentId: string, forkType: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/fork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_id: parentId, fork_type: forkType }),
      })

      if (!response.ok) throw new Error("Error forking clone")

      const data = await response.json()
      const parentClone = clones.find((c) => c.id === parentId)

      const newClone: Clone = {
        id: data.id,
        type: "fork",
        origin: parentId,
        fork_type: data.fork_type as "Future" | "Parallel universe" | "Unknown",
        seed: parentClone?.seed,
        messages: [{ role: "clone", content: data.clone_response }],
      }

      setClones((prev) => [...prev, newClone])
      setSelectedClone(newClone)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the continueBifurcated function
  const continueBifurcated = async (id: string, message: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/continue-fork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_message: message }),
      })

      if (!response.ok) throw new Error("Error continuing forked conversation")

      const data = await response.json()

      setClones((prev) =>
        prev.map((clone) =>
          clone.id === id
            ? {
                ...clone,
                messages: [
                  ...clone.messages,
                  { role: "user", content: message },
                  { role: "clone", content: data.clone_response },
                ],
              }
            : clone,
        ),
      )

      if (selectedClone?.id === id) {
        setSelectedClone((prev) =>
          prev
            ? {
                ...prev,
                messages: [
                  ...prev.messages,
                  { role: "user", content: message },
                  { role: "clone", content: data.clone_response },
                ],
              }
            : null,
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const selectClone = (clone: Clone | null) => {
    setSelectedClone(clone)
  }

  return (
    <CloneContext.Provider
      value={{
        clones,
        graphData,
        selectedClone,
        isLoading,
        error,
        createClone0,
        continueClone0,
        forkClone,
        continueBifurcated,
        selectClone,
        setError,
      }}
    >
      {children}
    </CloneContext.Provider>
  )
}

export function useClone() {
  const context = useContext(CloneContext)
  if (context === undefined) {
    throw new Error("useClone must be used within a CloneProvider")
  }
  return context
}
