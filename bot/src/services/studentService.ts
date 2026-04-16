import axios from 'axios';
import { BACKEND_URL } from '../config/constants';
import { Student } from '../types';

export class StudentService {
  static async findByUsername(username: string): Promise<Student | null> {
    try {
      const response = await axios.get<Student[]>(`${BACKEND_URL}/api/students`);
      const students = response.data;
      
      const student = students.find((s) => 
        s.username.toLowerCase() === username.toLowerCase()
      );
      
      return student || null;
    } catch (error) {
      console.error('[StudentService] Error finding student:', error);
      throw error;
    }
  }
}
