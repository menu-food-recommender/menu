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
import copy

import spacy
from spacy import displacy

### Load spaCy's English NLP model
# nlp = spacy.load('en_core_web_sm')
nlp = spacy.load("en_core_web_sm")

## Parse the text with spaCy
## Our 'document' variable now contains a parsed version of text.
objs = [db.reference('menu_items/' + a) for a in menu_items]
foodTypes = [''.join(a.get()['foodTypes']) for a in objs]
docs = nlp.pipe(foodTypes, batch_size = 20, n_threads = len(menu_items)/20)
for obj, doc in zip(objs, docs):
    new_obj = obj.get()
    obj.delete()
    for token in doc:
        if token.pos_ == "NOUN":
            new_obj['foodTypes'] = [token.text]
            db.reference('menu_items').push(new_obj)


# for menu_item in menu_items:
#     obj = db.reference('menu_items/' + menu_item).get()
#     # print(obj)
#     # document = nlp(''.join(obj['foodTypes']))
#     # displacy.serve(document, style="ent")
#     db.reference('menu_items/' + menu_item).delete()
#     ### parse the document
#     for token in document:
#         if token.pos_ == "NOUN":
#             obj['foodTypes'] = [token.text]
#             db.reference('menu_items').push(obj)
    #save only nouns as food Types
    # menu_item['ingredients'] = ingredients

# def parse_menu_item(text):
#     document = nlp(text)
#     ingredients = list()
#     ### parse the document
#     for token in document:
#         if token.pos_ == "NOUN":
#             ingredients.append(token.text)
