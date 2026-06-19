import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("firebase_key.json")

firebase_admin.initialize_app(cred, {
    "databaseURL": "https://water-quality-system-46fa9-default-rtdb.europe-west1.firebasedatabase.app"
})