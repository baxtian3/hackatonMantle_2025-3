"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useClone } from "../contexts/CloneContext"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { X, Send, GitBranch, Loader2 } from "lucide-react"

export default function ChatPanel() {
  const { selectedClone, selectClone, continueClone0, continueBifurcated, forkClone, isLoading, error, setError } =
    useClone()

  const [message, setMessage] = useState("")
  const [showForkOptions, setShowForkOptions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedClone?.mensajes])

  useEffect(() => {
    setError(null)
  }, [selectedClone, setError])

  if (!selectedClone) return null

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const messageToSend = message.trim()
    setMessage("")

    try {
      if (selectedClone.tipo === "clon_0") {
        await continueClone0(selectedClone.id, messageToSend)
      } else {
        await continueBifurcated(selectedClone.id, messageToSend)
      }
    } catch (err) {
      setMessage(messageToSend) // Restaurar mensaje si hay error
    }
  }

  const handleFork = async (forkType: string) => {
    setShowForkOptions(false)
    await forkClone(selectedClone.id, forkType)
  }

  const getCloneTitle = () => {
    if (selectedClone.tipo === "clon_0") {
      return "Clon Original"
    }
    return `${selectedClone.tipo_bifurcacion}`
  }

  const getCloneColor = () => {
    if (selectedClone.tipo === "clon_0") return "text-gray-800"
    if (selectedClone.tipo_bifurcacion === "Futuro") return "text-emerald-600"
    if (selectedClone.tipo_bifurcacion === "Universo paralelo") return "text-violet-600"
    if (selectedClone.tipo_bifurcacion === "Desconocida") return "text-red-600"
    return "text-gray-700"
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className={`font-medium ${getCloneColor()}`}>{getCloneTitle()}</h2>
          <p className="text-xs text-gray-500">
            {selectedClone.mensajes.length} {selectedClone.mensajes.length === 1 ? "mensaje" : "mensajes"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectClone(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedClone.mensajes.map((msg, index) => (
          <div key={index} className={`flex ${msg.rol === "usuario" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.rol === "usuario" ? "bg-gray-100 text-gray-900" : "bg-gray-50 text-gray-800 border border-gray-200"
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">{msg.rol === "usuario" ? "Tú" : getCloneTitle()}</div>
              <div className="text-sm whitespace-pre-wrap">{msg.contenido}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Fork Options */}
      {showForkOptions && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-700 mb-3">Bifurcar hacia:</p>
          <div className="space-y-2">
            <Button
              onClick={() => handleFork("Futuro")}
              variant="outline"
              size="sm"
              className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              disabled={isLoading}
            >
              Futuro - Versión más madura
            </Button>
            <Button
              onClick={() => handleFork("Universo paralelo")}
              variant="outline"
              size="sm"
              className="w-full justify-start text-violet-600 border-violet-200 hover:bg-violet-50"
              disabled={isLoading}
            >
              Universo paralelo - Decisiones distintas
            </Button>
            <Button
              onClick={() => handleFork("Desconocida")}
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              disabled={isLoading}
            >
              Desconocida - Realidad abstracta
            </Button>
          </div>
          <Button onClick={() => setShowForkOptions(false)} variant="ghost" size="sm" className="w-full mt-2">
            Cancelar
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Button
            onClick={() => setShowForkOptions(!showForkOptions)}
            variant="outline"
            size="sm"
            className="text-gray-600"
            disabled={isLoading}
          >
            <GitBranch className="h-4 w-4 mr-1" />
            Bifurcar
          </Button>
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none border-gray-200 focus:border-gray-400 focus:ring-0"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-gray-900 hover:bg-gray-800 text-white px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
