import random
import time
from sms import send_sms 
from pydantic import BaseModel, Field
from fastapi import FastAPI
import os
people = []
app = FastAPI()


def insert_person(phoneNum, name, wishlist):
    return people.append({
        "phone_number" : phoneNum,
        "name" : name,
        "wishlist" : wishlist
    })

def find_wishlist(name:str):
    for i in people:
        if i.get("name") == name:
            return i.get("wishlist")
        
def secret_santa():
    inputNum = "Y"
    while inputNum.upper() != "N":
        name = input("Insert Name : ")
        phone_num = input("Insert Phone Number: ")
        wishlist = input("What does the person wish for: ")
        insert_person(phone_num, name,wishlist)
        inputNum = input("Do you want to add another person? (Y/N): ")
        if inputNum.upper() == "N" and len(people) > 2:  # secret santa logic starts here
            people_nums = [i.get('name') for i in people]
            for t in people:
                assigned_num = random.choice(people_nums) # Check to make sure no one is assigned to themselves
                if assigned_num == t.get('name'):
                    while assigned_num == t.get('name'):
                        assigned_num = random.choice(people_nums)
                send_sms(t.get('phone_number'), f"Hello {t.get('name')}! You have been assigned to give a gift to {assigned_num}. $25 minimum.")
                print(f"SMS sent to {t.get('name')} at {t.get('phone_number')}: You have been assigned to give a gift to {assigned_num}. $25 minimum.")
                time.sleep(2) # to avoid not getting blocked by the sms api for sending too many messages in a short time
                people_nums.remove(assigned_num)
        
            

secret_santa()

for i in people:
    print(i)

