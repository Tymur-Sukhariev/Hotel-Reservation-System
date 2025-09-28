'use client'

import styles from '../styles/chat.module.css'
import Image from "next/image"
import sendIcon from '../../public/images/send.svg'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Loader from './Loader'
import { motion } from "framer-motion";
import CloseBotIcon from './CloseBotIcon'
import toast from 'react-hot-toast'


type ChatMessage = { role: 'bot' | 'user'; msg: string }
const MAX_LENGTH = 100;

export default function Chat({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [message, setMessage] = useState<string>("");
    const msgLength = message.trim().length;
    const [chatContent, setChatContent] = useState<ChatMessage[]>([]);
    const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatContent]);

    function sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }

    const { mutate, isPending } = useMutation({
        mutationFn: getText,
        onSuccess: async (data) => {
            await sleep(1000); // for mock loading
            const newBotMsg: ChatMessage = { role: 'bot', msg: data.intent }
            setChatContent(prev => [...prev, newBotMsg]);
            setIsBotThinking(false);
        },
        onError: (error: Error) => {
            setChatContent(prev => prev.slice(0, -1));
            setIsBotThinking(false);
            toast(`⚠️ ${error.message}`, {
                style: { background: "#f59467ff", color: "#fff" },
            });
        },

    })

    async function getText(text: string) {
        const res = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "Network response was not ok");
        }
        return res.json();
    }

    function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;
        if (newValue.length >= MAX_LENGTH) {
            toast("⚠️ Max characters: 200!", {
                style: {
                    background: "#f59467ff",
                    color: "#fff",
                },
            });

            return;
        }
        setMessage(newValue);
    }

    async function handleSendText(e: React.FormEvent) {
        e.preventDefault();
        if (msgLength === 0 || msgLength > MAX_LENGTH) return;

        const newUserMsg: ChatMessage = { role: 'user', msg: message }
        setMessage("");
        setChatContent(prev => [...prev, newUserMsg]);
        setIsBotThinking(true);
        mutate(message);
    }

    const isMessageValid = msgLength > 0 && msgLength <= MAX_LENGTH;
    const opacity = isMessageValid ? 1 : 0.3;

    return (
        <form onSubmit={handleSendText} className={styles.container}>
            <div className={styles.chat}>
                {chatContent.length === 0
                    ?
                    <motion.h1
                        initial={{ y: -100, opacity: 0, translateX: "-53%", translateY: "-60%" }}
                        animate={{ y: 0, opacity: 1, translateX: "-53%", translateY: "-60%" }}
                        transition={{
                            delay: 0.4,
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                        }}
                    >
                        <span>Hello, Dear guest!</span> How can I assist you?
                    </motion.h1>

                    :
                    <div className={styles.messagesContainer}>
                        {chatContent && chatContent.map((message, index) => {
                            if (message.role === 'user') {
                                return <p key={index} className={`${styles.message} ${styles.userMessage}`}>{message.msg}</p>
                            }
                            if (message.role === 'bot') {
                                return <p key={index} className={`${styles.message} ${styles.botMessage}`}>{message.msg}</p>
                            }
                        })}
                        {(isPending || isBotThinking) && <Loader />}
                        <div ref={bottomRef} ></div>
                    </div>
                }
                <div className={styles.queryContainer}>
                    <div className={styles.inputContainer}>
                        <input onChange={(e) => handleTyping(e)} type="text" placeholder='Ask your question' value={message} />

                        <button className={styles.myButton}>
                            <Image style={{ opacity }} width={40} height={40} src={sendIcon} alt="sendIcon" />
                        </button>
                    </div>
                </div>
            </div>
            <CloseBotIcon onClick={() => setOpen(false)} />
        </form>
    )
}