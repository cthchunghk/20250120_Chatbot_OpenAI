import OpenAIApi from "openai";
const apiKey = "";
const openai = new OpenAIApi({
    apiKey: apiKey,
});
export default openai;
