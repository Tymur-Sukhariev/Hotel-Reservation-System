from fastapi import APIRouter
from app.schemas.intent import BookingChatRequest, IntentRequest, BotReply
from app.services.intent_handler import handle_intent
from app.services.booking_chat import handle_booking_chat
from app.services.booking_confirm import handle_booking_confirmation
from app.services.booking_select import handle_booking_select
from app.services.booking_cancel import handle_booking_cancel_chat

router = APIRouter()

@router.post("/predict", response_model=BotReply)
def predict(req: IntentRequest) -> BotReply:
    return handle_intent(req.text)


@router.post("/booking/chat", response_model=BotReply)
def bookingChat(req: BookingChatRequest) -> BotReply:
    return handle_booking_chat(req)


@router.post("/booking/confirm", response_model=BotReply)
def bookingConfirmation(req: BookingChatRequest) -> BotReply:
    return handle_booking_confirmation(req)


@router.post("/booking/select", response_model=BotReply)
def booking_select(req: BookingChatRequest) -> BotReply:
    return handle_booking_select(req)

@router.post("/booking-cancel/chat", response_model=BotReply)
def booking_select(req: BookingChatRequest) -> BotReply:
    return handle_booking_cancel_chat(req)