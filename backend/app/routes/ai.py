"""AI assistant routes."""
from fastapi import APIRouter, Depends
from app.models.user import User
from app.auth.dependencies import get_optional_user
from app.schemas.entities import AIChatRequest, AIChatResponse
from app.services.ai_service import chat_with_ai

router = APIRouter()


@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(req: AIChatRequest, user=Depends(get_optional_user)):
    result = await chat_with_ai(req.message, req.context)
    return AIChatResponse(**result)
