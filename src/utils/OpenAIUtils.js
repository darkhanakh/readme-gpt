export class OpenAIChatUtils {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openai.com/v1/chat/completions";
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
  }

  async chatCompletion(messages) {
    const requestData = {
      model: "gpt-3.5-turbo",
      messages: messages,
      stream: true,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(requestData),
      });

      return response;
    } catch (error) {
      throw new Error("Chat completion request failed: " + error.message);
    }
  }

  generateProjectReadme(
    projectName,
    features,
    contribution,
    projectLicense,
    projectEnvironment,
    extra,
    resources
  ) {
    const messages = [
      {
        role: "user",
        content: `You are a developer working on a project called ${projectName}.You need to write a concise and informative project README.md file to introduce the project and provide essential information to users. Add logos and gif where appropriate from repository resources, resources: ${
          resources ? resources : "No resources, do not include images"
        }. Extra information from user: ${extra}
Write a README.md file in Markdown syntax and emojis, so document that covers the following sections:
Introduction: Provide a description to the project, explaining its purpose and goals.
Features: Highlight the key features and functionalities of the project. Explain what sets it apart and makes it useful for users. With this features: ${features}
Installation: Explain how users can install and set up the project on their local machines. Environment: ${projectEnvironment}
Usage: Describe how users can use the project and any relevant instructions or examples to help them get started.
Contributing: Provide guidelines and instructions for users who wish to contribute to the project. Explain how they can get involved, submit bug reports, or suggest improvements. Open to contribution: ${
          contribution ? "Yes" : "No"
        }
License: Specify the license under which the project is distributed and any relevant terms or conditions. License: ${projectLicense}
`,
      },
    ];

    return this.chatCompletion(messages)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Failed to generate project README:", error);
        return null;
      });
  }
}
