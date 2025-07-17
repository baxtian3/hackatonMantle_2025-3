"use client"

import { useEffect, useRef, useState } from "react"
import { useClone } from "@/contexts/CloneContext"
import ChatPanel from "@/components/ChatPanel"
import dynamic from "next/dynamic"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
})

export default function GraphView() {
  const { graphData, selectedClone, selectClone } = useClone()
  const fgRef = useRef<any>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("charge").strength(-300)
      fgRef.current.d3Force("link").distance(100)
    }
  }, [])

  const handleNodeClick = (node: any) => {
    selectClone(node.clone)
  }

  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D) => {
    const label = node.name
    const fontSize = 12
    ctx.font = `${fontSize}px Inter, sans-serif`
    
    // Determine color based on type
    let nodeColor = "#374151" // gray-700 default
    if (node.type === "clone_0") {
      nodeColor = "#1f2937" // gray-800
    } else if (node.fork_type === "Future") {
      nodeColor = "#059669" // emerald-600
    } else if (node.fork_type === "Parallel universe") {
      nodeColor = "#7c3aed" // violet-600
    } else if (node.fork_type === "Unknown") {
      nodeColor = "#dc2626" // red-600
    }

    ctx.beginPath()
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false)
    ctx.fillStyle = nodeColor
    ctx.fill()

    if (selectedClone?.id === node.id) {
      ctx.strokeStyle = nodeColor
      ctx.lineWidth = 2
      ctx.stroke()
    }

    const textWidth = ctx.measureText(label).width
    const bckgDimensions = [textWidth + 4, fontSize + 2]

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2 + 15,
      bckgDimensions[0],
      bckgDimensions[1]
    )

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = nodeColor
    ctx.fillText(label, node.x, node.y + 16)
  }

  return (
    <div className="h-screen flex">
      <div className={`transition-all duration-300 ${selectedClone ? "w-2/3" : "w-full"}`}>
        <div className="h-full relative">
          <div className="absolute top-4 left-4 z-10">
            <h1 className="text-2xl font-light text-gray-900">AlterEgo Chain</h1>
            <p className="text-sm text-gray-600">
              {graphData.nodes.length} {graphData.nodes.length === 1 ? "clon" : "clones"}
            </p>
          </div>

          {/* ForceGraph2D solo se renderiza si ya conocemos dimensiones */}
          {dimensions.width > 0 && dimensions.height > 0 && (
            <ForceGraph2D
              ref={fgRef}
              graphData={graphData}
              nodeCanvasObject={nodeCanvasObject}
              onNodeClick={handleNodeClick}
              linkColor={() => "#e5e7eb"}
              linkWidth={1}
              backgroundColor="white"
              width={selectedClone ? dimensions.width * 0.67 : dimensions.width}
              height={dimensions.height}
              nodePointerAreaPaint={(node, color, ctx) => {
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI, false)
                ctx.fill()
              }}
            />
          )}
        </div>
      </div>

      {selectedClone && (
        <div className="w-1/3 border-l border-gray-200">
          <ChatPanel />
        </div>
      )}
    </div>
  )
}
