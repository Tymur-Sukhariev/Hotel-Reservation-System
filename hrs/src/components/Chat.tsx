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
import { cancelBooking, getSession, handleBooking, logoutUser, roomSearchAction } from '~/server/action'
import RoomGrid from './RoomGridInChat'
import { calculateTotalGuests } from '~/app/search-results/page'
import { getPrice } from '~/utils/getPrice'


type Slots = {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    childrenAges?: number[];
    booking_number?: number;
};

type Handoff = {
    route: "/predict" | "/booking/chat" | "/booking-cancel/chat"
    | "/booking/confirm" | "/booking/select" | "/booking-cancel/chat" | "/booking-cancel/confirm";
    session_id: string;
} | null;

type BotReply = {
    reply: string;
    handoff: Handoff;
    slots?: Slots | null;
    selected_index?: number | null;
};

export type RoomOption = {
    typeId: number;
    type: string;
    comfort: string;
    facilities: {
        tv: boolean;
        ac: boolean;
        bath: boolean;
    };
    img: string;
    prevText: string;
    price: number;
};


type ChatMessage =
    | { role: 'user'; msg: string }
    | { role: 'bot'; msg: string }
    | { role: 'rooms'; rooms: RoomOption[] };

const MAX_LENGTH = 100;

export default function Chat({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [message, setMessage] = useState<string>("");
    const [chatContent, setChatContent] = useState<ChatMessage[]>([]);
    const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
    const [handoff, setHandoff] = useState<Handoff>(null);



    const msgLength = message.trim().length;
    const bottomRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        // const last = chatContent[chatContent.length - 1];
        // console.log(last);
        // if (hasRooms) return

        // const hasRooms = chatContent.some(msg => msg.role === "rooms");

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chatContent]);


    function sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }

    const { mutate, isPending } = useMutation({
        mutationFn: getBotReply,
        onSuccess: async (data: BotReply) => {
            await sleep(1000);

            if (data.handoff) setHandoff(data.handoff);
            console.log("DATA::::::", data);


            if (data.selected_index !== undefined && data.selected_index !== null) {
                setChatContent(prev => [
                    ...prev,
                    { role: "bot", msg: data.reply }
                ]);

                await sleep(1000);


                const roomsMsg = chatContent.find(msg => msg.role === "rooms");
                if (!roomsMsg) {
                    console.error("No rooms found in chatContent when booking was requested.");
                    return;
                }

                const chosenRoom = roomsMsg.rooms[data.selected_index];
                if (!chosenRoom) {
                    console.error("Invalid selected_index:", data.selected_index);
                    return;
                }
                console.log("ROOM:", chosenRoom);

                const { checkIn, checkOut } = data.slots!;
                console.log("Booking fields", checkIn, checkOut, chosenRoom.facilities);
                console.log("booking...");


                const session = await getSession();
                if (!session) await logoutUser();
                const roomFacilities = chosenRoom.facilities;

                await handleBooking({
                    userId: session!.userId,
                    typeId: chosenRoom.typeId,
                    facilities: {
                        isAC: roomFacilities.ac,
                        isTV: roomFacilities.tv,
                        isBath: roomFacilities.bath
                    },
                    checkIn,
                    checkOut,
                    totalPrice: chosenRoom.price
                });


                setChatContent(prev => [...prev, {
                    role: "bot",
                    msg: "Your booking has been confirmed! 🎉  Confirmation sent to your email"
                }]);

                setIsBotThinking(false);
                return;
            }

            const newBotMsg: ChatMessage = { role: "bot", msg: data.reply };
            let roomMessage: ChatMessage | null = null;

            if (data.slots && data.handoff?.route === "/booking/select") {
                console.log("SEARCH FOR ROOM!", data.handoff);

                const { checkIn, checkOut, adults, children, childrenAges } = data.slots;
                const totalGuests = calculateTotalGuests(adults, childrenAges ?? []);
                const options = await roomSearchAction(checkIn, checkOut, totalGuests);

                const priced = options.map(room => ({
                    ...room,
                    price: getPrice(checkIn, checkOut, room.price, children)
                }));

                roomMessage = { role: "rooms", rooms: priced };
            }

            if (data.slots?.booking_number && data.handoff?.route === '/booking-cancel/confirm') {
                setChatContent(prev => [
                    ...prev,
                    { role: "bot", msg: data.reply }
                ]);

                await sleep(1000);
                await cancelBooking(data.slots.booking_number);

                setChatContent(prev => [...prev, {
                    role: "bot",
                    msg: "Your booking has been canceled!"
                }]);

                setHandoff(null);
                setIsBotThinking(false);
                return;

            }

            setChatContent(prev => {
                const updated = [...prev, newBotMsg];
                if (roomMessage) updated.push(roomMessage);
                return updated;
            });

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

    async function getBotReply(text: string) {
        let url: string;
        let body: any;

        if (!handoff || handoff.route === "/predict") {
            url = "/predict";
            body = { text };
        } else {
            url = `${handoff.route}`;
            body = {
                session_id: handoff.session_id,
                text,
            };
        }

        const res = await fetch(`http://localhost:8000${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
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
                        {chatContent.map((message, index) => {
                            if (message.role === 'user') {
                                return <p key={index} className={`${styles.message} ${styles.userMessage}`}>{message.msg}</p>
                            }

                            if (message.role === 'bot') {
                                return <p key={index} className={`${styles.message} ${styles.botMessage}`}>{message.msg}</p>
                            }

                            if (message.role === 'rooms') {
                                return <RoomGrid key={index} roomOptions={message.rooms} />
                            }
                        })}
                        <div ref={bottomRef}></div>

                        {(isPending || isBotThinking) && <Loader />}
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