import express, { Request, Response, Router } from 'express';
import ChatGPTRepository from './repository/chatgpt-repository';
import GeminiRepository from './repository/gemini-repository';
import DataChunk from './model/datachunk';
import AIHttpClient from './ai-http-client';

const router: Router = express.Router();
let chatGPTCounter: number = 1000;
let geminiCounter: number = 1000;

router.get('/', (req: Request, res: Response) => {
  res.send('Lorem Ipsum');
});
router.get('/chatgpt/clear', (req: Request, res: Response) => {
  let chatGPTRepository = new ChatGPTRepository();
  chatGPTRepository.clear();
  chatGPTRepository.close();
  res.send('ChatGPT Cleared');
});
router.get('/gemini/clear', (req: Request, res: Response) => {
  let geminiRepository = new GeminiRepository();
  geminiRepository.clear();
  geminiRepository.close();
  res.send('Gemini Cleared');
});
router.post('/chatgpt', (req: Request, res: Response) => {
  chatGPTCounter++;
  let chatGPTRepository = new ChatGPTRepository();
  chatGPTRepository.init();
  let JSONBody = req.body;
  if (JSONBody.messages) {
    let chatGPTMessagesRole = new DataChunk(chatGPTCounter, 'messages[].role', JSONBody.messages.role);
    chatGPTRepository.save(chatGPTMessagesRole);
    let chatGPTMessagesContent = new DataChunk(chatGPTCounter, 'messages[].content', JSONBody.messages.content);
    chatGPTRepository.save(chatGPTMessagesContent);
  } 
  if (JSONBody.length === 0) {
    chatGPTRepository.findMessages()
      .then((chatGPTBody) => {
        let r = chatGPTBody.getBody(); 
        let aiHttpClient = new AIHttpClient('chatgpt');
        aiHttpClient.setBody(r);
        aiHttpClient.post()
          .then((response) => {res.send(response);})
          .catch((err) => {res.send(err);});
      })
      .then(() => {chatGPTRepository.close();})
      .catch((err) => {res.send(err);});
  }
});
router.post('/gemini', (req: Request, res: Response) => {
  geminiCounter++;
  let JSONBody = req.body;
  let geminiRepository = new GeminiRepository();
  geminiRepository.init();
  if(JSONBody.contents) {
    let geminiContentsRole = new DataChunk(geminiCounter, 'contents[].role', JSONBody.contents.role);
    geminiRepository.save(geminiContentsRole);
    let geminiContentsContent = new DataChunk(geminiCounter, 'contents[].text', JSONBody.contents.parts[0].text);
    geminiRepository.save(geminiContentsContent);
  }
  if (JSONBody.system_instruction) {
    let geminiSystemInstruction = new DataChunk(geminiCounter, 'system_instruction', JSONBody.system_instruction.parts.text);
    geminiRepository.save(geminiSystemInstruction);
  }
  if (JSONBody.length === 0) {
    geminiRepository.findContents()
      .then((geminiBody) => {
        let r = geminiBody.getBody();
        let aiHttpClient = new AIHttpClient('gemini');
        aiHttpClient.setBody(r);
        aiHttpClient.post()
          .then((response) => {res.send(response);})
          .catch((err) => {res.send(err);});
      })
      .then(() => {geminiRepository.close();})
      .catch((err) => {res.send(err);});
  }
});

export default router;
