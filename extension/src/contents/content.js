import { OpenAIChatUtils } from "../utils/OpenAIUtils";
import { Octokit } from "octokit";

const openAIUtils = new OpenAIChatUtils(process.env.OPENAI_API_KEY);
let octokit = new Octokit({});

let editor = null;
let tab = null;

// Get data about repository from Octokit using the repository URL
async function getRepoData(url) {
  try {
    const githubToken = await chrome.runtime.sendMessage({
      action: "get-github-token",
    });

    octokit = new Octokit({ auth: githubToken ? githubToken : null });

    const match = url.match(
      /github\.com\/([^/]+)\/([^/]+)\/[^/]+\/(.+?)(?=\/|$)/
    );

    return await octokit.request(
      `GET /repos/{owner}/{repo}/contents/docs/{path}`,
      {
        owner: match[1],
        repo: match[2],
        path: "resources",
        ref: match[3] ? match[3] : "main",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}

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
  const repoData = await getRepoData(request.tab.url);
  if (!editor) {
    await getEditorElement();
  }

  // Common logic for generating readme content
  const generateContent = async (resources) => {
    const response = await openAIUtils.generateProjectReadme(
      request.name,
      request.features,
      request.contribution,
      request.license,
      request.environment,
      request.extra,
      resources
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
  };

  if (repoData) {
    const resources = repoData.data.map((resource) => resource.html_url);
    await generateContent(resources);
  } else {
    await generateContent(null);
  }
}

window.addEventListener("load", () => {
  getEditorElement().then(() => {
    console.log(editor);
  });
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "generate-readme") {
    await generateReadme(request, sender, sendResponse);
  }
});
