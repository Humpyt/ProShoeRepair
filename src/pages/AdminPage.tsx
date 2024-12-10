import React, { useState } from 'react';
import { Users, Shield, Settings, FileText, ChevronRight, Search, Plus, Edit2, Trash2, X, Download } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { format } from 'date-fns';
import type { User, Role, Permission } from '../types/admin';

type AdminSection = 'users' | 'roles' | 'settings' | 'audit';

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('users');

  const sections = [
    { id: 'users' as AdminSection, name: 'User Management', icon: Users },
    { id: 'roles' as AdminSection, name: 'Roles & Permissions', icon: Shield },
    { id: 'settings' as AdminSection, name: 'System Settings', icon: Settings },
    { id: 'audit' as AdminSection, name: 'Audit Logs', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <RolesPermissions />;
      case 'settings':
        return <SystemSettings />;
      case 'audit':
        return <AuditLogs />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-400">Admin Dashboard</h1>
        <p className="text-gray-400">Manage system settings and user access</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${activeSection === section.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <section.icon className="h-5 w-5" />
                <span>{section.name}</span>
                {activeSection === section.id && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-4 bg-gray-800 rounded-lg p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// User Management Section
const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Staff',
    status: 'active'
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      addUser(newUser as Omit<User, 'id' | 'createdAt'>);
      setNewUser({ name: '', email: '', role: 'Staff', status: 'active' });
      setShowAddModal(false);
    }
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const UserModal: React.FC<{ isEdit?: boolean }> = ({ isEdit }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h3>
          <button
            onClick={() => isEdit ? setEditingUser(null) : setShowAddModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={isEdit ? editingUser?.name : newUser.name}
              onChange={(e) => isEdit 
                ? setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)
                : setNewUser(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={isEdit ? editingUser?.email : newUser.email}
              onChange={(e) => isEdit
                ? setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)
                : setNewUser(prev => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select
              value={isEdit ? editingUser?.role : newUser.role}
              onChange={(e) => isEdit
                ? setEditingUser(prev => prev ? { ...prev, role: e.target.value } : null)
                : setNewUser(prev => ({ ...prev, role: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              value={isEdit ? editingUser?.status : newUser.status}
              onChange={(e) => isEdit
                ? setEditingUser(prev => prev ? { ...prev, status: e.target.value } : null)
                : setNewUser(prev => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => isEdit ? setEditingUser(null) : setShowAddModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isEdit ? handleUpdateUser : handleAddUser}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEdit ? 'Update User' : 'Add User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">User Management</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>
        
        <div className="bg-gray-750 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-700 text-gray-400 font-medium">
            <div>USER</div>
            <div>EMAIL</div>
            <div>ROLE</div>
            <div>STATUS</div>
            <div>ACTIONS</div>
          </div>
          <div className="divide-y divide-gray-700">
            {filteredUsers.map(user => (
              <div key={user.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                <div className="text-white">{user.name}</div>
                <div className="text-gray-300">{user.email}</div>
                <div>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300">
                    {user.role}
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAddModal && <UserModal />}
      {editingUser && <UserModal isEdit />}
    </div>
  );
};

// Roles & Permissions Section
const RolesPermissions: React.FC = () => {
  const { roles, permissions, addRole, updateRole, deleteRole } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: []
  });

  const handleAddRole = () => {
    if (newRole.name && newRole.permissions) {
      addRole(newRole as Omit<Role, 'id' | 'createdAt'>);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowAddModal(false);
    }
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      updateRole(editingRole.id, editingRole);
      setEditingRole(null);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteRole(roleId);
    }
  };

  const RoleModal: React.FC<{ isEdit?: boolean }> = ({ isEdit }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            {isEdit ? 'Edit Role' : 'Create New Role'}
          </h3>
          <button
            onClick={() => isEdit ? setEditingRole(null) : setShowAddModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role Name</label>
            <input
              type="text"
              value={isEdit ? editingRole?.name : newRole.name}
              onChange={(e) => isEdit
                ? setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)
                : setNewRole(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={isEdit ? editingRole?.description : newRole.description}
              onChange={(e) => isEdit
                ? setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)
                : setNewRole(prev => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Permissions</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {permissions.map(permission => (
                <label key={permission.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isEdit
                      ? editingRole?.permissions.some(p => p.id === permission.id)
                      : newRole.permissions?.some(p => p.id === permission.id)
                    }
                    onChange={(e) => {
                      const updatePermissions = (current: Permission[]) => {
                        if (e.target.checked) {
                          return [...current, permission];
                        } else {
                          return current.filter(p => p.id !== permission.id);
                        }
                      };
                      
                      if (isEdit) {
                        setEditingRole(prev => prev
                          ? { ...prev, permissions: updatePermissions(prev.permissions) }
                          : null
                        );
                      } else {
                        setNewRole(prev => ({
                          ...prev,
                          permissions: updatePermissions(prev.permissions || [])
                        }));
                      }
                    }}
                    className="rounded border-gray-600 text-indigo-600 focus:ring-indigo-500
                      bg-gray-700"
                  />
                  <span className="text-white">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => isEdit ? setEditingRole(null) : setShowAddModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={isEdit ? handleUpdateRole : handleAddRole}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEdit ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Roles & Permissions</h2>
      <div className="space-y-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create New Role
        </button>
        
        <div className="space-y-4">
          {roles.map(role => (
            <div key={role.id} className="bg-gray-750 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{role.name}</h3>
                  <p className="text-gray-400 text-sm">{role.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {role.permissions.map(permission => (
                  <div
                    key={permission.id}
                    className="flex items-center gap-2 p-2 rounded bg-gray-800"
                  >
                    <Shield className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="text-sm text-white">{permission.name}</div>
                      <div className="text-xs text-gray-400">{permission.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAddModal && <RoleModal />}
      {editingRole && <RoleModal isEdit />}
    </div>
  );
};

// System Settings Section
const SystemSettings: React.FC = () => {
  const { settings, updateSetting } = useAdmin();

  const handleSettingChange = (id: string, value: string) => {
    updateSetting(id, value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">System Settings</h2>
      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-gray-750 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            {settings
              .filter(setting => setting.category === 'general')
              .map(setting => (
                <div key={setting.id}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {setting.description}
                  </label>
                  {setting.type === 'boolean' ? (
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value === 'true'}
                        onChange={(e) => handleSettingChange(setting.id, e.target.checked.toString())}
                      />
                      <span className="absolute inset-0 bg-gray-700 peer-checked:bg-indigo-600 rounded-full transition-colors">
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6" />
                      </span>
                    </div>
                  ) : (
                    <input
                      type={setting.type === 'number' ? 'number' : 'text'}
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-750 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Security Settings</h3>
          <div className="space-y-4">
            {settings
              .filter(setting => setting.category === 'security')
              .map(setting => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white">{setting.description}</h4>
                    <p className="text-sm text-gray-400">
                      {setting.key === 'require_2fa' ? 'Require two-factor authentication for admin users' : ''}
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={setting.value === 'true'}
                      onChange={(e) => handleSettingChange(setting.id, e.target.checked.toString())}
                    />
                    <span className="absolute inset-0 bg-gray-700 peer-checked:bg-indigo-600 rounded-full transition-colors">
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6" />
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Audit Logs Section
const AuditLogs: React.FC = () => {
  const { auditLogs } = useAdmin();
  const [dateFilter, setDateFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filteredLogs = auditLogs
    .filter(log => !dateFilter || log.timestamp.startsWith(dateFilter))
    .filter(log => !actionFilter || log.action === actionFilter);

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Details', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        log.userName,
        log.action,
        log.details,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Audit Logs</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
              focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
          <button
            onClick={handleExportLogs}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors
              flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Logs
          </button>
        </div>
        
        <div className="bg-gray-750 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 text-gray-400 font-medium">
            <div>TIMESTAMP</div>
            <div>USER</div>
            <div>ACTION</div>
            <div>DETAILS</div>
          </div>
          <div className="divide-y divide-gray-700">
            {filteredLogs.map(log => (
              <div key={log.id} className="grid grid-cols-4 gap-4 p-4">
                <div className="text-gray-300">
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </div>
                <div className="text-white">{log.userName}</div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    log.action === 'create' ? 'bg-green-500/20 text-green-300' :
                    log.action === 'update' ? 'bg-yellow-500/20 text-yellow-300' :
                    log.action === 'delete' ? 'bg-red-500/20 text-red-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {log.action}
                  </span>
                </div>
                <div className="text-gray-300">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
