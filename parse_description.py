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


### Parse the text with spaCy
### Our 'document' variable now contains a parsed version of text.
for menu_item in menu_items:
    obj = db.reference('menu_items/' + menu_item).get()
    print(obj)
    document = nlp(obj['description'])
    ingredients = list()
    ### parse the document
    for token in document:
        if token.pos_ == "NOUN":
            ingredients.append(token.text)
    #save ingredients into the datbase field.
    # menu_item['ingredients'] = ingredients
    db.reference('menu_items/' + menu_item).update({'ingredients': ingredients})

def parse_menu_item(text):
    document = nlp(text)
    ingredients = list()
    ### parse the document
    for token in document:
        if token.pos_ == "NOUN":
            ingredients.append(token.text)
