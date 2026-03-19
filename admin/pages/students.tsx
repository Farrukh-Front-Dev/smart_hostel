import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Lock, Unlock, Search } from 'lucide-react';
import { studentAPI } from '../lib/api';
import { getTranslation } from '../lib/i18n';
import { useLanguage } from './_app';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';

interface Student {
  id: number;
  username: string;
  floor: number;
  note?: string;
  isFrozen: boolean;
  frozenReason?: string;
}

export default function Students() {
  const { language } = useLanguage();
  const t = (key: keyof typeof import('../lib/i18n').translations.uz) => getTranslation(language, key);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ username: '', floor: 1, note: '' });

  useEffect(() => {
    fetchStudents();
  }, [selectedFloor]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll(selectedFloor || undefined);
      setStudents(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || t('failedToFetch'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await studentAPI.update(editingId, formData);
        setEditingId(null);
      } else {
        await studentAPI.create(formData);
      }
      setFormData({ username: '', floor: 1, note: '' });
      setShowModal(false);
      fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.error || t('failedToSave'));
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({ username: student.username, floor: student.floor, note: student.note || '' });
    setEditingId(student.id);
    setShowModal(true);
  };

  const handleFreeze = async (id: number) => {
    const reason = prompt(t('freezeReason'));
    if (!reason) return;
    try {
      await studentAPI.freeze(id, reason);
      fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.error || t('failedToFreeze'));
    }
  };

  const handleUnfreeze = async (id: number) => {
    try {
      await studentAPI.unfreeze(id);
      fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.error || t('failedToUnfreeze'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('areYouSure'))) return;
    try {
      await studentAPI.delete(id);
      fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.error || t('failedToDelete'));
    }
  };

  const filteredStudents = students.filter((s) =>
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'username', label: t('nickname'), sortable: true },
    { key: 'floor', label: t('floor'), sortable: true },
    { key: 'note', label: t('note'), sortable: false },
    {
      key: 'isFrozen',
      label: t('status'),
      render: (value: boolean) => (
        <Badge variant={value ? 'danger' : 'success'}>
          {value ? t('frozen') : t('active')}
        </Badge>
      ),
    },
    {
      key: 'id',
      label: t('actions'),
      render: (id: number, row: Student) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-blue-600"
          >
            <Edit2 size={16} />
          </button>
          {row.isFrozen ? (
            <button
              onClick={() => handleUnfreeze(id)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-green-600"
            >
              <Unlock size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleFreeze(id)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-orange-600"
            >
              <Lock size={16} />
            </button>
          )}
          <button
            onClick={() => handleDelete(id)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('students')}</h1>
          <p className="text-slate-600 mt-1">Manage all students and their assignments</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setEditingId(null);
            setFormData({ username: '', floor: 1, note: '' });
            setShowModal(true);
          }}
        >
          {t('addStudent')}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Floor Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFloor(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFloor === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            All
          </button>
          {[1, 2, 3, 4].map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedFloor === floor
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {t('floor')} {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredStudents} loading={loading} />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? t('updateStudent') : t('addStudent')}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('nickname')} *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('floor')} *
            </label>
            <select
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map((f) => (
                <option key={f} value={f}>
                  {t('floor')} {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('note')}
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? t('updateStudent') : t('addStudent')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
