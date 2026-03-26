import { Edit2, Trash2, Snowflake, Sun, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Peer } from '../types';

interface PeersTableProps {
  peers: Peer[];
  onEdit: (peer: Peer) => void;
  onDelete: (peer: Peer) => void;
  onFreeze: (peer: Peer) => void;
  onUnfreeze: (peer: Peer) => void;
}

export default function PeersTable({
  peers,
  onEdit,
  onDelete,
  onFreeze,
  onUnfreeze,
}: PeersTableProps) {
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
            {peers.map((peer, index) => (
              <tr key={peer.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
                      <User size={20} className="text-black" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{peer.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="info">{peer.floor}-qavat</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={peer.isFrozen ? 'error' : 'success'}>
                    {peer.isFrozen ? 'Muzlatilgan' : 'Faol'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {peer.note || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(peer)}
                      className="p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
                      title="Tahrirlash"
                    >
                      <Edit2 size={18} />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Tahrirlash
                      </span>
                    </button>

                    {peer.isFrozen ? (
                      <button
                        onClick={() => onUnfreeze(peer)}
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
                        onClick={() => onFreeze(peer)}
                        className="p-3 bg-gradient-primary text-white rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative"
                        title="Muzlatish"
                      >
                        <Snowflake size={18} />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Muzlatish
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(peer)}
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
