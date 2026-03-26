import { Edit2, Trash2, Snowflake, Sun, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Peer } from '../types';

interface PeersGridProps {
  peers: Peer[];
  onEdit: (peer: Peer) => void;
  onDelete: (peer: Peer) => void;
  onFreeze: (peer: Peer) => void;
  onUnfreeze: (peer: Peer) => void;
}

export default function PeersGrid({
  peers,
  onEdit,
  onDelete,
  onFreeze,
  onUnfreeze,
}: PeersGridProps) {
  return (
    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
      {peers.map((peer) => (
        <div
          key={peer.id}
          className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md hover:shadow-3d-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {/* Avatar & Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d-sm">
              <User size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {peer.username}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="info">{peer.floor}-qavat</Badge>
                <Badge variant={peer.isFrozen ? 'error' : 'success'}>
                  {peer.isFrozen ? 'Muzlatilgan' : 'Faol'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Frozen Reason */}
          {peer.isFrozen && peer.frozenReason && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
                {peer.frozenReason}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(peer)}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
            >
              <Edit2 size={16} />
              Tahrirlash
            </button>

            {peer.isFrozen ? (
              <button
                onClick={() => onUnfreeze(peer)}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                <Sun size={16} />
                Bekor qilish
              </button>
            ) : (
              <button
                onClick={() => onFreeze(peer)}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                <Snowflake size={16} />
                Muzlatish
              </button>
            )}

            <button
              onClick={() => onDelete(peer)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-3d hover:shadow-3d-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
