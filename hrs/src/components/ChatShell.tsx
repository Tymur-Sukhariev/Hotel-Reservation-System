"use client";
import { useState } from "react";
import OpenChatIcon from "./OpenChatIcon";
import Chat from "./Chat";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatShell() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <OpenChatIcon onClick={() => setOpen(true)} />
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1000,
                        }}
                    >
                        <Chat setOpen={setOpen} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}