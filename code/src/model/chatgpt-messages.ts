// Class definition: ChatGPTMessages
// Based on the JSON {    role: 'assistant',    content: 'What is the content of `lua/ai/chatgpt/query.lua` ?'}

export default class ChatGPTMessages {
  // Constructor
  constructor(requestBody: string) {
    // Parse the JSON
    const json = JSON.parse(requestBody);
    this.role = json.role;
    this.content = json.content;
    console.log(`Instanciated ChatGPTMessages with role: ${this.role} and content: ${this.content}`);
    console.log('========================================');
  }
  role: string;
  content: string;
}

