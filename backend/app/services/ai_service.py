"""AI service — OpenAI integration for travel assistant."""
from typing import Optional
from app.config import settings

SYSTEM_PROMPT = """You are Culinary Compass AI — an expert travel and food discovery assistant for India.
You help users discover authentic regional foods, plan travel itineraries with food, hotels, and attractions.
When generating itineraries, include day-by-day schedule, food recommendations, hotel suggestions, tourist attractions, budget, and cultural tips.
Format responses with headings, bullet points, and emojis. Be enthusiastic and knowledgeable."""


async def chat_with_ai(message: str, context: Optional[dict] = None) -> dict:
    """Send a message to AI and get a response."""
    if settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            if context and context.get("history"):
                for msg in context["history"][-6:]:
                    messages.append(msg)
            messages.append({"role": "user", "content": message})
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", messages=messages, max_tokens=1500, temperature=0.7,
            )
            reply = response.choices[0].message.content
            return {"reply": reply, "itinerary": None, "suggestions": _get_suggestions(message)}
        except Exception as e:
            print(f"OpenAI error: {e}")
    return _fallback(message)


def _get_suggestions(msg: str) -> list:
    lower = msg.lower()
    if "kolkata" in lower:
        return ["Best street food in Kolkata", "Budget hotels near Park Street", "Must-visit Kolkata places"]
    if "mumbai" in lower:
        return ["Mumbai street food trail", "Affordable stays in Mumbai", "Top Mumbai tourist spots"]
    if "delhi" in lower:
        return ["Old Delhi food walk", "Budget stays near CP", "Delhi heritage tour"]
    return ["Suggest a 2-day food trip", "Find budget hotels nearby", "Must-try local dishes"]


def _fallback(msg: str) -> dict:
    lower = msg.lower()
    if any(w in lower for w in ["itinerary", "plan", "trip", "day"]):
        reply = "# 🗺️ Suggested Travel Itinerary!\n\n## Day 1\n- **Morning**: Arrive, check in\n- **Breakfast**: Local street food market\n- **Lunch**: Traditional restaurant (₹200-400)\n- **Afternoon**: Cultural attractions, temples\n- **Dinner**: Regional specialties (₹500-800)\n\n## Day 2\n- **Morning**: Famous landmarks\n- **Lunch**: Hidden gem restaurant\n- **Afternoon**: Shopping, souvenirs\n- **Evening**: Sunset point, departure\n\n### 💰 Budget: ₹4,000-7,500 per person\n\n*Tell me your city for a personalized plan!*"
    elif any(w in lower for w in ["food", "eat", "dish", "cuisine"]):
        reply = "# 🍽️ Top Regional Dishes\n\n1. **Kolkata Biryani** — ₹150-300\n2. **Hyderabadi Dum Biryani** — ₹200-400\n3. **Mumbai Vada Pav** — ₹15-40\n4. **Delhi Butter Chicken** — ₹250-500\n5. **Chennai Masala Dosa** — ₹80-200\n\n💡 Look for crowded stalls — best food is there!\n\n*Tell me your city for personalized recommendations!*"
    elif any(w in lower for w in ["hotel", "stay", "accommodation"]):
        reply = "# 🏨 Hotel Guide\n\n| Type | Price |\n|------|-------|\n| Hostels | ₹500-1,000 |\n| Budget | ₹1,000-2,500 |\n| Mid-Range | ₹2,500-5,000 |\n| Premium | ₹5,000+ |\n\n💡 Book 2-3 weeks ahead for best rates!\n\n*Share your destination for specific picks!*"
    else:
        reply = "# 👋 I'm your Culinary Compass AI!\n\n🍽️ **Food Discovery** — Best regional dishes\n🏨 **Hotels** — Budget to luxury\n🗺️ **Itineraries** — AI trip planning\n🎭 **Culture** — Food history & traditions\n\nTry: *\"Plan a 2-day Kolkata food trip under ₹5000\"*"
    return {"reply": reply, "itinerary": None, "suggestions": _get_suggestions(msg)}
