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
      max_tokens: 1000,
      temperature: 1,
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
        role: "system",
        content: "You are developer that writes best README.md files",
      },
      {
        role: "user",
        content: `You are a developer working on a project called **${projectName}**. You need to write a concise and informative project README.md file to introduce the project and provide essential information to users. Use Markdown syntax, emojis and HTML elements with aligning classes like center and emojis to make your README more readable and engaging. Also include resources like gif and images from here: ${
          resources
            ? resources
            : "No resources found in repository, do not include resources"
        }. Extra information from user that you should use: ${extra} The README should include the following sections: **Introduction:** Provide a description to the project, explaining its purpose and goals. **Features:** Highlight the key features and functionalities of the project. Explain what sets it apart and makes it useful for users. ${features} **Installation:** Explain how users can install and set up the project on their local machines. **Usage:** Describe how users can use the project and any relevant instructions or examples to help them get started. ${projectEnvironment} **Contributing:** Provide guidelines and instructions for users who wish to contribute to the project. Explain how they can get involved, submit bug reports, or suggest improvements. Is project open to contribution: ${contribution} **License:** Specify the license under which the project is distributed and any relevant terms or conditions. License: ${projectLicense}\n`,
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
