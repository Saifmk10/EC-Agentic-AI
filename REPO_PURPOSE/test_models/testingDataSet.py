from datasets import load_dataset
dataset = load_dataset('csv' , data_files = 'modelTraining.csv')
print(dataset['train'][:5])