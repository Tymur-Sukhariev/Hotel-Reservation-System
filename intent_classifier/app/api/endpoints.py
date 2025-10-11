from fastapi import APIRouter
from app.schemas.intent import IntentRequest, IntentResponse
from scripts.estimator import get_intent

router = APIRouter()

# FastAPI endpoint that receives a user query and returns the predicted intent.
@router.post("/predict", response_model=IntentResponse)
def predict(req: IntentRequest):
    intent = get_intent(req.text)
    
    return IntentResponse(
        intent=intent
    )
