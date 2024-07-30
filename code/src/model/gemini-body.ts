export default class GeminiBody {
  private rows: any;
  private chunks: any;
  private systemInstruction: string;

  private sexuallyExplicit = { category : 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold : 'BLOCK_NONE' }; 
  private hateSpeech       = { category : 'HARM_CATEGORY_HATE_SPEECH',       threshold : 'BLOCK_NONE' };
  private harassment       = { category : 'HARM_CATEGORY_HARASSMENT',        threshold : 'BLOCK_NONE' };
  private dangerousContent = { category : 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold : 'BLOCK_NONE' };
  private safetySettings   = [this.sexuallyExplicit, this.hateSpeech, this.harassment, this.dangerousContent];
  private generationConfig = {temperature : 0.2, topP : 0.5}

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
      contents: this.chunks,
      safetySettings: this.safetySettings,
      generationConfig: this.generationConfig
    }
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

