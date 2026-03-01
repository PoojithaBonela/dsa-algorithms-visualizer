import { useState } from 'react'
import { Settings2, ChevronLeft } from 'lucide-react'
import { LandingPage } from './pages/Landing'
import { AlgorithmCatalog } from './pages/AlgorithmCatalog'
import { AlgorithmList } from './pages/AlgorithmList'
import { Visualizer } from './components/visualizer/Visualizer'
import { BubbleSortPage } from './pages/BubbleSortPage'
import { SelectionSortPage } from './pages/SelectionSortPage'
import { InsertionSortPage } from './pages/InsertionSortPage'
import { QuickSortPage } from './pages/QuickSortPage'
import { MergeSortPage } from './pages/MergeSortPage'
import { LinearSearchPage } from './pages/LinearSearchPage'
import { BinarySearchPage } from './pages/BinarySearchPage'
import { StackPage } from './pages/StackPage'
import { QueuePage } from './pages/QueuePage'
import { CreateBinaryTreePage } from './pages/CreateBinaryTreePage'
import { ExploreBinaryTreeTypesPage } from './pages/ExploreBinaryTreeTypesPage'
import { generateBubbleSortTrace } from './lib/algorithms/sorting'
import type { AlgorithmTrace } from './lib/algorithms/types'

function App() {
  // State
  const [view, setView] = useState<'landing' | 'catalog' | 'algorithm-list' | 'visualizer' | 'bubble-sort-visualizer' | 'selection-sort-visualizer' | 'insertion-sort-visualizer' | 'quick-sort-visualizer' | 'merge-sort-visualizer' | 'linear-search-visualizer' | 'binary-search-visualizer' | 'stack-visualizer' | 'queue-visualizer' | 'create-binary-tree-visualizer' | 'explore-binary-tree-types-visualizer'>('landing')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('')
  const [trace, setTrace] = useState<AlgorithmTrace | null>(null)

  const handleAlgorithmSelect = (algoId: string) => {
    setSelectedAlgorithm(algoId)
    if (algoId === 'bubble-sort') {
      setView('bubble-sort-visualizer')
      return
    }
    if (algoId === 'selection-sort') {
      setView('selection-sort-visualizer')
      return
    }
    if (algoId === 'insertion-sort') {
      setView('insertion-sort-visualizer')
      return
    }
    if (algoId === 'quick-sort') {
      setView('quick-sort-visualizer')
      return
    }
    if (algoId === 'merge-sort') {
      setView('merge-sort-visualizer')
      return
    }
    if (algoId === 'linear-search') {
      setView('linear-search-visualizer')
      return
    }
    if (algoId === 'binary-search') {
      setView('binary-search-visualizer')
      return
    }
    if (algoId === 'stack') {
      setView('stack-visualizer')
      return
    }
    if (algoId === 'queue') {
      setView('queue-visualizer')
      return
    }
    if (algoId === 'create-binary-tree') {
      setView('create-binary-tree-visualizer')
      setSelectedAlgorithm('create binary tree')
      return
    }
    if (algoId === 'explore-binary-tree-types') {
      setView('explore-binary-tree-types-visualizer')
      setSelectedAlgorithm('explore tree types')
      return
    }

    // Generate trace based on selected algorithm for others
    setView('visualizer')
  }

  const handleReset = () => {
    if (selectedAlgorithm === 'bubble-sort') {
      const data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) + 10)
      setTrace(generateBubbleSortTrace(data))
    }
  }

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('catalog')} />
  }

  if (view === 'catalog') {
    return (
      <AlgorithmCatalog
        onBack={() => setView('landing')}
        onSelect={(category) => {
          setSelectedCategory(category)
          setView('algorithm-list')
        }}
      />
    )
  }

  if (view === 'algorithm-list') {
    return (
      <AlgorithmList
        category={selectedCategory}
        onBack={() => setView('catalog')}
        onSelect={handleAlgorithmSelect}
      />
    )
  }

  if (view === 'bubble-sort-visualizer') {
    return (
      <BubbleSortPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'selection-sort-visualizer') {
    return (
      <SelectionSortPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'insertion-sort-visualizer') {
    return (
      <InsertionSortPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'quick-sort-visualizer') {
    return (
      <QuickSortPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'merge-sort-visualizer') {
    return (
      <MergeSortPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'linear-search-visualizer') {
    return (
      <LinearSearchPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'binary-search-visualizer') {
    return (
      <BinarySearchPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'stack-visualizer') {
    return (
      <StackPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'queue-visualizer') {
    return (
      <QueuePage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'create-binary-tree-visualizer') {
    return (
      <CreateBinaryTreePage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  if (view === 'explore-binary-tree-types-visualizer') {
    return (
      <ExploreBinaryTreeTypesPage
        onBack={() => setView('algorithm-list')}
        onHome={() => setView('landing')}
        onCatalog={() => setView('catalog')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30">
      {/* Background Dots */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Navigation Header */}
      <header className="h-20 border-b border-white/10 backdrop-blur-md bg-[#050505]/80 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('algorithm-list')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block leading-none mb-1">{selectedCategory}</span>
            <h1 className="font-black text-xl tracking-tight text-white uppercase leading-none">{selectedAlgorithm.replace('-', ' ')}</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Engine Online</span>
          </div>
          <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <Settings2 className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col p-6 gap-6 relative z-10">
        {trace && (
          <Visualizer
            trace={trace}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App
