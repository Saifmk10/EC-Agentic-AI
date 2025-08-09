from transformers import DistilBertTokenizerFast , DistilBertForSequenceClassification
import torch
import speech_recognition as sr




class WorkingModel :

    def __init__(self):
        my_model = "D:/PROJECTS/EC_Agentic_AI/EC-Agentic-AI/trainedModel/finalModel"
        self.tokenizer = DistilBertTokenizerFast.from_pretrained(my_model)
        self.model = DistilBertForSequenceClassification.from_pretrained(my_model)
    #     self.recognizer = sr.Recognizers()

    # def userInputViaVoice(self):
    #     with sr.Microphone as source : 
    #         userAudioInput = self.recognizer.listen(source)

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

    
    def gettingUserInput(self):
        self.userInput = input("Hey what do you want me to do today? : ")
        print("USER SAID : " , self.userInput)
        return self.userInput
        

    
    def transformToToken(self):
        self.tokenizerOutput = self.tokenizer(self.userInput , return_tensors = 'pt' , padding= 'max_length' , truncation = True )
    
    
    def sequenceClassification(self):
        with torch.no_grad() :
            inputs = self.tokenizerOutput
            output = self.model(**inputs)
            prediction = torch.argmax(output.logits , dim = -1)
            print("FINAL OUTPUT : " , prediction)
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

                # 0=>book_appointment 1=>cancel_appointment 2=>bye 3=>hi


modelOuput = WorkingModel()
modelOuput.gettingUserInput()
modelOuput.transformToToken()
modelOuput.sequenceClassification()
        
        