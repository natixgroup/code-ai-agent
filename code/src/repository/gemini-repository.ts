import GeminiContentChunk from '../model/gemini-content-chunk';
import GeminiSystemInstructionChunk from '../model/gemini-systeminstruction-chunk'
import GeminiBody from '../model/gemini-body';
import { Database } from 'sqlite3';

export default class GeminiRepository {
  private db: Database;
  // Constructor
  constructor() {
    this.db = new Database('/tmp/gemini.sqlite');
  }
  clear() {
    this.db.exec('CREATE TABLE IF NOT EXISTS contents (id INTEGER , role TEXT, text TEXT)');
    this.db.run('DELETE FROM contents');
    this.db.exec('CREATE TABLE IF NOT EXISTS system_instruction (id INTEGER, text TEXT)');
    this.db.run('DELETE FROM system_instruction');
  }
  save(data: GeminiContentChunk|GeminiSystemInstructionChunk) {
    if (data instanceof GeminiContentChunk) {
      this.db.exec(`INSERT INTO contents (id, role, text) VALUES (${data.id}, '${data.role}', '${data.text}')`); 
    }
    if (data instanceof GeminiSystemInstructionChunk) {
      this.db.exec(`INSERT INTO system_instruction (id, text) VALUES (${data.id}, '${data.text}')`); 
    }
  }

  findContents(){
    return new Promise<GeminiBody>((resolve, reject) => {
      let c = new GeminiBody();
      this.db.all('SELECT * FROM contents ORDER BY id ASC', (err1, rows1) => {
        if (err1) {
          reject(c);
        } else {
          c.appendUniquely(rows1);
          this.db.all('SELECT * FROM system_instruction ORDER BY id ASC', (err2, rows2) => {
            if (err2) {
              reject(c);
            } else {
              c.appendUniquely(rows2);
              resolve(c);
            }
          });
        }
      });
    });
  } 

  init() {
    this.db.exec('CREATE TABLE IF NOT EXISTS contents (id INTEGER , role TEXT, text TEXT)');
    this.db.exec('CREATE TABLE IF NOT EXISTS system_instruction (id INTEGER, text TEXT)');
  }
  close() {
    this.db.close();
  }
}
