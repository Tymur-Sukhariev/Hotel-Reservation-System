from fastapi import HTTPException
from app.schemas.intent import BotReply, BookingChatRequest, Handoff
from app.state.sessions import SESSIONS

def handle_booking_select(req: BookingChatRequest) -> BotReply:
    session_id = req.session_id
    text = req.text.strip().lower()

    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        idx = int(text) - 1  # user says "2" → index 1
    except ValueError:
        return BotReply(
            reply="Please choose an option number like '1' or '2'.",
            handoff=Handoff(route="/booking/select", session_id=session_id),
        )

    session["selected_index"] = idx
    SESSIONS[session_id] = session

    return BotReply(
        reply=f"Great — you selected option {idx + 1}. Shall I proceed to confirm?",
        handoff=Handoff(route="/booking/confirm", session_id=session_id),
    )
