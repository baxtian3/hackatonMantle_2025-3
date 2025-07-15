"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface CloneMessage {
  rol: "usuario" | "clon"
  contenido: string
}

export interface Clone {
  id: string
  tipo: "clon_0" | "bifurcación"
  semilla?: string
  origen?: string
  tipo_bifurcacion?: "Futuro" | "Universo paralelo" | "Desconocida"
  mensajes: CloneMessage[]
  x?: number
  y?: number
}

export interface GraphNode {
  id: string
  name: string
  type: "clon_0" | "bifurcación"
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

const API_BASE = "http://localhost:3001"

export function CloneProvider({ children }: { children: ReactNode }) {
  const [clones, setClones] = useState<Clone[]>([])
  const [selectedClone, setSelectedClone] = useState<Clone | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateGraphData = (clonesData: Clone[]) => {
    const nodes: GraphNode[] = clonesData.map((clone) => ({
      id: clone.id,
      name: clone.tipo === "clon_0" ? "Clon Original" : `${clone.tipo_bifurcacion}`,
      type: clone.tipo,
      fork_type: clone.tipo_bifurcacion,
      clone,
    }))

    const links: GraphLink[] = clonesData
      .filter((clone) => clone.origen)
      .map((clone) => ({
        source: clone.origen!,
        target: clone.id,
      }))

    return { nodes, links }
  }

  const graphData = updateGraphData(clones)

  const createClone0 = async (userSeed: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/crear-clon0`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_seed: userSeed }),
      })

      if (!response.ok) throw new Error("Error al crear el clon")

      const data = await response.json()
      const newClone: Clone = {
        id: data.id,
        tipo: "clon_0",
        semilla: userSeed,
        mensajes: [{ rol: "clon", contenido: data.respuesta_clon }],
      }

      setClones([newClone])
      setSelectedClone(newClone)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const continueClone0 = async (id: string, message: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/continuar-clon0`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, mensaje_usuario: message }),
      })

      if (!response.ok) throw new Error("Error al continuar conversación")

      const data = await response.json()

      setClones((prev) =>
        prev.map((clone) =>
          clone.id === id
            ? {
                ...clone,
                mensajes: [
                  ...clone.mensajes,
                  { rol: "usuario", contenido: message },
                  { rol: "clon", contenido: data.respuesta_clon },
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
                mensajes: [
                  ...prev.mensajes,
                  { rol: "usuario", contenido: message },
                  { rol: "clon", contenido: data.respuesta_clon },
                ],
              }
            : null,
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const forkClone = async (parentId: string, forkType: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/bifurcar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_id: parentId, fork_type: forkType }),
      })

      if (!response.ok) throw new Error("Error al bifurcar clon")

      const data = await response.json()
      const parentClone = clones.find((c) => c.id === parentId)

      const newClone: Clone = {
        id: data.id,
        tipo: "bifurcación",
        origen: parentId,
        tipo_bifurcacion: data.tipo_bifurcacion as "Futuro" | "Universo paralelo" | "Desconocida",
        semilla: parentClone?.semilla,
        mensajes: [{ rol: "clon", contenido: data.respuesta_clon }],
      }

      setClones((prev) => [...prev, newClone])
      setSelectedClone(newClone)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const continueBifurcated = async (id: string, message: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/continuar-bifurcado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, mensaje_usuario: message }),
      })

      if (!response.ok) throw new Error("Error al continuar conversación bifurcada")

      const data = await response.json()

      setClones((prev) =>
        prev.map((clone) =>
          clone.id === id
            ? {
                ...clone,
                mensajes: [
                  ...clone.mensajes,
                  { rol: "usuario", contenido: message },
                  { rol: "clon", contenido: data.respuesta_clon },
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
                mensajes: [
                  ...prev.mensajes,
                  { rol: "usuario", contenido: message },
                  { rol: "clon", contenido: data.respuesta_clon },
                ],
              }
            : null,
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
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
