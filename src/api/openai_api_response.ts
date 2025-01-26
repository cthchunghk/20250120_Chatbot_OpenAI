//import * as reader from "./readfile" ;
//const reader = require('./readfile')
import readfile from "./readfile.js";
import openai_client from "./openaiConfig.js";
import embedding from "./embedding.js";

async function generateFaqResponse(
  question: string,
  faqPath: string
  //customAnswer: string | null
): Promise<string> {
  let questionList = [];
  let ansList = [];
  const faqs = readJSONFAQs(faqPath);
  for (var i = 0; i < faqs.length; i++) {
    questionList.push(faqs[i]["question"]);
    ansList.push(faqs[i]["answer"]);
  }

  const systemMessage = `你是一個物流公司的客戶服務助理，這裡有一些問題和自訂答案：\n\nQ${questionList
    .map((q, i) => `${i + 1}. Q: ${q} A: ${ansList[i]}`)
    .join(
      "\n"
    )}\n\n\n請基於這些信息改進答案。如果在這些信息中找不到資訊，請回答\"不好意思，我沒有相關資訊，請問您要跟我們的客戶服務助理對話嗎？\"`;

  const userMessage = `Q: ${question}`;

  const completion = await openai_client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    store: true,
  });

  const openaiResponse = completion.choices[0].message.content!.trim();
  return openaiResponse;
}

async function generateFaqResponseByVector(
  question: string,
  faqPath: string
  //customAnswer: string | null
): Promise<string> {
  let questionList = [];
  let ansList = [];
  //const faqs = readJSONFAQs(faqPath);
  const faqFiltered = await embedding.findMostSimilarTextFromFile(
    question,
    faqPath
  );
  const faqs = JSON.parse(faqFiltered);
  questionList.push(faqs["question"]);
  ansList.push(faqs["answer"]);

  const systemMessage = `你是一個物流公司的客戶服務助理，這裡有一些問題和自訂答案：\n\nQ${questionList
    .map((q, i) => `${i + 1}. Q: ${q} A: ${ansList[i]}`)
    .join(
      "\n"
    )}\n\n\n請基於這些信息改進答案。如果在這些信息中找不到資訊，請回答\"不好意思，我沒有相關資訊，請問您要跟我們的客戶服務助理對話嗎？\"`;

  const userMessage = `Q: ${question}`;

  const completion = await openai_client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
    store: true,
  });

  const openaiResponse = completion.choices[0].message.content!.trim();
  return openaiResponse;
}

function readFAQ(path: string) {
  const faqs = readfile.readFileByLocalPath(path);
  return faqs;
}

function readJSONFAQs(path: string) {
  const faqs = readfile.readLocalJSONFile(path);
  console.log(faqs);
  return faqs;
}

function getEmbeddedResult(question: string, path: string) {
  const faqs = [];
  faqs.push(embedding.findMostSimilarTextFromFile(question, path));
  console.log(faqs);
  return faqs;
}

export default { readFAQ, generateFaqResponse, generateFaqResponseByVector };
