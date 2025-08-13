from datasets import load_dataset
from transformers import DistilBertTokenizerFast , DistilBertForSequenceClassification , TrainingArguments , Trainer

dataset = load_dataset('csv' , data_files = 'D:/PROJECTS/EC_Agentic_AI/EC-Agentic-AI/datasets/modelTraining.csv')

tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')





class ModelTrainer : 

    # here were storing the class variables that will be used by the class methods
    tokenizer_on_dataset = None
    label2int = None
    int2label = None
    
    # function responsible for displaying the dataset includes the text and intent
    @staticmethod
    def printingDataset() :
        print(dataset['train'][:5])

    # function responsible for converting all the text within the dataset into tokens that is understood by the model in upcoming devlopment of the ai
    @staticmethod
    def tokenization(batch) :
        return tokenizer(batch['text'] , padding='max_length' , truncation = True)
    

    # classmethod function that is storing having another function within it the core feature this fucntion holds is processing of the data sets
    # some of the task it does are 
    # 1. maping of the tokens that was created in the above funtion tokenization()
    # 2. encoding of the intent into a integer so the model understands the intents 
    @classmethod
    def processingDataSet(cls):
    
        # we are creating a map for the data set 
        cls.tokenizer_on_dataset = dataset.map(cls.tokenization , batched=True)
        print("THIS IS tokenizer_on_dataset : ", cls.tokenizer_on_dataset)

        # the int refs to the id that is given to each intent , here as of now we have 1 intent that is book_appointment. So it gets converted into 0 => book_appointment where 0 is the id
        labels_to_int = cls.tokenizer_on_dataset['train']['intent']
        unique_labels = sorted(set(labels_to_int))  # unique & sorted list
        cls.labels2int = {label: idx for idx, label in enumerate(unique_labels)}
        cls.int2label = {idx: label for label, idx in cls.labels2int.items()}
        print("LABEL2INT:", cls.labels2int)
        print("INT2LABEL:", cls.int2label)
        # =====>>>>>>>>> some error in above section too 

        # function is responsible for coverting of the intent into numric format
        def encodeIntent(batch) :
            batch['label'] = cls.labels2int[batch['intent']] # ==========>>>>>> there is some error here
            return batch
        
        # here we are mapping all encodedintent || here we have reassigned the var tokenizer_on_dataset as we are creating a map for the same dataset and its not needed to assign another var to save space    
        cls.tokenizer_on_dataset = cls.tokenizer_on_dataset.map(encodeIntent)
        print("THIS IS encodedIntent :" , cls.tokenizer_on_dataset)
        return cls.tokenizer_on_dataset


    @classmethod
    def sequenceClassification (cls) :
        trainerModel = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased' , num_labels = len(cls.int2label) , problem_type="single_label_classification")
        print("MODEL PRODUCED :" , trainerModel)
        return trainerModel




# this a var that is placed outside the model class , the functionality is getting the model code ready to be trained
training_arguments = TrainingArguments(
        output_dir= "D:/PROJECTS/EC_Agentic_AI/EC-Agentic-AI/trainedModel/finalModel",
        learning_rate= 2e-5,
        per_device_train_batch_size= 16,
        per_device_eval_batch_size= 16,
        num_train_epochs= 3,
        weight_decay= 0.01,

        logging_dir= "D:/PROJECTS/EC_Agentic_AI/EC-Agentic-AI/trainedModel/finalModel/logs",
        logging_strategy= "steps",
        logging_steps= 10,
        eval_steps= 10,
        save_strategy= "epoch",
        report_to= ["tensorboard"],
    )

#
processed_dataset = ModelTrainer.processingDataSet()
processed_dataset = processed_dataset['train'].train_test_split(test_size=0.2)

# this is the main function that loads all the data from all the funtions within the model class and with the help of train() the model is trained
trainer = Trainer(
        model= ModelTrainer.sequenceClassification(),
        args = training_arguments,
        train_dataset= processed_dataset['train'],
        eval_dataset= processed_dataset['test']
    )

#  ->> uncomment the bellow code for individual function debugging
# Model.printingDataset()
# Model.processingDataSet()
# Model.sequenceClassification()
trainer.train()

trainer.model.save_pretrained(training_arguments.output_dir)
tokenizer.save_pretrained(training_arguments.output_dir)