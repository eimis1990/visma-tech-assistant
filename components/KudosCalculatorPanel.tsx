'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, LogOut, ShoppingBag } from 'lucide-react'
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
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
              damping: 30,
              duration: 0.3
            }}
            className="fixed left-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[9999] overflow-hidden flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FBBB00] to-[#fdd45f] p-5 pb-4 text-[#1a1a1a]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-black/10 rounded-xl backdrop-blur-sm">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Kudos Calculator</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-black/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                {activeTab === 'cost' && <CostCalculator key="cost" />}
                {activeTab === 'leaving' && <LeavingCalculator key="leaving" />}
                {activeTab === 'buying-power' && <BuyingPowerCalculator key="buying-power" />}
              </AnimatePresence>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">How much will an item cost?</h3>
        <p className="text-xs text-gray-600">Calculate Kudos needed for a specific price</p>
      </div>

      <div className="space-y-3">
        {/* Price Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Item Price (EUR)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="245.00"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FBBB00] focus:border-transparent"
          />
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#FBBB00] via-[#fdd45f] to-[#FBBB00] rounded-xl p-[2px]"
          >
            <div className="bg-white rounded-[10px] p-5 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FBBB00]/20 to-[#fdd45f]/20 mb-3">
                <Calculator className="w-6 h-6 text-[#FBBB00]" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">You need</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-[#FBBB00] to-[#fdd45f] bg-clip-text text-transparent">
                {result} Kudos
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {isTeam ? "Team" : "Personal"}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {withTaxes ? "With taxes" : "No taxes"}
                </span>
              </div>
            </div>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Leaving Visma</h3>
        <p className="text-xs text-gray-600">Calculate what you owe to keep an item</p>
      </div>

      <div className="space-y-3">
        {/* Original Kudos */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Original Value (Kudos)
          </label>
          <input
            type="number"
            value={originalKudos}
            onChange={(e) => setOriginalKudos(e.target.value)}
            placeholder="54"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FBBB00] focus:border-transparent"
          />
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
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
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Purchase Date
            </label>
            <input
              type="month"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FBBB00] focus:border-transparent"
            />
          </div>
        )}

        {/* Result */}
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-xl p-[2px] ${
              result === 'Cannot take'
                ? 'bg-gradient-to-br from-red-500 via-rose-500 to-red-500'
                : 'bg-gradient-to-br from-[#FBBB00] via-[#fdd45f] to-[#FBBB00]'
            }`}
          >
            <div className="bg-white rounded-[10px] p-5 text-center">
              {result === 'Cannot take' ? (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">Cannot Take Item</p>
                  <p className="text-xs text-gray-600 mt-2">Team purchases stay with team</p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FBBB00]/20 to-[#fdd45f]/20 mb-3">
                    <LogOut className="w-6 h-6 text-[#FBBB00]" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">You need to pay</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#FBBB00] to-[#fdd45f] bg-clip-text text-transparent">
                    {result} EUR
                  </p>
                  <div className="mt-3 inline-block px-3 py-1 bg-gray-100 rounded-md text-xs text-gray-700 font-medium">
                    {result === 0 ? 'Already yours!' : result === 1 ? 'Fully depreciated' : '36-month depreciation'}
                  </div>
                </>
              )}
            </div>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">What can my Kudos buy?</h3>
        <p className="text-xs text-gray-600">Calculate maximum affordable price</p>
      </div>

      <div className="space-y-3">
        {/* Kudos Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Available Kudos
          </label>
          <input
            type="number"
            value={kudos}
            onChange={(e) => setKudos(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FBBB00] focus:border-transparent"
          />
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#FBBB00] via-[#fdd45f] to-[#FBBB00] rounded-xl p-[2px]"
          >
            <div className="bg-white rounded-[10px] p-5">
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FBBB00]/20 to-[#fdd45f]/20">
                  <ShoppingBag className="w-6 h-6 text-[#FBBB00]" />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-3 text-center">You can buy items up to:</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Excl. VAT</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#FBBB00] to-[#fdd45f] bg-clip-text text-transparent">
                    {result.exclVAT} EUR
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Incl. VAT</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#FBBB00] to-[#fdd45f] bg-clip-text text-transparent">
                    {result.inclVAT} EUR
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {isTeam ? "Team" : "Personal"}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 font-medium">
                  {withTaxes ? "With taxes" : "No taxes"}
                </span>
              </div>
            </div>
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
      className={`p-3 rounded-xl border transition-all text-left hover:scale-[1.02] ${
        checked
          ? 'bg-[#FBBB00]/10 border-[#FBBB00] shadow-sm'
          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${checked ? 'text-[#1a1a1a]' : 'text-gray-700'}`}>
          {label}
        </span>
        <div
          className={`relative w-8 h-4 rounded-full transition-colors ${
            checked ? 'bg-[#FBBB00]' : 'bg-gray-300'
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
        <span className={`text-xs font-semibold ${checked ? 'text-[#1a1a1a]' : 'text-gray-500'}`}>
          {checked ? 'Yes' : 'No'}
        </span>
      </div>
    </button>
  )
}
