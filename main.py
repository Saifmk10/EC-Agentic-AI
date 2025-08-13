from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from myModel import WorkingModel
import spacy
import subprocess

app = FastAPI()

# Load SpaCy model at startup
@app.on_event("startup")
def load_models():
    global nlp, model_instance
    try:
        nlp = spacy.load("en_core_web_sm")
    except:
        subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
        nlp = spacy.load("en_core_web_sm")

    model_instance = WorkingModel()  # Load Hugging Face model at runtime

class UserText(BaseModel):
    text: str

@app.post("/predict")
def predict_text(input: UserText):
    try:
        userinput = input.text
        model_instance.transformToToken(userinput)
        with_output = model_instance.sequenceClassification()
        parsed_entities = model_instance.parsedUserInput()

        classification_map = {0:"book_appointment",1:"cancel_appointment",2:"bye",3:"hi",-1:"unknown"}
        classification_label = classification_map.get(with_output,"unknown")

        return {
            "classification": classification_label,
            "entities": {
                "doctor_name": parsed_entities[0],
                "appointment_time": str(parsed_entities[1]) if parsed_entities[1] else None,
                "appointment_date": str(parsed_entities[2]) if parsed_entities[2] else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
