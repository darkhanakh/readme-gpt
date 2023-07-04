import { OpenAIChatUtils } from "./../utils/OpenAIUtils";
import CONSTANTS from "../../constants";

const openAIUtils = new OpenAIChatUtils(CONSTANTS.OPENAI_KEY);

let editor = null;

window.addEventListener("load", () => {
  setTimeout(() => {
    editor = document.querySelector(".cm-content");
    editor.textContent = "";
    console.log(editor);
  }, 500);
  console.log("Hello from script.js");
});

async function generateReadme(request, sender, sendResponse) {
  const response = await openAIUtils.generateProjectReadme(
    request.name,
    request.description
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

chrome.runtime.onMessage.addListener(generateReadme);
