"use client";

/**
 * Document Drawer Component
 * Displays company documents in a beautiful modal
 */

import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    description = "Click below to open this document in a new tab.",
}: DocumentDrawerProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <motion.div
                initial="hidden"
                animate="visible"
                className="p-8 flex flex-col items-center text-center"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-8 w-full">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="relative w-14 h-14">
                            <Image
                                src="/card icons/documents-icon.png"
                                alt="Document"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight" style={{ fontFamily: "var(--font-helvetica-now), var(--font-outfit), sans-serif" }}>
                        {title}
                    </h2>
                    
                    <p className="text-gray-500 text-base max-w-[280px]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        {description}
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full">
                    <Link
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="group relative w-full flex items-center justify-center h-12 rounded-xl bg-black hover:bg-gray-800 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                    >
                        <span className="relative flex items-center gap-2.5">
                            Open Document
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </Link>
                </motion.div>
            </motion.div>
        </Modal>
    );
}
