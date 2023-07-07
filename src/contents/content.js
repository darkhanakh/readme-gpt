import { Octokit } from "octokit";

import { OpenAIChatUtils } from "./../utils/OpenAIUtils";
import CONSTANTS from "../../constants";

const openAIUtils = new OpenAIChatUtils(CONSTANTS.OPENAI_KEY);
const octokit = new Octokit({});

let editor = null;
let tab = null;

function getEditorElement() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      editor = document.querySelector(".cm-content");
      if (editor) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}

async function generateReadme(request, sender, sendResponse) {
  if (!editor) {
    await getEditorElement();
  }

  const response = await openAIUtils.generateProjectReadme(
    request.name,
    request.features,
    request.contribution,
    request.license,
    request.environment,
    request.extra
  );
  const reader = response.body.getReader();
  let text = "";
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunkText = new TextDecoder("utf-8").decode(value);

    // Split the chunks by the "data: " prefix
    const chunkArray = chunkText
      .split("data: ")
      .filter((chunk) => chunk.trim() !== "");

    // Process the chunks here
    const fetchedContent = chunkArray.reduce((acc, chunk) => {
      const jsonChunk = JSON.parse(chunk);
      const content = jsonChunk.choices[0].delta.content;
      acc += content;
      return acc;
    }, "");
    text += fetchedContent;
    editor.textContent = text;
  }
}

window.addEventListener("load", () => {
  getEditorElement().then(() => {
    console.log(editor);
  });
});

chrome.runtime.onMessage.addListener(generateReadme);
