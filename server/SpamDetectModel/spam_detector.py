from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# Load pretrained spam detection model
tokenizer = AutoTokenizer.from_pretrained("SGHOSH1999/bert-email-spam-classifier_tuned")
model = AutoModelForSequenceClassification.from_pretrained("SGHOSH1999/bert-email-spam-classifier_tuned")

class EmailText(BaseModel):
    message: str

@app.post("/check-spam")
async def check_spam(data: EmailText):
    inputs = tokenizer(data.message, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    prediction = torch.argmax(outputs.logits, dim=1).item()
    label = "spam" if prediction == 1 else "ham"
    return {"label": label}

# uvicorn spam_detector:app --reload