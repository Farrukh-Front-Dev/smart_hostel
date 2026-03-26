import { Edit2, Trash2, Snowflake, Sun, User } from 'lucide-react';
import Badge from '../../ui/Badge';

interface Student {
  id: number;
  username: string;
  floor: number;
  isFrozen: boolean;
  frozenReason?: string;
  note?: string;
}

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onFreeze: (student: Student) => void;
  onUnfreeze: (id: number) => void;
}

export default function StudentsTable({
  students,
  onEdit,
  onDelete,
  onFreeze,
  onUnfreeze,
}: StudentsTableProps) {
  return (
    <div className="hidden lg:block bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl border-2 border-gray-900 shadow-3d-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white w-12">#</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Ism</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Qavat</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Holati</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Izoh</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
                      <User size={20} className="text-black" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{student.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="info">{student.floor}-qavat</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={student.isFrozen ? 'error' : 'success'}>
                    {student.isFrozen ? 'Muzlatilgan' : 'Faol'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {student.note || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(student)}
                      className="p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
                      title="Tahrirlash"
                    >
                      <Edit2 size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Tahrirlash
                      </span>
                    </button>

                    {/* Freeze/Unfreeze Button */}
                    {student.isFrozen ? (
                      <button
                        onClick={() => onUnfreeze(student.id)}
                        className="p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
                        title="Muzlatishni bekor qilish"
                      >
                        <Sun size={18} />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Faollashtirish
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onFreeze(student)}
                        className="p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
                        title="Muzlatish"
                      >
                        <Snowflake size={18} />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Muzlatish
                        </span>
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
                      title="O'chirish"
                    >
                      <Trash2 size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        O'chirish
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
