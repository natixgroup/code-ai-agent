import ChatGPTDataChunk from '../model/chatgpt-datachunk';
import ChatGPTBody from '../model/chatgpt-body';
import { Database } from 'sqlite3';

export default class ChatGPTRepository {
  private db: Database;
  // Constructor
  constructor() {
    this.db = new Database('/tmp/chatgpt.sqlite');
  }
  // Method to clear the ChatGPT messages
  clear() {
    this.db.exec('CREATE TABLE IF NOT EXISTS data (id INTEGER , path TEXT, value TEXT)');
    this.db.run('DELETE FROM data');
  }
  // Method to save the ChatGPT messages
  save(data: ChatGPTDataChunk) {
    this.db.exec(`INSERT INTO data (id, path, value) VALUES (${data.id}, '${data.path}', '${data.value}')`); 
  }

  // look for rows having "messages" in the path and group them by id
  findMessages(){
    return new Promise<ChatGPTBody>((resolve, reject) => {
      this.db.all('SELECT * FROM data WHERE path LIKE "messages%" ORDER BY id', (err, rows) => {
        if (err) {
          reject(new ChatGPTBody());
        } else {
          let c = new ChatGPTBody();
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
