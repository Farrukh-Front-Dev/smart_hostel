import { useState, useEffect } from 'react';
import { studentAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import { useToast } from '../components/common/Toast';
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
}

export default function Students() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const t = (key: any) => getTranslation(language, key as keyof typeof import('../lib/i18n').translations.uz);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ username: '', floor: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');

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
      addToast('Talabalarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, formData);
        addToast('Talaba muvaffaqiyatli yangilandi', 'success');
      } else {
        await studentAPI.create(formData);
        addToast('Talaba muvaffaqiyatli qo\'shildi', 'success');
      }
      fetchStudents();
      setShowModal(false);
      setFormData({ username: '', floor: 1 });
      setEditingStudent(null);
    } catch (error) {
      addToast(t('failedToSave'), 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(t('areYouSure'))) {
      try {
        await studentAPI.delete(id);
        addToast('Talaba muvaffaqiyatli o\'chirildi', 'success');
        fetchStudents();
      } catch (error) {
        addToast(t('failedToDelete'), 'error');
      }
    }
  };

  const handleFreeze = async (student: Student) => {
    const reason = prompt(t('freezeReason'));
    if (reason) {
      try {
        await studentAPI.freeze(student.id, reason);
        addToast('Talaba muvaffaqiyatli muzlatildi', 'success');
        fetchStudents();
      } catch (error) {
        addToast(t('failedToFreeze'), 'error');
      }
    }
  };

  const handleUnfreeze = async (id: number) => {
    try {
      await studentAPI.unfreeze(id);
      addToast('Talaba muvaffaqiyatli faollashtirild', 'success');
      fetchStudents();
    } catch (error) {
      addToast(t('failedToUnfreeze'), 'error');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ username: student.username, floor: student.floor });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ username: '', floor: 1 });
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
        title={editingStudent ? t('updateStudent') : t('newStudent')}
        username={formData.username}
        floor={formData.floor}
        onUsernameChange={(value) => setFormData({ ...formData, username: value })}
        onFloorChange={(value) => setFormData({ ...formData, floor: value })}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />
    </div>
  );
}
