import { Settings as SettingsIcon, Bell, Lock, User } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Account Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value="admin@smarthostel.com"
                disabled
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value="Admin User"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="primary">Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Email notifications', enabled: true },
              { label: 'Duty reminders', enabled: true },
              { label: 'Student updates', enabled: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.enabled}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Lock size={20} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Password</p>
                <p className="text-sm text-slate-600">Last changed 3 months ago</p>
              </div>
              <Button variant="secondary" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600">
                  <Badge variant="warning" size="sm">
                    Not Enabled
                  </Badge>
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <SettingsIcon size={20} className="text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">System Information</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Version</span>
              <span className="font-medium text-slate-900">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Last Updated</span>
              <span className="font-medium text-slate-900">March 12, 2026</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Status</span>
              <Badge variant="success" size="sm">
                Operational
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
