"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentService_1 = require("../services/studentService");
const router = express_1.default.Router();
// Get all students
router.get('/', async (req, res, next) => {
    try {
        const floor = req.query.floor ? parseInt(req.query.floor) : undefined;
        const students = await studentService_1.StudentService.getAllStudents(floor);
        res.json(students);
    }
    catch (error) {
        next(error);
    }
});
// Get student by ID
router.get('/:id', async (req, res, next) => {
    try {
        const student = await studentService_1.StudentService.getStudentById(parseInt(req.params.id));
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    }
    catch (error) {
        next(error);
    }
});
// Create student
router.post('/', async (req, res, next) => {
    try {
        const { username, floor, room, fullName, note } = req.body;
        if (!username || !floor) {
            return res.status(400).json({ error: 'Missing required fields: username, floor' });
        }
        const student = await studentService_1.StudentService.createStudent({
            username,
            floor: parseInt(floor),
            room,
            fullName,
            note,
        });
        res.status(201).json(student);
    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        next(error);
    }
});
// Update student
router.put('/:id', async (req, res, next) => {
    try {
        const student = await studentService_1.StudentService.updateStudent(parseInt(req.params.id), req.body);
        res.json(student);
    }
    catch (error) {
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
        const student = await studentService_1.StudentService.freezeStudent(parseInt(req.params.id), reason);
        res.json(student);
    }
    catch (error) {
        next(error);
    }
});
// Unfreeze student
router.post('/:id/unfreeze', async (req, res, next) => {
    try {
        const student = await studentService_1.StudentService.unfreezeStudent(parseInt(req.params.id));
        res.json(student);
    }
    catch (error) {
        next(error);
    }
});
// Delete student
router.delete('/:id', async (req, res, next) => {
    try {
        await studentService_1.StudentService.deleteStudent(parseInt(req.params.id));
        res.json({ message: 'Student deleted' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=students.js.map