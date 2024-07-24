export default class GeminiDataChunk {
  id: number;
  path: string;
  value: string;
  constructor(id: number, path: string, value: string) {
    this.id= id;
    this.path= path;
    this.value = value;
    this.escapeSingleQuotes();
  }

  private escapeSingleQuotes() {
    this.value= this.value.replace(/'/g, "''");
  }
}

