'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, LogOut, ShoppingBag, ExternalLink } from 'lucide-react'
import { SmoothTabs } from '@/components/ui/smooth-tabs'

interface KudosCalculatorPanelProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'cost' | 'leaving' | 'buying-power'

export default function KudosCalculatorPanel({ isOpen, onClose }: KudosCalculatorPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cost')

  // Reset to first tab when panel closes to ensure clean state
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('cost')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="kudos-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
            style={{ pointerEvents: 'auto' }}
          />

          {/* Side Panel */}
          <motion.div
            key="kudos-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 35,
            }}
            className="fixed left-0 top-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-r border-[#88c540]/10 shadow-2xl z-[9999] overflow-hidden flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: `linear-gradient(#88c540 1px, transparent 1px), linear-gradient(90deg, #88c540 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />

            {/* Header */}
            <div className="relative bg-[#0a0a0a]/80 backdrop-blur-md p-6 border-b border-[#88c540]/10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#88c540]/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-[#88c540]" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Kudos Calculator</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs - Wrapped for dark mode */}
              <div className="dark">
                <SmoothTabs
                  tabs={[
                    { id: 'cost', label: 'Item Cost', icon: <Calculator className="w-4 h-4" /> },
                    { id: 'leaving', label: 'Leaving', icon: <LogOut className="w-4 h-4" /> },
                    { id: 'buying-power', label: 'Buying Power', icon: <ShoppingBag className="w-4 h-4" /> },
                  ]}
                  activeTab={activeTab}
                  onChange={(tab) => setActiveTab(tab as TabType)}
                />
              </div>
            </div>

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative flex-1 overflow-y-auto p-6"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'cost' && <CostCalculator key="cost" />}
                {activeTab === 'leaving' && <LeavingCalculator key="leaving" />}
                {activeTab === 'buying-power' && <BuyingPowerCalculator key="buying-power" />}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <div className="relative p-6 border-t border-[#88c540]/10 bg-[#0a0a0a]/80 backdrop-blur-md">
              <a
                href="https://docs.google.com/spreadsheets/d/1f5Pkpv4R1ez-eNQ9XqDTCZVGYm-SqT-m8CtxBBc2Zjw/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-[#88c540] to-[#9ed958] text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#88c540]/20 hover:shadow-[#88c540]/40 hover:scale-[1.02]"
              >
                <ExternalLink className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="tracking-tight">Open Official Spreadsheet</span>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


