import { Users } from 'lucide-react';

export default function StudentsEmpty() {
  return (
    <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm border-2 border-gray-900 rounded-3xl p-12 text-center shadow-3d-md">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Talabalar topilmadi
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Hozircha talabalar mavjud emas
      </p>
    </div>
  );
}
