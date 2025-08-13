async function fetchingParsedData (text){
    const HF_API = 'https://api-inference.huggingface.co/models/saifmk/EC-AGENT-DATA_CONNECTION';
    // use token

    try {
        const response = await fetch(HF_API , {
            method : "POST" ,
            headers :{
                "Authorization" : `Bearer ${HF_TOKEN}` , 
                "Constent-Type" : "application/json"
            }, 
            body : JSON.stringify({inputs : text})
        });



        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("HF RAW RESPOSE :" , result);
        return result
    }
    catch (error){
        console.error("FAILED TO QUERY MODEL :" , error);
        throw error
    }
}


// usage

fetchingParsedData("book an appointment with robert at 8:00pm tomorrow").then(output =>{
    console.log("Model output:", output);
})