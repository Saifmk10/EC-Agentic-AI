from transformers import DistilBertTokenizerFast , DistilBertForSequenceClassification
import torch
import speech_recognition as sr
from dataParser import DataParsing
import os

#for local terminal run and text use bellow code

# with open("./hf_token.txt" , "r" , encoding="utf-8") as fileData :
#     HF_TOKEN = fileData.read()


#for docker image 
HF_TOKEN = os.environ.get("HF_TOKEN")

class WorkingModel :

    def __init__(self):
        my_model = "saifmk/EC-AGENT-MODELS"
        self.tokenizer = DistilBertTokenizerFast.from_pretrained(my_model , token=HF_TOKEN)
        self.model = DistilBertForSequenceClassification.from_pretrained(my_model , token=HF_TOKEN)
        # self.text = "book and appointment with robert at 4 pm today"
        

    # def userInputViaVoice(self):
    #     self.recognizer = sr.Recognizer()

    #     with sr.Microphone() as source : 
    #         print("Adjusting for background noise...")
    #         print("HELLO, HOW MAY I HELP YOU TODAY?")
    #         print("Listening...")
    #         userAudioInput = self.recognizer.listen(source , phrase_time_limit=40)
            
            

    #     try : 
    #         print("HELLO , HOW MAY I HELP YOU TODAY ?")
    #         print("listening...")
    #         self.userAudioToText = self.recognizer.recognize_google(userAudioInput)
    #         print("USER SAID : " , self.userAudioToText)
    #         return self.userAudioToText
            
    #     except sr.UnknownValueError:
    #         print("Couldn’t understand the audio")
    #     except sr.RequestError as e:
    #         print(f"API error; {e}")
        

    
    def transformToToken(self , text : str):
        self.text = text
        self.tokenizerOutput = self.tokenizer(text , return_tensors = 'pt' , padding= 'max_length' , truncation = True )
    
    
    def sequenceClassification(self):
        with torch.no_grad() :
            inputs = self.tokenizerOutput
            output = self.model(**inputs)
            prediction = torch.argmax(output.logits , dim = -1)
            print("FINAL OUTPUT : " , prediction.item())

            if prediction.item() == 0 :
                print("Appointment booked")
            elif prediction.item() == 1:
                print("Appointment cancelled")
            elif prediction.item() == 2:
                print("See you later")
            elif prediction.item() == 3:
                print("Hello there")
            else :
                print("I dont understand")

            print("PREDICTION :" ,prediction)
            return prediction
            # 0=>book_appointment 1=>cancel_appointment 2=>bye 3=>hi

    # this function is using the DataParsing class that has been imported from the dataParser.py file   
    def parsedUserInput (self):
        output = DataParsing.entityExtraction(self.text)
        print("doctor name :" , output[0])
        print("doctor appointment time :" , output[1])
        print("doctor appointment date :" , output[2])
        return output





# modelOuput = WorkingModel()
# modelOuput.transformToToken()
# modelOuput.sequenceClassification()
# modelOuput.parsedUserInput()
        
        

# so https://github.com/Saifmk10/EC-Agentic-AI this is the github repo where i have the trained model , ill have the ui in few days , so im asking if i move this folder into railway where the model and the ui are connected will that work fine for a hackathon submission ?