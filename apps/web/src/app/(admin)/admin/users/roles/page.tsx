'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Brain,
  Award,
  Settings,
  Eye,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Copy,
  MoreVertical,
  Search,
  ChevronRight,
} from 'lucide-react';

// Role definitions with permissions
const roles = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    color: 'red',
    usersCount: 5,
    permissions: {
      users: ['view', 'create', 'edit', 'delete', 'manage_roles'],
      courses: ['view', 'create', 'edit', 'delete', 'publish'],
      content: ['view', 'create', 'edit', 'delete', 'moderate'],
      analytics: ['view', 'export'],
      settings: ['view', 'edit'],
      billing: ['view', 'manage'],
    },
  },
  {
    id: 'instructor',
    name: 'Instructor',
    description: 'Can create and manage their own courses',
    color: 'purple',
    usersCount: 234,
    permissions: {
      users: ['view'],
      courses: ['view', 'create', 'edit'],
      content: ['view', 'create', 'edit'],
      analytics: ['view'],
      settings: [],
      billing: [],
    },
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Can provide guidance and review student progress',
    color: 'green',
    usersCount: 89,
    permissions: {
      users: ['view'],
      courses: ['view'],
      content: ['view', 'create'],
      analytics: ['view'],
      settings: [],
      billing: [],
    },
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Standard learner account with course access',
    color: 'blue',
    usersCount: 27890,
    permissions: {
      users: [],
      courses: ['view'],
      content: ['view'],
      analytics: [],
      settings: [],
      billing: [],
    },
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Can moderate community content and discussions',
    color: 'orange',
    usersCount: 12,
    permissions: {
      users: ['view'],
      courses: ['view'],
      content: ['view', 'moderate'],
      analytics: ['view'],
      settings: [],
      billing: [],
    },
  },
];

// Permission categories
const permissionCategories = [
  { key: 'users', label: 'User Management', icon: Users, permissions: ['view', 'create', 'edit', 'delete', 'manage_roles'] },
  { key: 'courses', label: 'Course Management', icon: BookOpen, permissions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { key: 'content', label: 'Content & Moderation', icon: MessageSquare, permissions: ['view', 'create', 'edit', 'delete', 'moderate'] },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, permissions: ['view', 'export'] },
  { key: 'settings', label: 'System Settings', icon: Settings, permissions: ['view', 'edit'] },
  { key: 'billing', label: 'Billing & Payments', icon: Award, permissions: ['view', 'manage'] },
];

const roleColors: Record<string, string> = {
  red: 'bg-red-100 text-red-600 border-red-200',
  purple: 'bg-purple-100 text-purple-600 border-purple-200',
  green: 'bg-green-100 text-green-600 border-green-200',
  blue: 'bg-blue-100 text-blue-600 border-blue-200',
  orange: 'bg-orange-100 text-orange-600 border-orange-200',
};

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Shield className="w-7 h-7 text-purple-500" />
            Roles & Permissions
          </h1>
          <p className="text-gray-500 text-sm">
            Manage user roles and access permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {roles.map((role) => (
            <motion.button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              whileHover={{ scale: 1.01 }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedRole.id === role.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[role.color]}`}>
                  {role.name}
                </span>
                <span className="text-xs text-gray-500">{role.usersCount.toLocaleString()} users</span>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Role Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Header */}
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleColors[selectedRole.color]}`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedRole.name}</h2>
                  <p className="text-sm text-gray-500">{selectedRole.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    editMode
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  {editMode ? 'Editing' : 'Edit'}
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                {selectedRole.id !== 'admin' && selectedRole.id !== 'student' && (
                  <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{selectedRole.usersCount.toLocaleString()} users assigned</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>{Object.values(selectedRole.permissions).flat().length} permissions</span>
              </div>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Permissions</h3>
            <div className="space-y-4">
              {permissionCategories.map((category) => {
                const rolePermissions = selectedRole.permissions[category.key as keyof typeof selectedRole.permissions] || [];
                return (
                  <div key={category.key} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <category.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">{category.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.permissions.map((permission) => {
                        const hasPermission = rolePermissions.includes(permission);
                        return (
                          <button
                            key={permission}
                            disabled={!editMode}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              hasPermission
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            } ${editMode ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                          >
                            {hasPermission ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {permission}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                {permission}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Users with this role */}
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Users with this Role</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {/* No current members */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

