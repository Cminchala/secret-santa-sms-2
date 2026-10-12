from pydantic import BaseModel
from pydantic_extra_types.phone_numbers import PhoneNumber


class Contact(BaseModel):
    name : str
    phone : PhoneNumber



c = Contact(name = "christian",phone='347-247-5386')

print(c.phone)