import { Router, Request, Response } from 'express';
import { CPP_TOPICS, getAllCategories, getTopicById } from '../data/cppTopics.js';
import { getQuestionsByTopic } from '../data/questionBank.js';

const router = Router();

// List all 40 C++ topics
router.get('/', (_req: Request, res: Response): void => {
  const categories = getAllCategories();
  res.json({
    success: true,
    totalTopics: CPP_TOPICS.length,
    categories,
    topics: CPP_TOPICS
  });
});

// Get single topic by ID with sample questions count
router.get('/:id', (req: Request, res: Response): void => {
  const topic = getTopicById(String(req.params.id));
  if (!topic) {
    res.status(404).json({ success: false, error: 'Topic not found' });
    return;
  }

  const bankQuestions = getQuestionsByTopic(topic.id);
  res.json({
    success: true,
    topic,
    questionCount: bankQuestions.length,
    sampleQuestions: bankQuestions.map(q => ({
      id: q.id,
      question: q.question,
      difficulty: q.difficulty,
      maxMarks: q.maxMarks
    }))
  });
});

export default router;
