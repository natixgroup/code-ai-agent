import axios from 'axios';

export default class AIHttpClient {
  private provider: string;
  private url: string;
  private body: object;
  private token: string;
  private tokenHeaderName: string;
  private tokenHeaderValue: string;

  constructor(provider: string) {
    this.provider = provider;
    this.body = {};
    this.url = '';
    this.token = '';
    this.tokenHeaderName = '';
    this.tokenHeaderValue = '';
    if (this.provider === 'chatgpt') {
      this.url = 'https://api.openai.com/v1/chat/completions';
      this.token = process.env.OPENAI_API_KEY? process.env.OPENAI_API_KEY : '';
      this.tokenHeaderName = 'Authorization';
      this.tokenHeaderValue = `Bearer ${this.token}`;
    } 
    if (this.provider === 'gemini') {
      this.url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent'
      // this.url = 'https://eowloffrpvxwtqp.m.pipedream.net/v1beta/models/gemini-1.5-pro-latest:generateContent'
      this.token = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : '';
      this.tokenHeaderName = 'x-goog-api-key';
      this.tokenHeaderValue = this.token;
    }
  }

  setBody(body: object) {
    this.body = body;
  }

  post(): Promise<any> {
    axios.defaults.headers.common[this.tokenHeaderName] = this.tokenHeaderValue;
    return axios.post(this.url, this.body)
      .then((response) => {
        console.log('+++++++++++++++++ in then:')
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log('in catch:' + error);
      });
  }
}
