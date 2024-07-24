from fastapi import UploadFile,APIRouter
import json
import shutil
from NowUser import userinfo,issueInfo
app = APIRouter()


@app.get("/get")
def get_taskboard():
    print("begin get taskboard")
    data=None
    while True:
        try:
            with open(f"data/data_{userinfo['id']}.json", "r",encoding="UTF-8") as f:
                data = json.load(f)
                break
        except FileNotFoundError:
            shutil.copyfile("data/data_default.json", f"data/data_{userinfo['id']}.json")
    
    return data

@app.post("/save")
def save_taskboard(data: dict):
    data=data["data"]
    with open(f"data/data_{userinfo['id']}.json", "w",encoding="UTF-8") as f:
        json.dump(data, f)
    
    return "success"

@app.get("/getinfo")
def get_userinfo():
    return userinfo

@app.post("/upload")
def upload_file(file: UploadFile = None):
    print(userinfo)
    if file is None:
        return {
            "status":"error"
        }
    with open(f"upload/{file.filename}", "wb") as f:
        f.write(file.file.read())
    return


@app.post("/update")
def update_issueInfo(data: dict):
    print(data)
    columnId=data["columnId"]
    issueId=data["issueId"]
    issueInfo["columnId"]=columnId
    issueInfo["issueId"]=issueId
    return 