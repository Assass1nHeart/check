from fastapi import UploadFile,APIRouter
import json
import shutil
app = APIRouter()
from NowUser import userinfo 


@app.post("/login")
def check_user(data: dict):
    userInfo:list=None
    with open("data/userlog.json", "r",encoding="UTF-8") as f:
        userInfo = json.load(f)
    for user in userInfo :
        if user["username"]==data["username"] :
            if user["password"]==data["password"]:
                userinfo["id"]=user["id"]
                userinfo["username"]=user["username"]
                userinfo["password"]=user["password"]

                return {
                    "status":"success",
                    "id":user["id"],

                }
            else:
                return {
                    "status":"password error",
                    "id":""
                }
            
    return {
        "status":"username error",
        "id":""
    }

@app.post("/register")
def register_user(data: dict):
    userList:list=None
    with open("data/userlog.json", "r",encoding="UTF-8") as f:
        userList = json.load(f)
    for user in userList:
        if user["username"]==data["username"]:
            return {
                "status":"username error"
            }
    newUser={
        "id":len(userList)+1,
        "username":data["username"],
        "password":data["password"]
    }
    userList.append(newUser)
    with open("data/userlog.json", "w",encoding="UTF-8") as f:
        json.dump(userList, f)
    return {
        "status":"success"
    }