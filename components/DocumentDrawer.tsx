"use client";

/**
 * Document Drawer Component
 * Displays company documents in a beautiful modal
 */

import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";
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
    description = "Click below to open this document in a new tab.",
}: DocumentDrawerProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <motion.div
                initial="hidden"
                animate="visible"
                className="p-6 space-y-6"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <Link
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="group relative overflow-hidden flex items-center justify-center h-11 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold tracking-wide shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700"
                    >
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%]"
                            whileHover={{
                                x: ["-200%", "200%"],
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                repeat: 0,
                            }}
                        />
                        <span className="relative flex items-center gap-2">
                            Open Document
                            <motion.div
                                animate={{
                                    rotate: [0, 15, -15, 0],
                                    y: [0, -2, 2, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    ease: "easeInOut",
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 1,
                                }}
                            >
                                <ExternalLink className="w-4 h-4" />
                            </motion.div>
                        </span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="h-11 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm font-semibold transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </Modal>
    );
}
