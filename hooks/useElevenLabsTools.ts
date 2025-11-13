"use client";

import { useEffect, useState } from "react";

interface DocumentToolParams {
    document_title: string;
    document_url: string;
}

interface ClientToolCallEvent {
    tool_name: string;
    parameters: DocumentToolParams;
    call_id: string;
}

interface DocumentData {
    title: string;
    url: string;
}

export function useElevenLabsTools() {
    const [documentData, setDocumentData] = useState<DocumentData | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const handleToolCall = (event: Event) => {
            const customEvent = event as CustomEvent<ClientToolCallEvent>;
            const { tool_name, parameters } = customEvent.detail;

            console.log("✅ Tool call received:", { tool_name, parameters });

            if (tool_name === "open_document") {
                // Set document data and open drawer
                setDocumentData({
                    title: parameters.document_title,
                    url: parameters.document_url,
                });
                setIsDrawerOpen(true);

                console.log("✅ Document drawer opened with:", parameters.document_title);
            }
        };

        // Listen for client tool calls
        window.addEventListener("elevenlabs:client_tool_call", handleToolCall);
        console.log("✅ ElevenLabs tool listener registered");

        return () => {
            window.removeEventListener("elevenlabs:client_tool_call", handleToolCall);
            if (process.env.NODE_ENV === 'development') {
                console.log("🔄 ElevenLabs tool listener removed (cleanup)");
            }
        };
    }, []);

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        // Clear document data after animation completes
        setTimeout(() => setDocumentData(null), 300);
    };

    return {
        documentData,
        isDrawerOpen,
        closeDrawer,
    };
}
