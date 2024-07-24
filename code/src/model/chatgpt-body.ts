export default class ChatGPTBody {
  private rows: any;
  private messages: any;
  constructor() {
    this.rows = [];
    this.messages= [];
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
    return {messages : this.messages, model : 'gpt-4-turbo'}
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

