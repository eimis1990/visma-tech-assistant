"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'agent-id': string;
        },
        HTMLElement
      >;
    }
  }
}

interface ElevenLabsWidgetProps {
  agentId: string;
}

export default function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // CRITICAL: Listen for elevenlabs-convai:call event to register client tools
    // This is the correct approach used by ElevenLabs - NOT window.clientTools
    const handleConvAICall = (event: any) => {
      console.log('🎯 elevenlabs-convai:call event received!', event.detail);

      if (event.detail && event.detail.config) {
        // Register client tools on the event's config object
        event.detail.config.clientTools = {
          open_document: async (params: { document_title: string; document_url: string }) => {
            console.log("📄 open_document tool called by agent!", params);

            // Dispatch event to our hook to open the drawer
            window.dispatchEvent(
              new CustomEvent("elevenlabs:client_tool_call", {
                detail: {
                  tool_name: "open_document",
                  parameters: params,
                  call_id: `call_${Date.now()}`
                }
              })
            );

            // Return formatted response to the agent
            // Keep response short and neutral - don't imply the modal stays open
            const response = `Document "${params.document_title}" opened successfully.`;
            console.log("📤 Returning to agent:", response);
            return response;
          },

          open_absence_panel: async () => {
            console.log("🏖️ open_absence_panel tool called by agent!");

            // Get current date information
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            // Calculate next Monday
            const nextMonday = new Date(now);
            const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
            nextMonday.setDate(now.getDate() + daysUntilMonday);
            
            const nextMondayStr = nextMonday.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });

            // Dispatch event to our hook to open the absence panel
            window.dispatchEvent(
              new CustomEvent("elevenlabs:client_tool_call", {
                detail: {
                  tool_name: "open_absence_panel",
                  parameters: {},
                  call_id: `call_${Date.now()}`
                }
              })
            );

            // Return current date context to the agent
            const response = `Panel opened. Today is ${dateStr}. Next Monday is ${nextMondayStr}.`;
            console.log("📤 Returning to agent:", response);
            return response;
          },

          fill_absence_request: async (params: { absence_type: string; start_date: string; end_date: string }) => {
            console.log("📝 fill_absence_request tool called by agent!", params);

            // Dispatch event to our hook to fill the absence form
            window.dispatchEvent(
              new CustomEvent("elevenlabs:client_tool_call", {
                detail: {
                  tool_name: "fill_absence_request",
                  parameters: params,
                  call_id: `call_${Date.now()}`
                }
              })
            );

            const response = `Absence request filled: ${params.absence_type} from ${params.start_date} to ${params.end_date}. Please review and press Send.`;
            console.log("📤 Returning to agent:", response);
            return response;
          }
        };

        console.log('✅ Client tools registered:', Object.keys(event.detail.config.clientTools));
      }
    };

    // Listen for ElevenLabs widget events
    const handleElevenLabsEvent = (event: any) => {
      console.log('ElevenLabs widget event:', event.type, event.detail);
    };

    // Register event listeners
    window.addEventListener('elevenlabs-convai:call', handleConvAICall);
    window.addEventListener('elevenlabs-widget-connected', handleElevenLabsEvent);
    window.addEventListener('elevenlabs-widget-disconnected', handleElevenLabsEvent);
    window.addEventListener('elevenlabs-widget-error', handleElevenLabsEvent);

    console.log('✅ ElevenLabs event listeners registered');

    // Cleanup
    return () => {
      window.removeEventListener('elevenlabs-convai:call', handleConvAICall);
      window.removeEventListener('elevenlabs-widget-connected', handleElevenLabsEvent);
      window.removeEventListener('elevenlabs-widget-disconnected', handleElevenLabsEvent);
      window.removeEventListener('elevenlabs-widget-error', handleElevenLabsEvent);
    };
  }, []);

  return (
    <>
      {/* ElevenLabs ConvAI Widget Script */}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ ElevenLabs widget script loaded');
        }}
        onError={(e) => {
          console.error('❌ Failed to load ElevenLabs widget script:', e);
        }}
      />

      {/* ElevenLabs ConvAI Widget - Ensure it's above all modals */}
      <elevenlabs-convai
        ref={widgetRef as any}
        agent-id={agentId}
        style={{ zIndex: 999999 } as any}
      />
    </>
  );
}
