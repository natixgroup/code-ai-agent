export default class GeminiBody {
  private rows: any;
  private chunks: any;
  private systemInstruction: string;

  constructor() {
    this.rows = [];
    this.chunks= [];
    this.systemInstruction = '';
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
      system_instruction: { parts : { text : this.systemInstruction}},
      contents: this.chunks
    }
  }
  getSystemInstruction() {
    return this.systemInstruction;
  }

  private parseChunks(): any {
    let r: string = '';
    let t: string = '';
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].path === 'system_instruction') {
        this.systemInstruction = this.rows[i].value;
        continue;
      } else {
        r = this.rows[i].value;
        i++;
        t = this.rows[i].value;
        this.chunks.push({role: r, parts:[{text:t}] });
      }
    }
    return this.chunks;
  }
}

