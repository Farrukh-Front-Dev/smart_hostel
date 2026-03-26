import { useState, useEffect } from 'react';
import { studentAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import Button from '../components/ui/Button';
import StudentsHeader from '../components/features/students/StudentsHeader';
import StudentsFilters from '../components/features/students/StudentsFilters';
import StudentsTable from '../components/features/students/StudentsTable';
import StudentsGrid from '../components/features/students/StudentsGrid';
import StudentsModal from '../components/features/students/StudentsModal';
import StudentsEmpty from '../components/features/students/StudentsEmpty';

interface Student {
  id: number;
  username: string;
  floor: number;
  isFrozen: boolean;
  frozenReason?: string;
  note?: string;
}

export default function Students() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [freezingStudent, setFreezingStudent] = useState<Student | null>(null);
  const [shouldFreezeAfterSave, setShouldFreezeAfterSave] = useState(false);
  const [formData, setFormData] = useState({ username: '', floor: 1, freezeReason: '', note: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error:', error);
      addToast('Peerlarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Edit mode
        await studentAPI.update(editingStudent.id, { username: formData.username, floor: formData.floor, note: formData.note });
        addToast('Peer muvaffaqiyatli yangilandi', 'success');
        
        // If shouldFreezeAfterSave is true, freeze the student
        if (shouldFreezeAfterSave) {
          await studentAPI.freeze(editingStudent.id, formData.note);
          addToast('Peer muvaffaqiyatli muzlatildi', 'success');
          setShouldFreezeAfterSave(false);
        }
      } else {
        // Create mode
        await studentAPI.create({ username: formData.username, floor: formData.floor, note: formData.note });
        addToast('Peer muvaffaqiyatli qo\'shildi', 'success');
      }
      fetchStudents();
      setShowModal(false);
      setFormData({ username: '', floor: 1, freezeReason: '', note: '' });
      setEditingStudent(null);
    } catch (error) {
      addToast(t('failedToSave'), 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setStudentToDelete(student);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setDeleting(true);
      await studentAPI.delete(studentToDelete.id);
      addToast('Peer muvaffaqiyatli o\'chirildi', 'success');
      fetchStudents();
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      addToast(t('failedToDelete'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleFreeze = async (student: Student) => {
    setEditingStudent(student);
    setShouldFreezeAfterSave(true);
    setFormData({ username: student.username, floor: student.floor, freezeReason: '', note: student.note || '' });
    setShowModal(true);
  };

  const handleUnfreeze = async (id: number) => {
    try {
      await studentAPI.unfreeze(id);
      addToast('Peer muvaffaqiyatli faollashtirild', 'success');
      fetchStudents();
    } catch (error) {
      addToast(t('failedToUnfreeze'), 'error');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ username: student.username, floor: student.floor, freezeReason: '', note: student.note || '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFreezingStudent(null);
    setShouldFreezeAfterSave(false);
    setFormData({ username: '', floor: 1, freezeReason: '', note: '' });
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = floorFilter === 'all' || s.floor === floorFilter;
    return matchesSearch && matchesFloor;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-cyan border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <StudentsHeader
        title={t('students')}
        description={t('manageStudents')}
      />

      {/* Filters */}
      <StudentsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        floorFilter={floorFilter}
        onFloorChange={setFloorFilter}
        onAddClick={() => setShowModal(true)}
      />

      {/* Table (Desktop) */}
      {filteredStudents.length > 0 ? (
        <>
          <StudentsTable
            students={filteredStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFreeze={handleFreeze}
            onUnfreeze={handleUnfreeze}
          />

          {/* Grid (Mobile/Tablet) */}
          <StudentsGrid
            students={filteredStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFreeze={handleFreeze}
            onUnfreeze={handleUnfreeze}
          />
        </>
      ) : (
        <StudentsEmpty />
      )}

      {/* Modal */}
      <StudentsModal
        isOpen={showModal}
        title={freezingStudent ? 'Peerni muzlatish' : (editingStudent ? t('updateStudent') : t('newStudent'))}
        username={formData.username}
        floor={formData.floor}
        note={formData.note}
        isFreezeMode={!!freezingStudent}
        onUsernameChange={(value) => setFormData({ ...formData, username: value })}
        onFloorChange={(value) => setFormData({ ...formData, floor: value })}
        onNoteChange={(value) => setFormData({ ...formData, note: value })}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setStudentToDelete(null);
        }}
        title="Peerni o'chirish"
        size="sm"
        variant="danger"
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-white">
            Siz <span className="font-bold">{studentToDelete?.username}</span> peerni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setStudentToDelete(null);
              }}
              variant="ghost"
              className="flex-1"
              disabled={deleting}
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              variant="danger"
              className="flex-1"
              loading={deleting}
            >
              O'chirish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
