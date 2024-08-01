import express, { Request, Response, Router } from 'express';
import ChatGPTRepository from './repository/chatgpt-repository';
import ChatGPTMessageChunk from './model/chatgpt-message-chunk';
import GeminiRepository from './repository/gemini-repository';
import GeminiSystemInstructionChunk from './model/gemini-systeminstruction-chunk';
import GeminiContentChunk from './model/gemini-content-chunk';

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
  res.send({});
  res.end();
});
router.get('/gemini/clear', (req: Request, res: Response) => {
  let geminiRepository = new GeminiRepository();
  geminiRepository.clear();
  geminiRepository.close();
  res.send({});
  res.end();
});
router.post('/chatgpt', (req: Request, res: Response) => {
  chatGPTCounter++;
  let chatGPTRepository = new ChatGPTRepository();
  chatGPTRepository.init();
  let JSONBody = req.body;
  if (JSONBody.messages) {
    let chatGPTMessage = new ChatGPTMessageChunk(chatGPTCounter, JSONBody.messages.role, JSONBody.messages.content);
    chatGPTRepository.save(chatGPTMessage);
    res.send({});
    res.end();
  } 
  if (JSONBody.length === 0) {
    chatGPTRepository.findMessages()
      .then((chatGPTBody) => {
        let r = chatGPTBody.getBody(); 
        let aiHttpClient = new AIHttpClient('chatgpt');
        aiHttpClient.setBody(r);
        aiHttpClient.post()
          .then((response) => {res.send(response); res.end(); })
          .catch((err) => {res.send(err); res.end(); });
      })
      .then(() => {chatGPTRepository.close();})
      .catch((err) => {res.send(err); res.end();});
  }
});
router.post('/gemini', (req: Request, res: Response) => {
  geminiCounter++;
  let JSONBody = req.body;
  let geminiRepository = new GeminiRepository();
  geminiRepository.init();
  if(JSONBody.contents) {
    let geminiContent= new GeminiContentChunk(geminiCounter, JSONBody.contents.role, JSONBody.contents.parts[0].text);
    geminiRepository.save(geminiContent);
    res.send({});
    res.end();
  }
  if (JSONBody.system_instruction) {
    let geminiSystemInstruction = new GeminiSystemInstructionChunk(geminiCounter, JSONBody.system_instruction.parts.text);
    geminiRepository.save(geminiSystemInstruction);
    res.send({});
    res.end();
  }
  if (JSONBody.length === 0) {
    geminiRepository.findContents()
      .then((geminiBody) => {
        let r = geminiBody.getBody();
        let aiHttpClient = new AIHttpClient('gemini');
        aiHttpClient.setBody(r);
        aiHttpClient.post()
          .then((response) => {res.send(response); res.end();})
          .catch((err) => {res.send(err); res.end()});
      })
      .then(() => {geminiRepository.close();})
      .catch((err) => {res.send(err); res.end(); });
  }
});

export default router;
