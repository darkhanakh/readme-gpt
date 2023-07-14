import { OpenAIChatUtils } from "../utils/OpenAIUtils";
import CONSTANTS from "../../constants";
import { Octokit } from "octokit";

const openAIUtils = new OpenAIChatUtils(CONSTANTS.OPENAI_KEY);
const octokit = new Octokit({});

let editor = null;
let tab = null;

// Get data about repository from Octokit using the repository URL
async function getRepoData(url) {
  try {
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
  } catch (e) {
    if (e.status === 404) {
      return { error: "Not found" };
    }
  }
}

// Get repo's package.json file and decode it from base64 and get scripts from it
async function getPackageJson(url) {
  const match = url.match(
    /github\.com\/([^/]+)\/([^/]+)\/[^/]+\/(.+?)(?=\/|$)/
  );

  const packageJson = await octokit.request(
    `GET /repos/{owner}/{repo}/contents/package.json`,
    {
      owner: match[1],
      repo: match[2],
      ref: match[3] ? match[3] : "main",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const decodedPackageJson = atob(packageJson.data.content);
  return JSON.parse(decodedPackageJson).scripts;
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
  const packageJsonScripts = await getPackageJson(request.tab.url);

  if (!editor) {
    await getEditorElement();
  }

  // Loop through repoData and get all html_url's
  const resources = repoData.error
    ? []
    : repoData.data.map((resource) => resource.html_url);

  const response = await openAIUtils.generateProjectReadme(
    request.name,
    request.features,
    request.contribution,
    request.license,
    request.environment,
    request.extra,
    resources,
    packageJsonScripts
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
