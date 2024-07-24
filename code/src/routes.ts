import express, { Request, Response, Router } from 'express';
import ChatGPTRepository from './repository/chatgpt-repository';
import GeminiRepository from './repository/gemini-repository';
import ChatGPTDataChunk from './model/chatgpt-datachunk';
import GeminiDataChunk from './model/gemini-datachunk';
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
  // if the JSONBody has a "messages" key, then it is a ChatGPT message
  if (JSONBody.messages) {
    let chatGPTMessagesRole = new ChatGPTDataChunk(chatGPTCounter, 'messages[].role', JSONBody.messages.role);
    chatGPTRepository.save(chatGPTMessagesRole);
    let chatGPTMessagesContent = new ChatGPTDataChunk(chatGPTCounter, 'messages[].content', JSONBody.messages.content);
    chatGPTRepository.save(chatGPTMessagesContent);
  } 
  if (JSONBody.length === 0) {
    chatGPTRepository.findMessages()
      .then((chatGPTBody) => {
        let r = chatGPTBody.getContent(); 
        let aiHttpClient = new AIHttpClient('chatgpt');
        aiHttpClient.setBody(r);
        aiHttpClient.post()
          .then((response) => {res.send(response);})
          .catch((err) => {res.send(err);});
      })
      .catch((err) => {
        res.send(err);
      });
  }
});
router.post('/gemini', (req: Request, res: Response) => {
  geminiCounter++;
  let JSONBody = req.body;
  let geminiRepository = new GeminiRepository();
  geminiRepository.init();
  if(JSONBody.contents) {
    let geminiContentsRole = new GeminiDataChunk(geminiCounter, 'contents[].role', JSONBody.contents.role);
    geminiRepository.save(geminiContentsRole);
    let geminiContentsContent = new GeminiDataChunk(geminiCounter, 'contents[].text', JSONBody.contents.parts[0].text);
    geminiRepository.save(geminiContentsContent);
  }
  if (JSONBody.system_instruction) {
    let geminiSystemInstruction = new GeminiDataChunk(geminiCounter, 'system_instruction', JSONBody.system_instruction.parts.text);
    geminiRepository.save(geminiSystemInstruction);
  }
  if (JSONBody.length === 0) {
    geminiRepository.findContents()
      .then((geminiBody) => {
        let r = geminiBody.getContent();
        console.log('=================================');
        console.log('Gemini Body');
        console.log(r);
        let aiHttpClient = new AIHttpClient('gemini');
        aiHttpClient.setBody(r);
        aiHttpClient.post()
          .then((response) => {res.send(response);})
          .catch((err) => {res.send(err);});
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

export default router;
