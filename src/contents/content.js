import { OpenAIChatUtils } from "./../utils/OpenAIUtils";
import CONSTANTS from "../../constants";

const openAIUtils = new OpenAIChatUtils(CONSTANTS.OPENAI_KEY);

let editor = null;

window.addEventListener("load", () => {
  setTimeout(() => {
    editor = document.querySelector(".editor__inner");
    console.log(editor);
  }, 500);
  console.log("Hello from script.js");
});

// (async () => {
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     openAIUtils
//       .generateProjectReadme(request.name, request.description)
//       .then(async (response) => {
//         const reader = response.body.getReader();
//
//         let chunks = "";
//         let receivedLength = 0;
//
//         while (true) {
//           const { done, value } = await reader.read();
//
//           if (done) {
//             break;
//           }
//
//           const chunkText = new TextDecoder("utf-8").decode(value);
//           chunks += chunkText;
//           receivedLength += chunkText.length;
//         }
//
//         // Split the chunks by the "data: " prefix
//         const chunkArray = chunks
//           .split("data: ")
//           .filter((chunk) => chunk.trim() !== "");
//
//         // Process the chunks here
//         for (let i = 0; i < chunkArray.length - 1; i++) {
//           const chunkText = chunkArray[i];
//
//           try {
//             const jsonChunk = JSON.parse(chunkText);
//             console.log(jsonChunk);
//             // Access the desired data from the chunk and update the editor accordingly
//             const content = jsonChunk.choices[0].delta.content;
//             editor.innerHTML += content;
//           } catch (error) {
//             console.error("Error parsing JSON:", error);
//             console.log("JSON data:", chunkText);
//           }
//         }
//       });
//   });
// })();

(async () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    openAIUtils
      .generateProjectReadme(request.name, request.description)
      .then(async (response) => {
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
      });
  });
})();
