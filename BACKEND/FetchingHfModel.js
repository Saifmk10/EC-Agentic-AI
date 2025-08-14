import fs from 'fs';
import { pipeline } from '@xenova/transformers';

// Load HF token
const HF_TOKEN = fs.readFileSync(
    "D:/PROJECTS/EC_Agentic_AI/EC-Agentic-AI/BACKEND/hf_token.txt",
    "utf-8"
).trim();

class WorkingModel {
    constructor() {
        this.myModel = 'saifmk/EC-AGENT-MODELS';
        this.pipelinePromise = pipeline('text-classification', this.myModel, {
            revision: 'main',          
            subfolder: 'onnx',         
            quantized: false,
            token: HF_TOKEN
        });
    }

    async transformToToken(text) {
        this.text = text;
    }

    async sequenceClassification() {
        const classifier = await this.pipelinePromise;
        const result = await classifier(this.text, { topk: 1 });

        const prediction = result[0].label;
        console.log("FINAL OUTPUT:", prediction);

        switch (prediction) {
            case 'LABEL_0':
                console.log("Appointment booked");
                break;
            case 'LABEL_1':
                console.log("Appointment cancelled");
                break;
            case 'LABEL_2':
                console.log("See you later");
                break;
            case 'LABEL_3':
                console.log("Hello there");
                break;
            default:
                console.log("I don't understand");
        }

        return prediction;
    }
}

// Example usage
(async () => {
    const model = new WorkingModel();
    await model.transformToToken("do you guys have brain");
    await model.sequenceClassification();
})();
