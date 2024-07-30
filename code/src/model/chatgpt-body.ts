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
    this.chunks = this.parseChunks();
    return {
      messages : this.chunks, 
      model : 'gpt-4-turbo',
      temperature : 0.2,
      top_p : 0.1,
    }
  }

  private parseChunks(): any {
    let r: string = '';
    let c: string = '';
    for (let i = 0; i < this.rows.length; i++) {
      r = this.rows[i].value;
      i++;
      c = this.rows[i].value;
      this.chunks.push({role: r, content: c});
    }
    return this.chunks;
  }
}

