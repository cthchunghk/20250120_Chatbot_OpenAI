//const express = require("express");
import express from "express";
import test2 from "./api/openai_api_response.js";
//import { readLocalJSONFile, writeJSONFile } from "./api/readfile.js";
import readfile from "./api/readfile.js";
import embedding from './api/embedding.js';
//import {readFAQ, generateFaqResponse} from "./api/test2";

const app = express();
const faqPath = "static/faq.txt";
const faqJSONPath = "static/faqs.json";
const faqEmbeddingPath = "static/embedding.json";

app.use(express.json());
app.use(express.static("static"));
app.use("/static", express.static("static"));

app.post("/api/createEmbedding", async (req, res) => {
  const resp = await embedding.createEmbedding(readfile.readLocalJSONFile(faqJSONPath));
  res.send(resp);
});

app.post("/api/embeddingByText", async (req, res) => {
  var post_body = req.body;
  const userQuestion = post_body["question"];
  const resp = await embedding.getEmbedding(userQuestion);
  res.send(resp);
});

app.get("/api/embedding", (req, res) => {
  const resp = embedding.loadEmbeddings(faqEmbeddingPath);
  res.send(resp);
});

app.post("/api/checkCosineSimilarity", async (req, res) => {
  var post_body = req.body;
  const userQuestion = post_body["question"];
  const response = await embedding.findMostSimilarTextFromFile(userQuestion, faqEmbeddingPath);
  console.log(response);
  const responseJson = {
    response: response,
  };

  res.send(responseJson);
});

app.get("/api/getFAQs", (req, res) => {
  const faqs = readfile.readLocalJSONFile(faqJSONPath);
  res.send(faqs);
});

app.post("/api/getResponseVector", async (req, res) => {
  var post_body = req.body;
  const userQuestion = post_body["question"];
  const response = await test2.generateFaqResponseByVector(userQuestion, faqEmbeddingPath);
  console.log(response);
  const responseJson = {
    answer: response,
  };

  res.send(responseJson);
});

app.post("/api/getResponse", async (req, res) => {
  var post_body = req.body;
  const userQuestion = post_body["question"];
  console.log(post_body);

  const response = await test2.generateFaqResponse(userQuestion, faqJSONPath);
  console.log(response);
  const responseJson = {
    answer: response,
  };

  res.send(responseJson);
});

app.post("/api/updatefaqs", async (req, res) => {
  var post_body = req.body;
  const data = post_body["content"];
  readfile.writeJSONFile("./static/faqs.json", JSON.stringify(data))
  const response = {
    content: "OK"
  }
  res.send(response);
});

app.listen(3000, () => console.log("Service Started"));
