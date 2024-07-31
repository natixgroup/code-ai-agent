// In the post() method, we are sending a POST request to the API endpoint with the body and token.
// We are waiting for the response and returning the data.
// Propose a modified version of the post() method that:
// - Sends a POST request to the this.url endpoint, as it is now.
// - Wait for the response
// - Calculate the size of the response data in bytes
// - Set the content-length header in the response headers with the size of the response data
// - Return the response
import axios from 'axios';

export default class AIHttpClient {
  private provider: string;
  private url: string;
  private debugUrl: string;
  private body: object;
  private token: string;
  private tokenHeaderName: string;
  private tokenHeaderValue: string;

  constructor(provider: string) {
    this.provider = provider;
    this.body = {};
    this.url = '';
    this.debugUrl = '';
    this.token = '';
    this.tokenHeaderName = '';
    this.tokenHeaderValue = '';
    if (this.provider === 'chatgpt') {
      this.url = 'https://api.openai.com/v1/chat/completions';
      this.debugUrl = 'https://eowloffrpvxwtqp.m.pipedream.net/v1/chat/completions'
      this.token = process.env.OPENAI_API_KEY? process.env.OPENAI_API_KEY : '';
      this.tokenHeaderName = 'Authorization';
      this.tokenHeaderValue = `Bearer ${this.token}`;
    } 
    if (this.provider === 'gemini') {
      this.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent'
      this.debugUrl = 'https://eowloffrpvxwtqp.m.pipedream.net/v1beta/models/gemini-1.5-pro-latest:generateContent'
      this.token = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : '';
      this.tokenHeaderName = 'x-goog-api-key';
      this.tokenHeaderValue = this.token;
    }
  }

  setBody(body: object) {
    this.body = body;
  }

  async post(): Promise<any> {
    try {
      axios.defaults.headers.common[this.tokenHeaderName] = this.tokenHeaderValue;
      axios.post(this.debugUrl, this.body);
      const response = await axios.post(this.url, this.body);
      // Calculate the size of the response data in bytes
      const dataSizeInBytes = Buffer.byteLength(JSON.stringify(response.data), 'utf8');
      // Set the content-length header
      response.headers['content-length'] = dataSizeInBytes;
      console.log(response.data);
      return response;
    } catch (error) {
      console.error(`${this.provider} in catch: ${error}`);
      throw error; 
    }
  }
}
