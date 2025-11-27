from pydantic import BaseModel
from typing import Any, Dict, Optional, Literal

class IntentRequest(BaseModel):
    text: str

class Handoff(BaseModel):
    route: Literal[
        "/booking/select",
        "/booking/chat",
        "/booking-cancel/chat",
        "/booking/confirm",
        "/predict", 
        "/booking-cancel/confirm"         
    ]
    session_id: str

class BotReply(BaseModel):
    reply: str
    handoff: Optional[Handoff] = None
    slots: Optional[Dict[str, Any]] = None
    selected_index: Optional[int] = None
    booking_number: Optional[int] = None

class BookingChatRequest(BaseModel):
    session_id: str
    text: str
    
