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

  generateProjectReadme(projectName, description) {
    const messages = [
      {
        role: "user",
        content: `You are a developer working on a project called ${projectName} with ${description} You need to write a clear and engaging project README.md file to introduce project users and highlight its key features and benefits.Write in markdown syntax.In your README description, make sure to cover the following points:Introduce Project and its purpose.Highlight key features.Describe benefits for developers.Outline potential use cases.Include installation and usage instructions.Remember to write concisely and use clear language to effectively communicate the project's value proposition and engage potential users.`,
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
