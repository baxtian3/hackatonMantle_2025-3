"use client"

import type React from "react"

import { useState } from "react"
import { useClone } from "@/contexts/CloneContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function InitialScreen() {
  const [userSeed, setUserSeed] = useState("")
  const { createClone0, isLoading, error } = useClone()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userSeed.trim()) {
      await createClone0(userSeed.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-2">AlterEgo Chain</h1>
          <p className="text-gray-600 text-sm">Crea clones introspectivos de tu conciencia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userSeed" className="block text-sm font-medium text-gray-700 mb-2">
              Descríbete a ti mismo
            </label>
            <Textarea
              id="userSeed"
              value={userSeed}
              onChange={(e) => setUserSeed(e.target.value)}
              placeholder="Soy una persona que..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-gray-400 focus:ring-0"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <Button
            type="submit"
            disabled={!userSeed.trim() || isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando Clon 0...
              </>
            ) : (
              "Crear Clon 0"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
