import express, { Request, Response, Router } from 'express';
import  ChatGPTRepository from './repository/chatgpt-repository';
import ChatGPTDataChunk from './model/chatgpt-datachunk';
import ChatGPTBody from './model/chatgpt-body';

const router: Router = express.Router();
let  counter: number = 1000;

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
  res.send('Gemini Clear');
});
router.post('/chatgpt', (req: Request, res: Response) => {
  counter++;
  let chatGPTRepository = new ChatGPTRepository();
  chatGPTRepository.init();
  let JSONBody = req.body;
  // if the JSONBody has a "messages" key, then it is a ChatGPT message
  if (JSONBody.messages) {
    let chatGPTMessagesRole = new ChatGPTDataChunk(counter, 'messages[].role', JSONBody.messages.role);
    chatGPTRepository.save(chatGPTMessagesRole);
    let chatGPTMessagesContent = new ChatGPTDataChunk(counter, 'messages[].content', JSONBody.messages.content);
    chatGPTRepository.save(chatGPTMessagesContent);
  } 
  if (JSONBody.model) {
    let chatGPTMessagesModel = new ChatGPTDataChunk(counter, 'model', JSONBody.model);
    chatGPTRepository.save(chatGPTMessagesModel);
  }
  if (JSONBody.temperature) {
    // convert the temperature to a string
    let chatGPTMessagesTemperature = new ChatGPTDataChunk(counter, 'temperature', JSONBody.temperature.toString());
    chatGPTRepository.save(chatGPTMessagesTemperature);
  }
  if (JSONBody.top_p) {
    let chatGPTMessagesTopP = new ChatGPTDataChunk(counter, 'top_p', JSONBody.top_p.toString());
    chatGPTRepository.save(chatGPTMessagesTopP);
  }
  // if JSONBody is the empty array, then console.log the body
  if (JSONBody.length === 0) {
    console.log("Body vide");
  }
  chatGPTRepository.findMessages()
    .then((chatGPTBody) => {
      let r = chatGPTBody.getContent(); 
      console.log(r);
      res.send(r);
    })
    .catch((err) => {
      res.send(err);
    });
});
router.post('/gemini', (req: Request, res: Response) => {
  // console.log(req.body);
  // console.log('========================================')
  res.send('Gemini');
});

export default router;
