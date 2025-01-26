var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import * as reader from "./readfile" ;
//const reader = require('./readfile')
import readfile from "./readfile.js";
import openai_client from "./openaiConfig.js";
import embedding from "./embedding.js";
function generateFaqResponse(question, faqPath
//customAnswer: string | null
) {
    return __awaiter(this, void 0, void 0, function* () {
        let questionList = [];
        let ansList = [];
        const faqs = readJSONFAQs(faqPath);
        for (var i = 0; i < faqs.length; i++) {
            questionList.push(faqs[i]["question"]);
            ansList.push(faqs[i]["answer"]);
        }
        const systemMessage = `你是一個物流公司的客戶服務助理，這裡有一些問題和自訂答案：\n\nQ${questionList
            .map((q, i) => `${i + 1}. Q: ${q} A: ${ansList[i]}`)
            .join("\n")}\n\n\n請基於這些信息改進答案。如果在這些信息中找不到資訊，請回答\"不好意思，我沒有相關資訊，請問您要跟我們的客戶服務助理對話嗎？\"`;
        const userMessage = `Q: ${question}`;
        const completion = yield openai_client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage },
            ],
            store: true,
        });
        const openaiResponse = completion.choices[0].message.content.trim();
        return openaiResponse;
    });
}
function generateFaqResponseByVector(question, faqPath
//customAnswer: string | null
) {
    return __awaiter(this, void 0, void 0, function* () {
        let questionList = [];
        let ansList = [];
        //const faqs = readJSONFAQs(faqPath);
        const faqFiltered = yield embedding.findMostSimilarTextFromFile(question, faqPath);
        const faqs = JSON.parse(faqFiltered);
        questionList.push(faqs["question"]);
        ansList.push(faqs["answer"]);
        const systemMessage = `你是一個物流公司的客戶服務助理，這裡有一些問題和自訂答案：\n\nQ${questionList
            .map((q, i) => `${i + 1}. Q: ${q} A: ${ansList[i]}`)
            .join("\n")}\n\n\n請基於這些信息改進答案。如果在這些信息中找不到資訊，請回答\"不好意思，我沒有相關資訊，請問您要跟我們的客戶服務助理對話嗎？\"`;
        const userMessage = `Q: ${question}`;
        const completion = yield openai_client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage },
            ],
            store: true,
        });
        const openaiResponse = completion.choices[0].message.content.trim();
        return openaiResponse;
    });
}
function readFAQ(path) {
    const faqs = readfile.readFileByLocalPath(path);
    return faqs;
}
function readJSONFAQs(path) {
    const faqs = readfile.readLocalJSONFile(path);
    console.log(faqs);
    return faqs;
}
function getEmbeddedResult(question, path) {
    const faqs = [];
    faqs.push(embedding.findMostSimilarTextFromFile(question, path));
    console.log(faqs);
    return faqs;
}
export default { readFAQ, generateFaqResponse, generateFaqResponseByVector };
