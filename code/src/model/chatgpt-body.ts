import ChatGPTDataChunk from './chatgpt-datachunk';
export default class ChatGPTBody {
  private rows: any;
  private messages: any;
  private content: string;
  constructor() {
    this.rows = [];
    this.messages= [];
    this.content = '';
  }

  appendUniquely(rows: any) {
    for (let i = 0; i < rows.length; i++) {
      if (this.rows.indexOf(rows[i]) === -1) {
        this.rows.push(rows[i]);
      }
    }
  }

  getContent() {
    this.messages = this.parseMessages();
    this.content = JSON.stringify(this.messages);
    return this.content;
  }

  private parseMessages(): any {
    let r: string = '';
    let c: string = '';
    for (let i = 0; i < this.rows.length; i++) {
      r = this.rows[i].value;
      i++;
      c = this.rows[i].value;
      this.messages.push({role: r, content: c});
    }
    return this.messages;
  }
}

