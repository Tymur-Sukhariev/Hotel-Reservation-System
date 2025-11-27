from fastapi import HTTPException

from app.schemas.intent import BotReply, Handoff, BookingChatRequest
from app.state.sessions import SESSIONS
from scripts.booking_sequential import (
    parse_answer_for,
    compute_missing,
    pick_next,
    normalize,
    QUESTION,
    summarize_slots
)

#----------------------------------------------------------
# SESSIONS['1111'] = {
#         "intent": "booking",
#         "slots": {},
#         "pending": 'checkIn',
#         "missing": ["checkIn", "checkOut", "adults", "children"],
# }
#----------------------------------------------------------

def handle_booking_chat(req: BookingChatRequest) -> BotReply:
    session_id = req.session_id
    text = req.text

    session = SESSIONS.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Booking session not found")

    if session.get("intent") != "booking":
        raise HTTPException(status_code=400, detail="Session is not a booking session")

    slots = session.get("slots", {}) or {}
    pending = session.get("pending")

    # 1) Parse answer based on pending slot
    parsed = parse_answer_for(pending, text)

    if not parsed:
        # Nothing confidently parsed → ask the same question again
        fallback_q = QUESTION.get(
            pending,
            "Sorry, I didn't quite get that. Could you rephrase?"
        )
        
        return BotReply(
            reply=f"I couldn't extract that information. {fallback_q}",
            handoff=None,
        )


    # 2) Update slots and normalize
    slots.update(parsed)
    slots = normalize(slots)

    # 3) Recompute missing and next pending
    missing = compute_missing(slots)
    next_slot = pick_next(missing)

    session["slots"] = slots
    session["missing"] = missing
    session["pending"] = next_slot
    SESSIONS[session_id] = session
    
    print(next_slot)
    print(missing)

    # 4) Decide next reply
    if next_slot:
        # Still missing something → ask next slot
        question = QUESTION[next_slot]
        return BotReply(
            reply=f"Got it. {question}",
            handoff=None,
        )

    handoff = Handoff(route="/booking/select", session_id=session_id)

    return BotReply(
        reply="Here are some room options based on your request. Please choose an option number like '1' or '2'.",
        handoff=handoff,
        slots=slots
    )

    
# req = BookingChatRequest(
#     session_id="1111",
#     text="2004-11-15"
# )
# user_message = BookingChatRequest(
#     session_id=req.session_id,
#     text=req.text
# )

# print(handle_booking_chat(user_message))
