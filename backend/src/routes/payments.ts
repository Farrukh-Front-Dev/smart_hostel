import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireObjectId } from '../utils/objectId';

const router = express.Router();
const prisma = new PrismaClient();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const { status, month, studentId } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (month) where.month = month;
    if (studentId) where.studentId = requireObjectId(studentId, 'studentId');

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            username: true,
            fullName: true,
            room: true,
            floor: true,
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    res.json(payments);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id: requireObjectId(id) },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            fullName: true,
            room: true,
            floor: true,
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error: any) {
    console.error('Error fetching payment:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  try {
    const { studentId, amount, month, imageUrl, status, note } = req.body;

    if (!studentId || !month) {
      return res.status(400).json({ error: 'studentId and month are required' });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: requireObjectId(studentId, 'studentId'),
        amount: parseFloat(amount) || 0,
        month,
        imageUrl,
        status: status || 'pending',
        note
      },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            fullName: true,
            room: true,
            floor: true,
          }
        }
      }
    });

    res.status(201).json(payment);
  } catch (error: any) {
    console.error('Error creating payment:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Update payment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, note } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const payment = await prisma.payment.update({
      where: { id: requireObjectId(id) },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy,
        note: note || undefined
      },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            fullName: true,
            room: true,
            floor: true,
          }
        }
      }
    });

    res.json(payment);
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.payment.delete({
      where: { id: requireObjectId(id) }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
