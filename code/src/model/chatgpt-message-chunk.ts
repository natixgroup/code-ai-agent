export default class ChatGPTMessageChunk {
  id: number;
  role: string;
  content: string;
  constructor(id: number, role: string, content: string) {
    this.id = id;
    this.role = role;
    this.content = content;
    this.escapeSingleQuotes();
  }
private escapeSingleQuotes() {
  let content = this.content.replace(/'/g, "''");
  this.content = content;
  }
}
