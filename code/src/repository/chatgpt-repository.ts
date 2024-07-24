import ChatGPTMessages from '../model/chatgpt-messages';
import { Database } from 'sqlite3';

export default class ChatGPTRepository {
  private db: Database;
  // Constructor
  constructor() {
    this.db = new Database('/tmp/chatgpt.sqlite');
    console.log('Instanciated ChatGPTRepository');
    console.log('========================================');
  }
  // Method to clear the ChatGPT messages
  clear() {
    this.db.exec('DELETE FROM data');
    console.log('Cleared ChatGPT messages');
    console.log('========================================');
  }
  // Method to save the ChatGPT messages
  save(chatGPTMessages: ChatGPTMessages) {
   this.db.exec(`INSERT INTO data (role, content) VALUES ('${chatGPTMessages.role}', '${chatGPTMessages.content}')`); 
  }
  
  init() {
    this.db.exec('CREATE TABLE IF NOT EXISTS data (id INTEGER AUTOINCREMENT, role TEXT, content TEXT)');
    this.clear();
  }
  close() {
    this.db.close();
  }
}
