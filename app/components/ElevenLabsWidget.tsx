"use client";

import { useEffect, useRef } from "react";

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'agent-id': string
        },
        HTMLElement
      >
    }
  }

  interface Window {
    elevenLabsClientTools?: any[];
  }
}

interface ElevenLabsWidgetProps {
  agentId: string;
}

export default function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const setupWidget = () => {
      const widget = widgetRef.current;
      if (!widget) {
        setTimeout(setupWidget, 50);
        return;
      }

      console.log("🔧 Setting up widget with client tools");

      // Listen for ALL events on the widget to see what's being dispatched
      const eventLogger = (e: Event) => {
        if (e.type.includes('tool') || e.type.includes('client')) {
          console.log(`📡 Widget event: ${e.type}`, e);
        }
      };

      // Add listener for all events
      ['tool-call', 'client-tool', 'client-tool-call', 'tool-request', 'client-tool-request'].forEach(eventName => {
        widget.addEventListener(eventName, eventLogger as EventListener);
      });

      // Define client tool handler
      const handleClientToolCall = (event: any) => {
        console.log("🔧 Client tool event received:", event.detail);

        const { name, parameters, callId } = event.detail || {};

        if (name === "open_document") {
          console.log("✅ Handling open_document tool call");

          // Dispatch event to our hook
          window.dispatchEvent(
            new CustomEvent("elevenlabs:client_tool_call", {
              detail: {
                tool_name: "open_document",
                parameters: parameters,
                call_id: callId || `call_${Date.now()}`
              }
            })
          );

          // Send response back to widget
          if (callId) {
            widget.dispatchEvent(
              new CustomEvent("client-tool-response", {
                detail: {
                  callId: callId,
                  success: true,
                  result: `Opened document: ${parameters?.document_title}`
                }
              })
            );
          }
        }
      };

      // Register the tool with the widget
      const toolConfig = {
        name: "open_document",
        description: "Opens a company document for the user in a modal popup",
        parameters: {
          type: "object",
          properties: {
            document_title: {
              type: "string",
              description: "The title of the document to display"
            },
            document_url: {
              type: "string",
              description: "The URL of the document to open"
            }
          },
          required: ["document_title", "document_url"]
        },
        handler: async (params: any) => {
          console.log("🔧 Tool handler called directly:", params);

          window.dispatchEvent(
            new CustomEvent("elevenlabs:client_tool_call", {
              detail: {
                tool_name: "open_document",
                parameters: params,
                call_id: `call_${Date.now()}`
              }
            })
          );

          return { success: true, message: `Opening document: ${params.document_title}` };
        }
      };

      // Try all possible registration methods
      (widget as any).clientTools = [toolConfig];
      (widget as any)._clientTools = [toolConfig];

      // Listen for the widget's custom events
      widget.addEventListener('client-tool-call', handleClientToolCall as EventListener);
      widget.addEventListener('clientToolCall', handleClientToolCall as EventListener);

      console.log("✅ Widget setup complete", {
        clientTools: (widget as any).clientTools,
        hasClientTools: !!(widget as any).clientTools
      });
    };

    setupWidget();
  }, []);

  return (
    <elevenlabs-convai
      ref={widgetRef as any}
      agent-id={agentId}
    />
  );
}
