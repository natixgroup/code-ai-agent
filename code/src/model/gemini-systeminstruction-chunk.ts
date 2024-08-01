export default class GeminiSystemInstructionChunk {
  id: number;
  text: string;
  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
    this.escapeSingleQuotes();
  }  
  private escapeSingleQuotes() {
    let t = this.text.replace(/'/g, "''");
    this.text = t;
  }
}
