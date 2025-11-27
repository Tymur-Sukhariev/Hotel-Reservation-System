from fastapi import HTTPException
from app.schemas.intent import BotReply, Handoff, BookingChatRequest
from app.state.sessions import SESSIONS
from scripts.booking_sequential import summarize_slots

# SESSIONS['1111'] = {
#         "intent": "booking",
#         "slots": {
#             "checkIn": "2025-12-20",
#             "checkOut": "2025-12-23",
#             "adults": 2,
#             "children": 0
#         }
# }

def handle_booking_confirmation(req: BookingChatRequest) -> BotReply:
    session_id = req.session_id
    text = req.text.lower().strip()

    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    if text not in {"yes", "confirm", "ok", "sure", "go ahead"}:
        return BotReply(
            reply="Okay, no problem. Which option would you like to choose?",
            handoff=Handoff(route="/booking/select", session_id=session_id)
        )

    selected = session.get("selected_index")
    slots = session.get("slots")

    return BotReply(
        reply="Perfect — finalizing your booking...",
        handoff=Handoff(route="/predict", session_id="none"),
        slots=slots,
        selected_index=selected
    )

# req = BookingChatRequest(
#     session_id="1111",
#     text="yes"
# )
# print(handle_booking_confirmation(req))