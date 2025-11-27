from fastapi import HTTPException
from app.schemas.intent import BookingChatRequest, BotReply, Handoff
from app.state.sessions import SESSIONS
from app.services.cancellation_bootstrap import extract_booking_number


def handle_booking_cancel_chat(req: BookingChatRequest) -> BotReply:
    session_id = req.session_id
    cancel_info = req.text

    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(404, "Cancellation session not found")

    if session.get("intent") != "booking_cancel":
        raise HTTPException(400, "Not a booking cancellation session")

    cancel_booking_number = extract_booking_number(cancel_info)

    if not cancel_booking_number:
        return BotReply(
            reply="I couldn't understand that. Please provide your booking number?",
            handoff=Handoff(route="/booking-cancel/chat", session_id=session_id)
        )

    session["cancel_data"] = cancel_booking_number
    SESSIONS[session_id] = session
    
    return BotReply(
        reply=f"Got it — cancelling booking #{cancel_booking_number}...",
        handoff=Handoff(route="/booking-cancel/confirm", session_id=session_id),
        slots={"booking_number": cancel_booking_number},
    )
