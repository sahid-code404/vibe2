"""Upload routes."""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.config import settings

router = APIRouter()


@router.post("/image")
async def upload_image(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
        try:
            import cloudinary
            import cloudinary.uploader
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
            )
            contents = await file.read()
            result = cloudinary.uploader.upload(
                contents, folder="culinary_compass",
                resource_type="image", quality="auto",
            )
            return {"url": result["secure_url"], "public_id": result["public_id"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # Fallback: return placeholder
    return {
        "url": f"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        "public_id": "demo_upload",
        "note": "Cloudinary not configured — using placeholder",
    }
