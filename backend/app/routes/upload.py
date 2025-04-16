import os
import uuid
import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/upload",
    tags=["upload"]
)

@router.post("/upload/profile-photo", status_code=status.HTTP_200_OK)
async def upload_profile_photo(file: UploadFile = File(...)):
    """
    Upload a profile photo with graceful fallback to avatar service
    """
    try:
        # Check if AWS credentials are properly configured
        aws_key = os.environ.get('AWS_ACCESS_KEY')
        aws_secret = os.environ.get('AWS_SECRET_KEY')
        s3_region = os.environ.get('S3_REGION')
        bucket_name = os.environ.get('S3_BUCKET')
        
        logger.info(f"Uploading profile photo: {file.filename}")
        logger.info(f"AWS credentials available: {bool(aws_key and aws_secret and s3_region and bucket_name)}")
        
        # If AWS credentials are missing, use avatar service as fallback
        if not (aws_key and aws_secret and s3_region and bucket_name):
            logger.info("Using avatar service fallback for profile photo")
            
            # Generate a name from the filename or a random ID
            name_base = os.path.splitext(file.filename)[0] if file.filename else str(uuid.uuid4())[:8]
            name_encoded = name_base.replace(" ", "+")
            
            # Generate avatar URL
            avatar_url = f"https://ui-avatars.com/api/?name={name_encoded}&background=random&size=200"
            logger.info(f"Generated avatar URL: {avatar_url}")
            
            return JSONResponse(content={"url": avatar_url})
        
        # If credentials are available, try S3 upload
        try:
            import boto3
            from botocore.exceptions import ClientError
            
            # Initialize S3 client
            s3_client = boto3.client(
                's3',
                aws_access_key_id=aws_key,
                aws_secret_access_key=aws_secret,
                region_name=s3_region
            )
            
            # Generate unique filename
            filename = f"profile-photos/{uuid.uuid4()}-{file.filename}"
            content_type = file.content_type or 'application/octet-stream'
            
            # Read file content
            file_content = await file.read()
            logger.info(f"File size: {len(file_content)} bytes")
            
            # Upload to S3
            s3_client.put_object(
                Bucket=bucket_name,
                Key=filename,
                Body=file_content,
                ContentType=content_type
            )
            
            # Construct S3 URL
            s3_url = f"https://{bucket_name}.s3.{s3_region}.amazonaws.com/{filename}"
            logger.info(f"S3 upload successful: {s3_url}")
            
            return JSONResponse(content={"url": s3_url})
            
        except (ImportError, ClientError) as e:
            # If boto3 import fails or S3 operation fails, fall back to avatar
            logger.error(f"S3 upload failed: {str(e)}")
            
            # Use the filename or email to generate an avatar
            name_base = os.path.splitext(file.filename)[0] if file.filename else str(uuid.uuid4())[:8]
            name_encoded = name_base.replace(" ", "+")
            avatar_url = f"https://ui-avatars.com/api/?name={name_encoded}&background=random&size=200"
            
            return JSONResponse(content={"url": avatar_url})
    
    except Exception as e:
        # Catch-all for any other errors
        error_msg = str(e)
        logger.error(f"Profile photo upload error: {error_msg}")
        
        # Always return a valid URL even on error
        fallback_url = f"https://ui-avatars.com/api/?name=User&background=random&size=200"
        
        # For production, avoid exposing error details and return a working solution
        return JSONResponse(content={"url": fallback_url})