'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  Ban,
  Edit,
  Eye,
  Download,
  Upload,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAdminUsers, useAdminStats } from '@/lib/api';

const roleColors: Record<string, string> = {
  STUDENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  INSTRUCTOR: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  MENTOR: 'bg-green-500/20 text-green-400 border-green-500/30',
  ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  suspended: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch real data from API
  const { data: usersData, isLoading } = useAdminUsers({
    search: searchQuery || undefined,
    role: selectedRole !== 'all' ? selectedRole : undefined,
  });
  const { data: statsData } = useAdminStats();

  const apiUsers = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination;
  const userStats = statsData?.data?.users;

  // Map API users to display format
  const filteredUsers = apiUsers.map((u: any) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    status: u.isActive ? 'active' : 'suspended',
    verified: u.isVerified,
    level: u.level,
    xp: u.xp,
    enrolledCourses: u._count?.enrollments || 0,
    certificates: u._count?.certificates || 0,
    achievements: u._count?.achievements || 0,
    lastActive: u.lastActivityAt ? new Date(u.lastActivityAt).toLocaleDateString() : 'Never',
    joinedAt: new Date(u.createdAt).toLocaleDateString(),
  }));

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u: any) => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Users className="w-7 h-7 text-blue-500" />
            User Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all platform users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm flex items-center gap-2 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: String(userStats?.total || filteredUsers.length), icon: Users, color: 'text-blue-400' },
          { label: 'Active Users', value: String(userStats?.active || 0), icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Instructors', value: String(userStats?.instructors || 0), icon: GraduationCap, color: 'text-purple-400' },
          { label: 'Verified', value: String(userStats?.verified || 0), icon: Shield, color: 'text-yellow-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="all">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="MENTOR">Mentor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <button className="p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
        >
          <span className="text-sm text-blue-400">{selectedUsers.length} users selected</span>
          <div className="flex-1" />
          <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors">
            Send Email
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors">
            Verify
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors">
            Suspend
          </button>
        </motion.div>
      )}

      {/* Users Table */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-600"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="rounded border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.name}
                          {user.verified && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">Lv. {user.level}</span>
                      <span className="text-xs text-gray-500">{user.xp.toLocaleString()} XP</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">{user.enrolledCourses}</span>
                        <span className="text-gray-500">courses</span>
                      </div>
                      <div className="text-xs text-gray-500">{user.certificates} certificates</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-400">{user.lastActive}</div>
                    <div className="text-xs text-gray-600">Joined {user.joinedAt}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Email">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="More">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {pagination?.totalCount || filteredUsers.length} users
          </div>
        </div>
      </div>
    </div>
  );
}

