import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema } from '../validators/taskValidators';

const router = Router();

router.use(requireAuth);

// NOTE: /stats/summary must be declared before the /:id route,
// otherwise Express would try to match "stats" as a task id.
router.get('/stats/summary', getTaskStats);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateBody(createTaskSchema), createTask);
router.put('/:id', validateBody(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
