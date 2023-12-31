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

    if (!match) {
      throw new Error("Invalid GitHub repository URL");
    }

    const owner = match[1];
    const repo = match[2];
    const ref = match[3] ? match[3] : "main";

    const response = await octokit.request(
      `GET /repos/{owner}/{repo}/contents/docs/{path}`,
      {
        owner,
        repo,
        path: "resources",
        ref,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("GitHub API returned an error: " + response.status);
    }

    return { repoData: response.data, url: `github.com/${owner}/${repo}` };
  } catch (err) {
    console.error("Error fetching repo data:", err);
    return { repoData: null, url: "" };
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
  const { repoData, url } = await getRepoData(request.tab.url);
  console.log(repoData, "BOUNCE");
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
      resources,
      url
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
