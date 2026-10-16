from fastapi import FastAPI
from fastapi import Request, Response
import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_extra_types.phone_numbers import PhoneNumber
import random 
import time
from fastapi.middleware.cors import CORSMiddleware
import stripe

app = FastAPI()
load_dotenv()
api_key=os.getenv('apikey')
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

origins = [
    "http://localhost:3000",
    "http://ec2-3-145-81-205.us-east-2.compute.amazonaws.com:3000",
    "http://ec2-3-145-81-205.us-east-2.compute.amazonaws.com"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckoutRequest(BaseModel):
    participants: list

class USPhone(PhoneNumber):
    default_region_code = 'US'
    supported_regions = ['US']
    phone_format = 'NATIONAL'

class SMSItems(BaseModel):
   name:str
   phoneNum : USPhone
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

@app.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    try:
        body = await request.json()
        participants = body.get("participants", [])
        if not participants or len(participants) < 3:
            return Response(content="At least 3 participants are required.", status_code=400)

        origin = request.headers.get("origin") or "http://localhost:3000"

        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Secret Santa Gift Exchange Drawing",
                            "description": f"Automated Secret Santa name drawing & notifications for {len(participants)} elves.",
                        },
                        "unit_amount": 100,  # $1.00 USD entry fee
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            allow_promotion_codes=True,
            success_url=f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{origin}/?canceled=true",
        )
        return {"url": checkout_session.url}
    except Exception as e:
        return Response(content=str(e), status_code=500)

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
          print("Assigned: ",assigned_names)

      for i, person in enumerate(listOfPeople):
          assigned_name = assigned_names[i]
          # send_sms(person.phoneNum, f"Hello {person.name}! You Have been assigned to gift {assigned_name} This is a test" ) # Put wishlist later
          print(f"SMS sent to {person.name} at {person.phoneNum}: You have been assigned to give a gift to {assigned_name}. $25 minimum.")
          # time.sleep(2)  # Avoid rate limits
    
      return {"Message": "Messages sent successfully!"}
   else:
        return {"Message": "Error: At least 3 people are required for Secret Santa."}