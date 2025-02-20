"use client"

import { useCallback, useState } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  Controls,
  Handle,
  Position,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from './ui/button'
import { Check, X } from 'lucide-react'

interface WorkflowDiagramProps {
  steps: Array<{
    id: string
    title: string
    description: string
    type: 'input' | 'process' | 'decision' | 'output'
  }>
  isEditable?: boolean
  onSave?: (nodes: Node[]) => void
  onCancel?: () => void
}

const CustomNode = ({ data }: { data: { title: string; description: string; type: string } }) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'input':
        return 'bg-blue-500'
      case 'process':
        return 'bg-purple-500'
      case 'decision':
        return 'bg-yellow-500'
      case 'output':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className={`px-4 py-2 rounded-lg shadow-lg ${getNodeStyle()} text-white`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="text-sm font-medium">{data.title}</div>
      <div className="text-xs opacity-80">{data.description}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export function WorkflowDiagram({ steps, isEditable = false, onSave, onCancel }: WorkflowDiagramProps) {
  const [isInteractive, setIsInteractive] = useState(false)

  const initialNodes: Node[] = steps.map((step, index) => ({
    id: step.id,
    type: 'custom',
    position: { x: 100, y: index * 150 },
    data: {
      title: step.title,
      description: step.description,
      type: step.type,
    },
    draggable: isEditable && isInteractive,
  }))

  const initialEdges: Edge[] = steps.slice(0, -1).map((step, index) => ({
    id: `e${index}`,
    source: step.id,
    target: steps[index + 1].id,
    animated: true,
    style: { stroke: '#94a3b8' },
  }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isInteractive) {
      console.log('Clicked node:', node)
    }
  }, [isInteractive])

  return (
    <ReactFlowProvider>
      <div 
        className="relative h-[300px] w-full rounded-lg overflow-hidden glass-effect"
        onClick={() => !isInteractive && setIsInteractive(true)}
        onMouseLeave={() => setIsInteractive(false)}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          className="bg-transparent"
          panOnDrag={isInteractive}
          panOnScroll={isInteractive}
          zoomOnScroll={isInteractive}
          selectionOnDrag={isInteractive && isEditable}
          nodesConnectable={isInteractive && isEditable}
          elementsSelectable={isInteractive && isEditable}
        >
          <Background color="#94a3b8" variant="dots" />
          <Controls 
            className={`glass-effect transition-opacity duration-200 ${isInteractive ? 'opacity-100' : 'opacity-0'}`} 
            showInteractive={isInteractive}
          />
        </ReactFlow>
        
        {isEditable && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => onSave?.(nodes)}
            >
              <Check className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsInteractive(false)
                onCancel?.()
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}

        {!isInteractive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full">
              Click to interact
            </p>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}