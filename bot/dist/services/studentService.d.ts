import { Student } from '../types';
export declare class StudentService {
    static findByUsername(username: string): Promise<Student | null>;
}
