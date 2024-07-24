from fastapi import UploadFile,APIRouter
from fastapi.responses import FileResponse
from NowUser import userinfo,issueInfo
app = APIRouter()


@app.get("/{file_name}")
def downLoad(file_name:str):
    print("downLoad")
    return FileResponse(path=f"upload/{file_name}",filename=file_name)