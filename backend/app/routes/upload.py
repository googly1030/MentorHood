import os
import uuid
import boto3
import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from botocore.exceptions import ClientError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_KEY'),
    region_name=os.environ.get('S3_REGION')
)
bucket_name = os.environ.get('S3_BUCKET')

@router.post("/profile-photo", status_code=status.HTTP_200_OK)
async def upload_profile_photo(file: UploadFile = File(...)):
    """
    Upload a profile photo to S3 bucket
    """
    try:
        # Log environment variables for debugging
        logger.info(f"Uploading file to S3: {file.filename}")
        logger.info(f"Using bucket: {bucket_name}")
        logger.info(f"Region: {os.environ.get('S3_REGION')}")
        
        # Generate a unique filename
        filename = f"profile-photos/{uuid.uuid4()}-{file.filename}"
        print(f"Generated filename: {filename}")
        content_type = file.content_type or 'application/octet-stream'
        
        file_content = await file.read()
        
        # Log file details
        logger.info(f"File size: {len(file_content)} bytes")
        logger.info(f"Content type: {content_type}")
        
        # Upload the file to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=filename,
            Body=file_content,
            ContentType=content_type
        )
        
        # Construct the URL
        s3_url = f"https://{bucket_name}.s3.{os.environ.get('S3_REGION')}.amazonaws.com/{filename}"
        logger.info(f"File uploaded successfully. URL: {s3_url}")
        
        return JSONResponse(content={"url": s3_url})
    
    except ClientError as e:
        error_msg = str(e)
        logger.error(f"S3 ClientError: {error_msg}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file to S3: {error_msg}")
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Unexpected error during upload: {error_msg}")
        raise HTTPException(status_code=500, detail=f"An error occurred during upload: {error_msg}")