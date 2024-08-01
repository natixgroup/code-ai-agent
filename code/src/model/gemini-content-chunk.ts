export default class GeminiContentChunk {
  id: number;
  role: string;
  text: string;
  constructor(id: number, role: string, text: string) {
    this.id = id;
    this.role = role;
    this.text = text;
    this.escapeSingleQuotes();
  }  
  private escapeSingleQuotes() {
    let t = this.text.replace(/'/g, "''");
    this.text = t;
  }
}
