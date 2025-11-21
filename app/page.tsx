'use client'

import LandingHeader from './components/LandingHeader'
import HeroSection from './components/HeroSection'
import ElevenLabsWidget from './components/ElevenLabsWidget'
import DocumentDrawer from '@/components/DocumentDrawer'
import AbsenceRequestPanel from '@/components/AbsenceRequestPanel'
import { useElevenLabsTools } from '@/hooks/useElevenLabsTools'

export default function Home() {
  const { 
    documentData, 
    isDrawerOpen, 
    closeDrawer,
    absenceData,
    isAbsencePanelOpen,
    closeAbsencePanel,
    setIsAbsencePanelOpen
  } = useElevenLabsTools()

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-b from-white to-[#EFF2F5]">
      {/* Dashed Bottom Fade Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e7e5e4 1px, transparent 1px),
            linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
             repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
          `,
          WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Content */}
      <div className="flex flex-col h-screen relative z-10">
        <LandingHeader />

        <main className="flex-1 flex flex-col">
          <HeroSection onOpenAbsencePanel={() => setIsAbsencePanelOpen(true)} />
        </main>

        {/* ElevenLabs Widget - will appear in bottom right corner */}
        <ElevenLabsWidget agentId="agent_6701k9ma25k6e6ct0y27575m5s0w" />
      </div>

      {/* Document Drawer - appears when agent triggers open_document tool */}
      {documentData && (
        <DocumentDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          title={documentData.title}
          documentUrl={documentData.url}
        />
      )}

      {/* Absence Request Panel - appears when agent triggers or user clicks */}
      <AbsenceRequestPanel
        isOpen={isAbsencePanelOpen}
        onClose={closeAbsencePanel}
        prefilledRequest={absenceData}
      />
    </div>
  )
}
