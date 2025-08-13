from fastapi import FastAPI, HTTPException  # type: ignore
from pydantic import BaseModel  # type: ignore
from myModel import WorkingModel

# Initialize FastAPI app
app = FastAPI()

# Model instance (will be loaded on startup)
model_instance = None

# FastAPI startup event to load model
@app.on_event("startup")
def load_model():
    global model_instance
    model_instance = WorkingModel()

# Request body schema
class UserText(BaseModel):
    text: str

@app.post("/predict")
def predict_text(input: UserText):
    try:
        userinput = input.text
        model_instance.transformToToken(userinput)
        
        # Run classification
        with_output = model_instance.sequenceClassification()
        
        # Parse entities
        parsed_entities = model_instance.parsedUserInput()

        # Map classification to label for clarity
        classification_map = {
            0: "book_appointment",
            1: "cancel_appointment",
            2: "bye",
            3: "hi",
            -1: "unknown"
        }
        classification_label = classification_map.get(with_output, "unknown")

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
