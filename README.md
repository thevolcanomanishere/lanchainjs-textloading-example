# Lanchainjs Text Loading Example

Before starting this project, turn on docker, then open up a terminal and run:

```bash
git clone https://github.com/chroma-core/chroma.git
cd chroma
docker-compose up -d --build
```
This will startup the chroma vector database. 

Rename `.env.example` to `.env` and add your OpenAI API key to the `.env` file.

Put your text documents into the `documents` folder. Create it if it doesn't exist.

Next, open up another terminal and run:

```bash
yarn
```

Wait for the packages to install, then run:

```bash
yarn start
```