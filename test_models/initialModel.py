from transformers import DistilBertTokenizer , DistilBertModel;
import torch;

tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
model = DistilBertModel.from_pretrained("distilbert-base-uncased")

text = input("Enter anything you like : ")

userinput = tokenizer(text , return_tensors = "pt")

print(f"TOKENIZED DATA : {userinput}")

with torch.no_grad() :
    output = model(**userinput)
    finalOutput = output.last_hidden_state
    print(finalOutput)

    