import ChatGPTMessageChunk from '../model/chatgpt-message-chunk';
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
    this.db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER , role TEXT, content TEXT)');
    this.db.run('DELETE FROM messages');
  }
  // Method to save the ChatGPT messages
  save(data: ChatGPTMessageChunk) {
    this.db.exec(`INSERT INTO messages (id, role, content) VALUES (${data.id}, '${data.role}', '${data.content}')`); 
  }

  findMessages(){
    return new Promise<ChatGPTBody>((resolve, reject) => {
      let c = new ChatGPTBody();
      this.db.all('SELECT * FROM messages ORDER BY id ASC', (err, rows) => {
        if (err) {
          console.log(err);
          reject(new ChatGPTBody());
        } else {
          c.appendUniquely(rows);
          resolve(c);
        }
      });
    });
  } 
  init() {
    this.db.exec('CREATE TABLE IF NOT EXISTS messages (id INTEGER , role TEXT, content TEXT)');
  }
  close() {
    this.db.close();
  }
}
