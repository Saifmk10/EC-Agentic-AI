from transformers import DistilBertTokenizer , DistilBertModel;
import torch;
import speech_recognition as sr


class VoiceModule : 

    # function that is responsible for getting user input using voice and returing that that as a string
    @staticmethod
    def voiceInput () :
        userAudioInput = sr.Recognizer()
        with sr.Microphone() as source :
            print("SPEAK SOMETHING IM LISTENING...")
            audio = userAudioInput.listen(source)

            try : 
                userInputViaVoiceModule = userAudioInput.recognize_google(audio)
                print(f"USER SAID : {userInputViaVoiceModule}")
            except sr.UnknownValueError:
                  print("Sorry, I could not understand the audio.")
            except sr.RequestError:
                print("Could not request results, check your internet connection.")

        return userInputViaVoiceModule; 

    # this function is responsible for converting the user provided data into token and into 768 numeric format
    @staticmethod
    def userInputTokenizer () :
        tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
        model = DistilBertModel.from_pretrained("distilbert-base-uncased")

        textViaVoice = VoiceModule.voiceInput()

        userInput = tokenizer(textViaVoice , return_tensors = "pt")
        print(f"TOKENIZED DATA : {userInput}")

        with torch.no_grad() :
            ouput = model(**userInput)
            finalOuput = ouput.last_hidden_state
            print(finalOuput)


 

VoiceModule.userInputTokenizer()