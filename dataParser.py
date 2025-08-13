import spacy
# import dateparser 
from dateparser.search import search_dates

class DataParsing :

    def entityExtraction(text):
        
        # setting up the NLP model
        nlp_model = "en_core_web_sm"
        model = spacy.load(nlp_model)
        users_input = model(text) # here we are processing the model
        name =[]
        user_set_date = None
        user_set_time = None



        # this for loop will loop through all the words and pick up the noun or the word that it feels is a persons name
        for ent in users_input.ents:
            if ent.label_ == "PERSON":
                name = ent.text.split(" at")[0].strip()
                print("debug doctor name from dataParser.py",name)
                
                
        
        

        # in this function we are searching for a time in the string provided , 
        time = search_dates(text)
        if time:
            for match_text, dt in time:
                #checks if the text that is input contains the bellow terms and then parse it accordingly 
                if (('am' in match_text.lower() or 'pm' in match_text.lower())  or  dt.time() != dt.min.time()):
                    user_set_time = dt.time()

                #checks if the text that is input contains the bellow terms and then parse it accordingly 
                if(any(word in match_text.lower() for word in ['tomorrow' , 'today' , 'monday' , 'tuesday' , 'wednesday' , 'thursday' , 'friday' , 'saturday' , 'sunday']) or dt.date() != dt.min.date()):
                    user_set_date = dt.date()

                
                print("debug time from dataParser.py",user_set_time)
                print("debug date from dataParser.py",user_set_date)
        else:
            print("No time found.")


        finaloutput = [name , user_set_time , user_set_date] #with the help of this list im storing all the outputs and will access each of it with the index

        return finaloutput


            #use the bellow code for individual debugging puropose

# if __name__ == "__main__":
#     doctor = DataParsing.entityExtraction("Book and appointment for tomorrow with robert at 4pm")
#     print("DOCTOR NAME :",doctor[0])
#     print("TIME OF APPOINTMENT :" , doctor[1])
#     print("TIME OF APPOINTMENT :" , doctor[2])
    
 