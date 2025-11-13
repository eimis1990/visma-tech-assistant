"use client";

import { useEffect, useRef } from "react";

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

  interface Window {
    clientTools?: Record<string, (params: any) => Promise<string>>;
  }
}

interface ElevenLabsWidgetProps {
  agentId: string;
}

export default function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Register client tools globally BEFORE the widget initializes
    // This is the key - the widget looks for window.clientTools on initialization
    console.log("🔧 Registering global client tools");

    window.clientTools = {
      open_document: async (params: { document_title: string; document_url: string }) => {
        console.log("🔧 open_document tool called by agent!", params);

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
        const response = `Successfully opened the document "${params.document_title}" for the user. The document is now displayed in a modal popup where they can read it.`;
        console.log("📤 Returning to agent:", response);
        return response;
      }
    };

    console.log("✅ Global client tools registered:", Object.keys(window.clientTools));
  }, []);

  return (
    <elevenlabs-convai
      ref={widgetRef as any}
      agent-id={agentId}
    />
  );
}
