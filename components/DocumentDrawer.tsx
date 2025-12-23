"use client";

/**
 * Document Drawer Component
 * Displays company documents in a beautiful modal
 */

import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface DocumentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    documentUrl: string;
    description?: string;
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        }
    },
};

export default function DocumentDrawer({
    isOpen,
    onClose,
    title,
    documentUrl,
    description = "Click open document button to open this document in a new tab.",
}: DocumentDrawerProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <motion.div
                initial="hidden"
                animate="visible"
                className="p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
                {/* Background Grid Effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: `linear-gradient(#88c540 1px, transparent 1px), linear-gradient(90deg, #88c540 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-8 w-full relative z-10">
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight tracking-tighter" style={{ fontFamily: "var(--font-helvetica-now), var(--font-outfit), sans-serif" }}>
                        {title}
                    </h2>
                    
                    <p className="text-gray-400 text-lg max-w-[340px] font-medium leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        {description}
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col gap-4 w-full relative z-10">
                    <Link
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="group relative w-full flex items-center justify-center py-6 rounded-2xl bg-gradient-to-r from-[#88c540] to-[#9ed958] text-black font-black text-xl shadow-lg shadow-[#88c540]/20 hover:shadow-[#88c540]/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                        <span className="relative flex items-center gap-3">
                            OPEN DOCUMENT
                            <ExternalLink className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                    </Link>
                    
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mt-2"
                    >
                        Maybe Later
                    </button>
                </motion.div>

                {/* Card Corner Decoration - similar to other cards */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.05] pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #88c540 1px, transparent 1px), linear-gradient(to bottom, #88c540 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                        maskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at bottom right, black, transparent 70%)'
                    }} />
                </div>
            </motion.div>
        </Modal>
    );
}
