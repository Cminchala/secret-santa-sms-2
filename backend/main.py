from fastapi import FastAPI
from fastapi import Request, Response
import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_extra_types.phone_numbers import PhoneNumber
import random 
import time

app = FastAPI()
load_dotenv()
api_key=os.getenv('apikey')



class SMSItems(BaseModel):
   name:str
   phoneNum : PhoneNumber
   wishlist : list


def send_sms(phone_number,message):
   res = requests.post('https://textbelt.com/text', {
  'phone': phone_number,
  'message': message,
  'key': api_key,
})
   print(res.json(),"And Status is: ",res.json().get('success'))

@app.get("/test")
async def test():
   return {"Message":"Hello world"}

@app.post("/SendMSG")
async def sendALL(request:Request):
   listOfPeople = []
   body = await request.json()
   for validate in body:
        try:
            person = SMSItems(**validate)
            listOfPeople.append(person)
        except Exception as e:
            return Response(content=f"Error: {e}", status_code=400)

   if len(listOfPeople) > 2:
      # Generate a valid derangement (no one assigned to themselves)
      names = [p.name for p in listOfPeople]
      assigned_names = names[:]
      while any(assigned_names[i] == names[i] for i in range(len(names))):
          random.shuffle(assigned_names)

      for i, person in enumerate(listOfPeople):
          assigned_name = assigned_names[i]
          send_sms(person.phoneNum, f"Hello {person.name}! You Have been assigned to gift {assigned_name} This is a test" ) # Put wishlist later
          print(f"SMS sent to {person.name} at {person.phoneNum}: You have been assigned to give a gift to {assigned_name}. $25 minimum.")
          time.sleep(2)  # Avoid rate limits
   return body