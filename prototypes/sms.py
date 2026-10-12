import requests 
import os
from dotenv import load_dotenv

testPhone = "..."

load_dotenv()
api_key = os.getenv("apikey")

def send_sms(phone_number,message):
    res = requests.post('https://textbelt.com/text', {
  'phone': phone_number,
  'message': message,
  'key': api_key,
})
    print(res.headers)


if __name__ == '__main__':
   print(send_sms(testPhone,' test message from sms.py test'))
   