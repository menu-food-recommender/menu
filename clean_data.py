# coding: utf-8
# import sys
import firebase_admin
from firebase_admin import credentials
cred = credentials.Certificate('./creds/menu-9d9a8-firebase-adminsdk-cozx3-ebac905e09.json')
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://menu-9d9a8.firebaseio.com'
})
from firebase_admin import db
root = db.reference()
menu_items = db.reference('menu_items').get()

import spacy

### Load spaCy's English NLP model
nlp = spacy.load('en_core_web_sm')

## Parse the text with spaCy
## Our 'document' variable now contains a parsed version of text.
# objs = [db.reference('menu_items/' + a) for a in menu_items]
objsPush = db.reference('menu_items').push()
foodTypes = [''.join(menu_items[a]['foodTypes']) for a in menu_items]
descriptions = [menu_items[a]['description'] for a in menu_items]
docsFoodTypes = nlp.pipe(foodTypes, batch_size = 1, n_threads = len(menu_items))
docsDescriptions = nlp.pipe(descriptions, batch_size = 1, n_threads = len(menu_items))
cleaned_menu_items = dict()
for key, docFoodTypes, docDescriptions in zip(menu_items, docsFoodTypes, docsDescriptions):
    obj = menu_items[key]
    # new_obj = obj
    ingredients = list()
    for token in docDescriptions:
        if token.pos_ == "NOUN":
            ingredients.append(token.text)
    obj['ingredients'] = ingredients
    foodTypes = list()
    for token in docFoodTypes:
        if token.pos_ == "NOUN":
            foodTypes.append(token.text)
        obj['foodTypes'] = foodTypes
    cleaned_menu_items[key] = obj
db.reference('menu_items').delete()
db.reference('menu_items').set(cleaned_menu_items)
