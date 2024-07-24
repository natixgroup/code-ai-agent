import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Lorem Ipsum');
});
router.post('/gemini', (req: Request, res: Response) => {
  console.log(req.body);
  res.send('Gemini');
});

export default router;
