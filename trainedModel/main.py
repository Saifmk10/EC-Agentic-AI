# this code here is used for the FASTAPI , which means im pushing this code to a huggingface repo along with my trained models weight and configs
#in this we have a var called model_name that is gonna have the path of the trained model within it this will run in the huggingface and i can use my repo link as the api to use my model 


from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

# Load model + tokenizer
model_name = r"D:\PROJECTS\EC_Agentic_AI\EC-Agentic-AI\EC-Agent\trained_model"  # Path to your model folder
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# FastAPI app
app = FastAPI()

# Input schema
class TextIn(BaseModel):
    text: str

@app.post("/predict")
def predict(data: TextIn):
    inputs = tokenizer(data.text, return_tensors="pt")
    outputs = model(**inputs)
    prediction = torch.argmax(outputs.logits, dim=1).item()
    return {"prediction": prediction}
