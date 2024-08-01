export default class ChatGPTBody {
  private rows: any;
  private chunks: any;
  constructor() {
    this.rows = [];
    this.chunks= [];
  }

  appendUniquely(rows: any) {
    for (let i = 0; i < rows.length; i++) {
      if (this.rows.indexOf(rows[i]) === -1) {
        this.rows.push(rows[i]);
      }
    }
  }

  getBody() {
    this.parseChunks();
    return {
      messages : this.chunks, 
      model : 'gpt-4-turbo',
      temperature : 0.2,
      top_p : 0.1,
    }
  }

  private parseChunks(): void {
    for (let i = 0; i < this.rows.length; i++) {
      this.chunks.push({role: this.rows[i].role, content: this.rows[i].content});
    }
  }
}

