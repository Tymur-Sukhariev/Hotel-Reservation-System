from fastapi import HTTPException
from typing import Dict, Any
import uuid

from app.schemas.intent import BotReply, Handoff
from app.state.sessions import SESSIONS
from app.core.config import CONF_THRESHOLD, MAX_MSG
from app.core.intent_responses import intent_info
from app.services.cancellation_bootstrap import extract_booking_number
from app.rag.answerer import generate_answer
from scripts.booking_sequential import QUESTION
from scripts.estimator import classify_intent
from app.services.booking_bootstrap import start_booking_session


RAG_INTENTS = [
    "amenities_info",
    "parking_info",
    "checkin_checkout_time",
    "location_directions",
    "pets_policy",
    "cancellation_policy",
    "restaurant_info",
    "room_rates"
]


def handle_intent(text: str) -> BotReply:
    clean_msg = len(text.strip())
    
    if clean_msg == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if clean_msg > MAX_MSG:
        raise HTTPException(status_code=400, detail=f"Max characters: {MAX_MSG}")

    label, conf = classify_intent(text)
    
    if conf < CONF_THRESHOLD:
        return BotReply(reply=intent_info["fallback"], handoff=None)
    
    if label in ["greeting", "goodbye"]:
        return BotReply(reply=intent_info[label], handoff=None)

    if label == "booking":
        session_id, slots, pending = start_booking_session(text)

        if pending is None:
            return BotReply(
                reply="Here are some room options based on your request. Please choose an option number like '1' or '2'.",
                handoff=Handoff(route="/booking/select", session_id=session_id),
                slots=slots
            )


        first_q = "I will help with your booking. " + QUESTION[pending]
        return BotReply(
            reply=first_q,
            handoff=Handoff(route="/booking/chat", session_id=session_id)
        )

    if label == "booking_cancel":
        session_id = str(uuid.uuid4())
        text = text
    
        cancel_booking_number = extract_booking_number(text)
    
        if cancel_booking_number is not None:
            SESSIONS[session_id] = {
                "intent": "booking_cancel",
                "booking_number": cancel_booking_number,
            }
    
            return BotReply(
                reply=f"Got it — cancelling booking #{cancel_booking_number}...",
                handoff=Handoff(route="/booking-cancel/confirm", session_id=session_id),
                slots={"booking_number": cancel_booking_number},
            )
    
        SESSIONS[session_id] = {"intent": "booking_cancel"}
    
        return BotReply(
            reply="Okay — I’ll help cancel your reservation. Please provide your booking number.",
            handoff=Handoff(route="/booking-cancel/chat", session_id=session_id),
        )
        
    if label in RAG_INTENTS:
        rag = generate_answer(text, label)
        return BotReply(
            reply=rag["answer"],
            citations=rag["citations"],
            handoff=None
        )


    return BotReply(reply=intent_info["fallback"], handoff=None)
    
    

