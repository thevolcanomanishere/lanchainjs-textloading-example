import { chain, embeddings, loader, split } from "./injest.js";
import "dotenv/config";

const docs = await loader();
const splitDocs = await split(docs);
const db = await embeddings(splitDocs);
const chat = await chain(db);

const endPrompt = "";

console.time("Ask question");
const res = await chat.call({
  question: `Tell me about Harry and Snape? ${endPrompt}`,
});
console.timeEnd("Ask question");

console.log(res);
