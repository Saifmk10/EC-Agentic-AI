from transformers import DistilBertTokenizerFast
import torch


tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

class WorkingModel :

    userInput = None
    tokenizerOutput = None

    @classmethod
    def gettingUserInput(cls):
        cls.userInput = input("Hey what do you want me to do today? : ")
        return cls.userInput

    @classmethod
    def transformToToken(cls):
        cls.tokenizerOutput = tokenizer(cls.userInput , padding= 'max_length' , truncation = True )
        
        