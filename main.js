require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    async function askAndrespond() {
        rl.question("You: ", async (question) => {
            if (question.toLowerCase() === "exit") {
                console.log("Goodbye!");
                rl.close();
            } else {
                const result = await chat.sendMessage(question);
                
                // Inspect the structure of the response
                // console.log("Raw Response: ", result.response);
                
                // Assuming response has a `text` property, log it if available
                if (result.response && typeof result.response.text === 'function') {
                    const text = await result.response.text(); // If text is a function, await it
                    console.log("Bot: ", text);
                } else if (result.response && result.response.text) {
                    console.log("Bot: ", result.response.text);  // If text is already available
                } else {
                    console.log("Bot Response is in unexpected format: ", result.response);
                }
                askAndrespond();
            }
        });
    }

    askAndrespond();
}

run();


// const generate = async() =>{
//     try{
//         const result = await model.generateContent(prompt);
//         console.log(result.response.text());
//     }catch(err){
//         console.log(err);
//     }
   
// }

// generate();