// Scenario 1: How much will an item cost?
function CostCalculator() {
  const [price, setPrice] = useState('')
  const [vatIncluded, setVatIncluded] = useState(true)
  const [isTeam, setIsTeam] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState(true)
  const [withTaxes, setWithTaxes] = useState(false)
  const [result, setResult] = useState<number | null>(null)

  // Auto-calculate when any value changes
  useEffect(() => {
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setResult(null)
      return
    }

    // Formula: Kudos = Price / VAT_factor / Team_factor * Tax_multiplier
    const vatFactor = vatIncluded ? 1.21 : 1
    const teamFactor = isTeam ? 1.5 : 1
    const taxMultiplier = (isWhitelisted && !withTaxes) ? 1 : 1.7303

    const kudos = (priceNum / vatFactor / teamFactor) * taxMultiplier
    setResult(Math.ceil(kudos))
  }, [price, vatIncluded, isTeam, isWhitelisted, withTaxes])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">How much will an item cost?</h3>
        <p className="text-xs text-gray-500 font-medium">Calculate Kudos needed for a specific price</p>
      </div>

      <div className="space-y-5">
        {/* Price Input */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Item Price (EUR)
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="245.00"
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#88c540]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#88c540]/50 transition-all group-hover:border-[#88c540]/30"
            />
          </div>
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            label="VAT included?"
            checked={vatIncluded}
            onChange={setVatIncluded}
          />
          <ToggleCard
            label="Team purchase?"
            checked={isTeam}
            onChange={setIsTeam}
          />
          <ToggleCard
            label="Whitelisted?"
            checked={isWhitelisted}
            onChange={setIsWhitelisted}
          />
          <ToggleCard
            label="With taxes?"
            checked={withTaxes}
            onChange={setWithTaxes}
          />
        </div>

        {/* Result */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-[#1a1a1a] border-2 border-[#88c540]/30 rounded-2xl p-6 text-center group"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#88c540]/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-7 h-7 text-[#88c540]" />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">You need approximately</p>
              <p className="text-5xl font-black bg-gradient-to-r from-[#88c540] to-[#9ed958] bg-clip-text text-transparent">
                {result} Kudos
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-lg text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                  {isTeam ? "Team Purchase" : "Personal Purchase"}
                </span>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#88c540]/5 blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#88c540]/5 blur-3xl -z-10" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Scenario 2: Leaving Visma - how much do I pay?
function LeavingCalculator() {
  const [originalKudos, setOriginalKudos] = useState('')
  const [isTeam, setIsTeam] = useState(false)
  const [paidTaxes, setPaidTaxes] = useState(false)
  const [purchaseDate, setPurchaseDate] = useState('')
  const [result, setResult] = useState<string | number | null>(null)

  // Auto-calculate when any value changes
  useEffect(() => {
    const kudosNum = parseFloat(originalKudos)
    if (isNaN(kudosNum) || kudosNum <= 0) {
      setResult(null)
      return
    }

    // Team purchase - cannot take
    if (isTeam) {
      setResult('Cannot take')
      return
    }

    // Paid all taxes - 0 EUR
    if (paidTaxes) {
      setResult(0)
      return
    }

    // Calculate depreciation
    if (!purchaseDate) {
      setResult(null)
      return
    }

    const purchase = new Date(purchaseDate)
    const now = new Date()
    const monthsElapsed = (now.getFullYear() - purchase.getFullYear()) * 12 + (now.getMonth() - purchase.getMonth())

    if (monthsElapsed >= 36) {
      setResult(1)
      return
    }

    const remainingKudos = kudosNum * (36 - monthsElapsed) / 36
    const payment = remainingKudos * 1.21
    setResult(Math.round(payment * 100) / 100)
  }, [originalKudos, isTeam, paidTaxes, purchaseDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Leaving Visma</h3>
        <p className="text-xs text-gray-500 font-medium">Calculate what you owe to keep an item</p>
      </div>

      <div className="space-y-5">
        {/* Original Kudos */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Original Value (Kudos)
          </label>
          <input
            type="number"
            value={originalKudos}
            onChange={(e) => setOriginalKudos(e.target.value)}
            placeholder="54"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#88c540]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#88c540]/50 transition-all"
          />
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            label="Team purchase?"
            checked={isTeam}
            onChange={setIsTeam}
          />
          <ToggleCard
            label="Paid all taxes?"
            checked={paidTaxes}
            onChange={setPaidTaxes}
          />
        </div>

        {/* Purchase Date */}
        {!isTeam && !paidTaxes && (
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
              Purchase Date
            </label>
            <input
              type="month"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#88c540]/10 rounded-xl text-white focus:outline-none focus:border-[#88c540]/50 transition-all [color-scheme:dark]"
            />
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl p-6 text-center border-2 group ${
              result === 'Cannot take'
                ? 'bg-red-500/5 border-red-500/30'
                : 'bg-[#1a1a1a] border-[#88c540]/30'
            }`}
          >
            {result === 'Cannot take' ? (
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 mb-4">
                  <X className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-2xl font-black text-red-500">Cannot Take Item</p>
                <p className="text-xs text-gray-500 mt-2 font-medium uppercase tracking-wider">Team purchases must remain with Visma</p>
              </div>
            ) : (
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#88c540]/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <LogOut className="w-7 h-7 text-[#88c540]" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Buyout amount</p>
                <p className="text-5xl font-black bg-gradient-to-r from-[#88c540] to-[#9ed958] bg-clip-text text-transparent">
                  {result} EUR
                </p>
                <div className="mt-4 inline-block px-3 py-1 bg-white/5 rounded-lg text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                  {result === 0 ? 'Fully Paid' : result === 1 ? 'Depreciated' : '3-Year Rule'}
                </div>
              </div>
            )}
            
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -z-10 ${result === 'Cannot take' ? 'bg-red-500/5' : 'bg-[#88c540]/5'}`} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Scenario 3: What can my Kudos buy?
function BuyingPowerCalculator() {
  const [kudos, setKudos] = useState('')
  const [isTeam, setIsTeam] = useState(false)
  const [withTaxes, setWithTaxes] = useState(false)
  const [result, setResult] = useState<{ exclVAT: number; inclVAT: number } | null>(null)

  // Auto-calculate when any value changes
  useEffect(() => {
    const kudosNum = parseFloat(kudos)
    if (isNaN(kudosNum) || kudosNum <= 0) {
      setResult(null)
      return
    }

    // Multiplier table
    const multipliers = {
      personalNoTax: 1.000,
      teamNoTax: 1.500,
      personalWithTax: 0.578,
      teamWithTax: 0.867,
    }

    let multiplier = multipliers.personalNoTax
    if (isTeam && !withTaxes) multiplier = multipliers.teamNoTax
    else if (!isTeam && withTaxes) multiplier = multipliers.personalWithTax
    else if (isTeam && withTaxes) multiplier = multipliers.teamWithTax

    const maxPriceExclVAT = kudosNum * multiplier
    const maxPriceInclVAT = maxPriceExclVAT * 1.21

    setResult({
      exclVAT: Math.round(maxPriceExclVAT * 100) / 100,
      inclVAT: Math.round(maxPriceInclVAT * 100) / 100,
    })
  }, [kudos, isTeam, withTaxes])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-1 tracking-tight">What can my Kudos buy?</h3>
        <p className="text-xs text-gray-500 font-medium">Calculate maximum affordable price</p>
      </div>

      <div className="space-y-5">
        {/* Kudos Input */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Available Kudos
          </label>
          <input
            type="number"
            value={kudos}
            onChange={(e) => setKudos(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#88c540]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#88c540]/50 transition-all"
          />
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ToggleCard
            label="Team purchase?"
            checked={isTeam}
            onChange={setIsTeam}
          />
          <ToggleCard
            label="With taxes?"
            checked={withTaxes}
            onChange={setWithTaxes}
          />
        </div>

        {/* Result */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-[#1a1a1a] border-2 border-[#88c540]/30 rounded-2xl p-6 group"
          >
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#88c540]/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-7 h-7 text-[#88c540]" />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Estimated Buying Power</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 transition-colors group-hover:border-[#88c540]/20">
                  <p className="text-[10px] text-gray-500 mb-1 font-black uppercase tracking-widest">Excl. VAT</p>
                  <p className="text-2xl font-black text-white">
                    {result.exclVAT}€
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 transition-colors group-hover:border-[#88c540]/20">
                  <p className="text-[10px] text-gray-500 mb-1 font-black uppercase tracking-widest">Incl. VAT</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-[#88c540] to-[#9ed958] bg-clip-text text-transparent">
                    {result.inclVAT}€
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-lg text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                  {isTeam ? "Team" : "Personal"}
                </span>
                <span className="px-3 py-1 bg-white/5 rounded-lg text-gray-400 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                  {withTaxes ? "Tax Applied" : "No Tax"}
                </span>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#88c540]/5 blur-3xl -z-10" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Reusable Toggle Card Component
function ToggleCard({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`p-4 rounded-xl border transition-all text-left group/toggle ${
        checked
          ? 'bg-[#88c540]/10 border-[#88c540]/50'
          : 'bg-[#1a1a1a] border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${checked ? 'text-[#88c540]' : 'text-gray-500'}`}>
          {label}
        </span>
        <div
          className={`relative w-8 h-4 rounded-full transition-colors ${
            checked ? 'bg-[#88c540]' : 'bg-white/10'
          }`}
        >
          <div
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
              checked ? 'translate-x-[18px]' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>
      <div>
        <span className={`text-sm font-bold ${checked ? 'text-white' : 'text-gray-600'}`}>
          {checked ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </button>
  )
}
