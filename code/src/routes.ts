import express, { Request, Response, Router } from 'express';
import  ChatGPTRepository from './repository/chatgpt-repository';
const router: Router = express.Router();

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
  console.log(req.body);
  let chatGPTRepository = new ChatGPTRepository();
  let JSONBody = JSON.parse(req.body);
  // if the JSONBody has a "messages" key, then it is a ChatGPT message
  if (JSONBody.messages) {
    chatGPTRepository.save(JSONBody.messages);
  }
  chatGPTRepository.close();
  res.send('ChatGPT');
});
router.post('/gemini', (req: Request, res: Response) => {
  console.log(req.body);
  console.log('========================================')
  res.send('Gemini');
});

export default router;
