import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit2, Trash2, Snowflake, Sun, X } from 'lucide-react';
import { studentAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import Button from '../components/Button';
import Badge from '../components/Badge';

interface Student {
  id: number;
  username: string;
  floor: number;
  isFrozen: boolean;
  frozenReason?: string;
}

export default function Students() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../lib/i18n').translations.uz) => getTranslation(language, key);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, formData);
      } else {
        await studentAPI.create(formData);
      }
      fetchStudents();
      setShowModal(false);
      setFormData({ username: '', floor: 1 });
      setEditingStudent(null);
    } catch (error) {
      alert('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Rostdan ham o\'chirmoqchimisiz?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents();
      } catch (error) {
        alert('Xatolik yuz berdi');
      }
    }
  };

  const handleFreeze = async (student: Student) => {
    const reason = prompt('Freeze sababi:');
    if (reason) {
      try {
        await studentAPI.freeze(student.id, reason);
        fetchStudents();
      } catch (error) {
        alert('Xatolik yuz berdi');
      }
    }
  };

  const handleUnfreeze = async (id: number) => {
    try {
      await studentAPI.unfreeze(id);
      fetchStudents();
    } catch (error) {
      alert('Xatolik yuz berdi');
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = floorFilter === 'all' || s.floor === floorFilter;
    return matchesSearch && matchesFloor;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Talabalar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Barcha talabalarni boshqarish
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          size="lg"
        >
          <Plus size={20} />
          Talaba Qo'shish
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
            />
          </div>

          {/* Floor Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="all">Barcha Qavatlar</option>
              <option value="1">1-qavat</option>
              <option value="2">2-qavat</option>
              <option value="3">3-qavat</option>
              <option value="4">4-qavat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white dark:bg-dark-surface rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {/* Avatar & Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
                <span className="text-2xl font-bold text-white">
                  {student.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {student.username}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{student.floor}-qavat</Badge>
                  <Badge variant={student.isFrozen ? 'error' : 'success'}>
                    {student.isFrozen ? 'Frozen' : 'Faol'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Frozen Reason */}
            {student.isFrozen && student.frozenReason && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
                  {student.frozenReason}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingStudent(student);
                  setFormData({ username: student.username, floor: student.floor });
                  setShowModal(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Tahrirlash
              </button>
              
              {student.isFrozen ? (
                <button
                  onClick={() => handleUnfreeze(student.id)}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                >
                  <Sun size={16} />
                  Unfreeze
                </button>
              ) : (
                <button
                  onClick={() => handleFreeze(student)}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                >
                  <Snowflake size={16} />
                  Freeze
                </button>
              )}
              
              <button
                onClick={() => handleDelete(student.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white dark:bg-dark-surface border-2 border-gray-900 rounded-3xl p-12 text-center shadow-3d-md">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Talabalar topilmadi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Filtrlarni o'zgartiring yoki yangi talaba qo'shing
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 max-w-md w-full border-2 border-gray-900 shadow-3d-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingStudent ? 'Talabani Tahrirlash' : 'Yangi Talaba'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingStudent(null);
                  setFormData({ username: '', floor: 1 });
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Qavat
                </label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value={1}>1-qavat</option>
                  <option value={2}>2-qavat</option>
                  <option value={3}>3-qavat</option>
                  <option value={4}>4-qavat</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                    setFormData({ username: '', floor: 1 });
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Saqlash
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
