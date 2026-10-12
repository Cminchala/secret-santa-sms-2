import random
test = [{
    
        "name" :"example_test",
        "phone_number" : "123-456-7890",
        "Wishlist": ["item1", "item2", "item3"],
        "Assigned_to" : ""
    
    },
    {
        "name" :"another_test",
        "phone_number" : "098-765-4321",
        "Wishlist": ["itemA", "itemB"],
        "Assigned_to" : ""
    },
    {
        "name" :"third_test",
        "phone_number" : "555-555-5555",
        "Wishlist": ["itemX", "itemY"],
        "Assigned_to" : ""
    },
    {
        "name" :"t_test",
        "phone_number" : "555-555-5555",
        "Wishlist": ["itemX", "itemY"],
        "Assigned_to" : ""
    }
]


def assign_all(people:dict):
    getName = [i.get("name") for i in test]
    for i in range(len(test)):
        nameToAssigned = random.choice(getName)
        if nameToAssigned == test[i]["name"]:
            while nameToAssigned == test[i]["name"]:
                nameToAssigned = random.choice(getName)
        test[i]["assigned"] = nameToAssigned
        getName.remove(nameToAssigned)
        
            
            


assign_all(test)

for i in test:
    print(i)