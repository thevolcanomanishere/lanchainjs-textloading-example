import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { VectorStore, VectorStoreRetriever } from "langchain/vectorstores/base";
import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { Chroma } from "langchain/vectorstores/chroma";

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
// const EMBEDDING_MODEL = "all-MiniLM-L6-v2";

export const loader = async () => {
  console.time("Loading docs");
  const loader = new DirectoryLoader("documents/", {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
    ".epup": (path) => new EPubLoader(path),
  });
  const docs = await loader.load();
  console.timeEnd("Loading docs");
  return docs;
};

export const split = async (docs: Document<Record<string, any>>[]) => {
  console.time("Splitting docs");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  const splitDocs = await splitter.splitDocuments(docs);
  console.timeEnd("Splitting docs");
  return splitDocs;
};

export const embeddings = async (
  splitDocs: Document<Record<string, any>>[]
) => {
  console.log("Starting embeddings");
  console.time("Embeddings");
  const openAI = new OpenAIEmbeddings({});

  const store = await Chroma.fromDocuments(splitDocs, openAI, {
    collectionName: "harry-potter",
  });
  console.timeEnd("Embeddings");
  return store.asRetriever();
};

export const chain = async (vectorStore: VectorStoreRetriever<VectorStore>) => {
  const model = new OpenAI({});
  return await ConversationalRetrievalQAChain.fromLLM(model, vectorStore, {
    memory: new BufferMemory({
      memoryKey: "chat_history",
    }),
  });
};
