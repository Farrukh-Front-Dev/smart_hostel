import { Edit2, Trash2, Snowflake, Sun, User, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { Peer } from '../types';
import { Language, getTranslation } from '@/lib/i18n';

interface PeersGridProps {
  peers: Peer[];
  onEdit: (peer: Peer) => void;
  onDelete: (peer: Peer) => void;
  onFreeze: (peer: Peer) => void;
  onUnfreeze: (peer: Peer) => void;
  language: Language;
}

export default function PeersGrid({
  peers,
  onEdit,
  onDelete,
  onFreeze,
  onUnfreeze,
  language,
}: PeersGridProps) {
  const [expandedPeerId, setExpandedPeerId] = useState<number | null>(null);
  const t = (key: string) => getTranslation(language, key as any);

  return (
    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
      {peers.map((peer) => (
        <div
          key={peer.id}
          className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border-2 border-gray-900 shadow-3d-md overflow-hidden"
        >
          {/* Compact Header */}
          <div className="p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center border-2 border-gray-900 shadow-3d-sm flex-shrink-0">
                <User size={16} className="text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate text-xs">
                    {peer.username}
                  </h3>
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded border border-blue-300 dark:border-blue-700 font-bold flex-shrink-0">
                    {peer.floor}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border font-bold flex-shrink-0 ${
                    peer.isFrozen
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700'
                  }`}>
                    {peer.isFrozen ? t('frozen') : t('active')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{peer.fullName || '-'}</p>
                {peer.room && <p className="text-xs text-gray-500 dark:text-gray-500">{peer.room}</p>}
              </div>
            </div>

            {/* 3-dot menu button */}
            <button
              onClick={() => setExpandedPeerId(expandedPeerId === peer.id ? null : peer.id)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              <MoreVertical size={18} className="text-gray-900 dark:text-white" />
            </button>
          </div>

          {/* Expanded Actions */}
          {expandedPeerId === peer.id && (
            <div className="border-t-2 border-gray-200 dark:border-gray-700 p-2 flex gap-1.5">
              <button
                onClick={() => {
                  onEdit(peer);
                  setExpandedPeerId(null);
                }}
                className="flex-1 p-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg border-2 border-gray-900 shadow-3d hover:shadow-3d-sm transition-all flex items-center justify-center"
                title={t('edit')}
              >
                <Edit2 size={16} />
              </button>

              {peer.isFrozen ? (
                <button
                  onClick={() => {
                    onUnfreeze(peer);
                    setExpandedPeerId(null);
                  }}
                  className="flex-1 p-1.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg border-2 border-gray-900 shadow-3d hover:shadow-3d-sm transition-all flex items-center justify-center"
                  title={t('unfreeze')}
                >
                  <Sun size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onFreeze(peer);
                    setExpandedPeerId(null);
                  }}
                  className="flex-1 p-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg border-2 border-gray-900 shadow-3d hover:shadow-3d-sm transition-all flex items-center justify-center"
                  title={t('freeze')}
                >
                  <Snowflake size={16} />
                </button>
              )}

              <button
                onClick={() => {
                  onDelete(peer);
                  setExpandedPeerId(null);
                }}
                className="flex-1 p-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg border-2 border-gray-900 shadow-3d hover:shadow-3d-sm transition-all flex items-center justify-center"
                title={t('delete')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
