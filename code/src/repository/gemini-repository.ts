import GeminiDataChunk from '../model/gemini-datachunk';
import GeminiBody from '../model/gemini-body';
import { Database } from 'sqlite3';

export default class GeminiRepository {
  private db: Database;
  // Constructor
  constructor() {
    this.db = new Database('/tmp/gemini.sqlite');
  }
  // Method to clear the ChatGPT messages
  clear() {
    this.db.exec('CREATE TABLE IF NOT EXISTS data (id INTEGER , path TEXT, value TEXT)');
    this.db.run('DELETE FROM data');
  }
  // Method to save the ChatGPT messages
  save(data: GeminiDataChunk) {
    this.db.exec(`INSERT INTO data (id, path, value) VALUES (${data.id}, '${data.path}', '${data.value}')`); 
  }

  // look for rows having "messages" in the path and group them by id
  findContents(){
    return new Promise<GeminiBody>((resolve, reject) => {
      this.db.all('SELECT * FROM data ORDER BY id', (err, rows) => {
        if (err) {
          reject(new GeminiBody());
        } else {
          let c = new GeminiBody();
          c.appendUniquely(rows);
          resolve(c);
        }
      });
    });
  } 
  init() {
    this.db.exec('CREATE TABLE IF NOT EXISTS data (id INTEGER , path TEXT, value TEXT)');
  }
  close() {
    this.db.close();
  }
}
