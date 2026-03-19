import express from 'express';
import { StudentService } from '../services/studentService';

const router = express.Router();

// Get all students
router.get('/', async (req, res, next) => {
  try {
    const floor = req.query.floor ? parseInt(req.query.floor as string) : undefined;
    const students = await StudentService.getAllStudents(floor);
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// Get student by ID
router.get('/:id', async (req, res, next) => {
  try {
    const student = await StudentService.getStudentById(parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Create student
router.post('/', async (req, res, next) => {
  try {
    const { username, floor, note } = req.body;

    if (!username || !floor) {
      return res.status(400).json({ error: 'Missing required fields: username, floor' });
    }

    const student = await StudentService.createStudent({
      username,
      floor: parseInt(floor),
      note,
    });

    res.status(201).json(student);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    next(error);
  }
});

// Update student
router.put('/:id', async (req, res, next) => {
  try {
    const student = await StudentService.updateStudent(parseInt(req.params.id), req.body);
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Freeze student
router.post('/:id/freeze', async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Reason is required' });
    }

    const student = await StudentService.freezeStudent(parseInt(req.params.id), reason);
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Unfreeze student
router.post('/:id/unfreeze', async (req, res, next) => {
  try {
    const student = await StudentService.unfreezeStudent(parseInt(req.params.id));
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Delete student
router.delete('/:id', async (req, res, next) => {
  try {
    await StudentService.deleteStudent(parseInt(req.params.id));
    res.json({ message: 'Student deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
