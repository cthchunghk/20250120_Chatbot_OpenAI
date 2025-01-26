// Create embedding file
import fs from "fs";
import openai from "./openaiConfig.js";
import readfile from "./readfile.js";
import path from "path";
//import cosineSimilarity from 'cosine-similarity';
//import * as similarity from 'compute-cosine-similarity' ;
//path.resolve(__dirname, '../infra/knex/migrations')
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const embeddingPath = path.resolve(__dirname, "../../static/embedding.json");
const faqJSONPath = path.resolve(__dirname, "../../static/faqs.json");

async function createEmbedding(text: any): Promise<any> {
  const questionList = [];
  for (var i = 0; i < text.length; i++) {
    console.log(text[i]["question"]);
    questionList.push(text[i]["question"]);
  }

  console.log("Data ready, write to local..");
  await saveEmbeddings(questionList, embeddingPath);

  return "";
}

async function saveEmbeddings(
  texts: string[],
  filePath: string
): Promise<void> {
  const embeddings = [];

  console.log("Retrieving data from OPENAI..");
  for (const text of texts) {
    const embedding = await getEmbedding(text);
    embeddings.push({
      text: embedding,
    });
  }

  console.log("Writing to local..");
  fs.writeFileSync(filePath, JSON.stringify(embeddings, null, 2));
  console.log("Save Done.");
}

/**
 * 获取文本嵌入向量
 * @param text 要嵌入的文本
 * @returns 嵌入向量
 */
async function getEmbedding(text: string): Promise<any> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
    encoding_format: "float",
  });

  const embeddings = response.data;
  return embeddings;
}

/**
 * 从文件中读取嵌入向量
 * @param filePath 嵌入向量文件路径
 * @returns 嵌入向量对象
 */
function loadEmbeddings(filePath: string): any {
  const data = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(data);
  //   for (var i=0; i<jsonData.length; i++) {
  //     const a = jsonData[i]["text"][0]['embedding'];
  //     console.log(a);
  //     //   for(var j=0; j<a.length< j++){

  //     //   }
  //       // console.log(jsonData[i]["text"]['data']);
  //    }
  return jsonData;
}

/**
 * 查找与新传入字符串最相似的文本
 * @param newString 新的字符串
 * @param embeddingFilePath 嵌入向量文件路径
 * @returns 与新字符串最相似的文本
 */
async function findMostSimilarTextFromFile(
  newString: string,
  embeddingFilePath: string
): Promise<string> {
  const faqs = readfile.readLocalJSONFile(faqJSONPath);
  const embeddings = loadEmbeddings(embeddingFilePath);
  const newEmbedding = await getEmbedding(newString);

  let mostSimilarText = "";
  let highestSimilarity = -1;

  for (var i = 0; i < embeddings.length; i++) {
    const similarity = cosinesim(
      newEmbedding[0]["embedding"],
      embeddings[i]["text"][0]["embedding"]
    );

    //console.log(similarity);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarText = faqs[i];
    }
  }

  console.log(highestSimilarity);
  if (highestSimilarity < 0.5) {
    mostSimilarText =
      '{"question":"我想找客戶服務主任","answer":"我們可以幫你轉介到客戶服務主任，請稍等"}';
  }
  console.log(mostSimilarText);
  return JSON.stringify(mostSimilarText);
}

function cosinesim(A: any, B: any) {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;

  for (var i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = dotproduct / (mA * mB);

  return similarity;
}

// 示例
// (async () => {
//   const newString = '我要去旅行。';
//   const mostSimilarText = await findMostSimilarTextFromFile(newString, 'embeddings.json');

//   console.log(`The most similar text is: ${mostSimilarText}`);
// })();

export default {
  createEmbedding,
  getEmbedding,
  loadEmbeddings,
  findMostSimilarTextFromFile,
};
