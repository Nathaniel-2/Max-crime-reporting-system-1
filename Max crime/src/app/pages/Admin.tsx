import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { SidebarNavigation, SidebarButton, Avatar, Button, SearchComponent, Badge } from "@figma/astraui";
import { LayoutDashboard, Users, Grid, Activity, Settings, ShieldCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import lagosLogo from "../../imports/images__2_.jpg";

const FUNCTIONS_API = `https://${projectId}.supabase.co/functions/v1/make-server-25788204`;

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <SidebarNavigation
        footer={
          <>
            <SidebarButton 
              icon={<Settings className="size-full" strokeWidth={1.5} />} 
              active={path === "/admin/settings"}
              onClick={() => navigate("/admin/settings")}
            />
            <Avatar type="initial" initials="AD" size="medium" shape="circle" />
          </>
        }
      >
        <div className="mb-3">
          <img src={lagosLogo} alt="Lagos State Police Logo" className="w-8 h-8 rounded-sm object-contain" />
        </div>
        <SidebarButton 
          icon={<LayoutDashboard className="size-full" strokeWidth={1.5} />} 
          active={path === "/admin"}
          onClick={() => navigate("/admin")}
        />
        <SidebarButton 
          icon={<Users className="size-full" strokeWidth={1.5} />} 
          active={path === "/admin/users"}
          onClick={() => navigate("/admin/users")}
        />
        <SidebarButton 
          icon={<Grid className="size-full" strokeWidth={1.5} />} 
          active={path === "/admin/categories"}
          onClick={() => navigate("/admin/categories")}
        />
        <SidebarButton 
          icon={<Activity className="size-full" strokeWidth={1.5} />} 
          active={path === "/admin/analytics"}
          onClick={() => navigate("/admin/analytics")}
        />
      </SidebarNavigation>
      <main className="flex-1 bg-brand-tertiary p-2xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

const data = [
  { name: 'Mon', crimes: 40, resolved: 24 },
  { name: 'Tue', crimes: 30, resolved: 13 },
  { name: 'Wed', crimes: 20, resolved: 38 },
  { name: 'Thu', crimes: 27, resolved: 39 },
  { name: 'Fri', crimes: 18, resolved: 48 },
  { name: 'Sat', crimes: 23, resolved: 38 },
  { name: 'Sun', crimes: 34, resolved: 43 },
];

export function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, reports: 0, resolved: 0 });

  useEffect(() => {
    Promise.all([
      fetch(`${FUNCTIONS_API}/users`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }).then(r => r.json()),
      fetch(`${FUNCTIONS_API}/reports`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }).then(r => r.json())
    ]).then(([usersData, reportsData]) => {
      const uCount = Array.isArray(usersData) ? usersData.length : 0;
      const rCount = Array.isArray(reportsData) ? reportsData.length : 0;
      const resCount = Array.isArray(reportsData) ? reportsData.filter(r => r.status === 'Closed').length : 0;
      setStats({ users: uCount, reports: rCount, resolved: resCount });
    }).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-text-primary">System Administration</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Platform overview and health metrics.</p>
        </div>
        <Button variant="primary">System Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-xl">
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Total Users</span>
          <span className="text-3xl font-semibold text-text-primary">{stats.users}</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Total Reports</span>
          <span className="text-3xl font-semibold text-text-primary">{stats.reports}</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Resolved Cases</span>
          <span className="text-3xl font-semibold text-brand-primary">{stats.resolved}</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">System Uptime</span>
          <span className="text-3xl font-semibold text-success">99.9%</span>
        </div>
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary shadow-sm">
        <h2 className="text-heading text-text-primary mb-xl">Platform Activity (Last 7 Days)</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-primary)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="crimes" stroke="var(--brand-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Reports Created" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Cases Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${FUNCTIONS_API}/users`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-text-primary">User Management</h1>
        </div>
        <div className="flex gap-lg">
          <div className="w-64"><SearchComponent placeholder="Search users..." /></div>
          <Button variant="primary">Add User</Button>
        </div>
      </div>

      <div className="bg-surface-bg rounded-corner-lg border border-border-primary shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-xl text-center text-text-secondary">Loading users...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-brand-tertiary border-b border-border-primary">
              <tr>
                <th className="p-md text-label-sm font-medium text-text-secondary">Name</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Email</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Role</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Joined</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-border-primary last:border-0 hover:bg-brand-tertiary/50">
                  <td className="p-md text-label text-text-primary">{u.name}</td>
                  <td className="p-md text-label text-text-secondary">{u.email}</td>
                  <td className="p-md">
                    <Badge>{u.role}</Badge>
                  </td>
                  <td className="p-md text-label-sm text-text-secondary">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-md">
                    <Button variant="subtle" size="small">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function CrimeCategories() {
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-title text-text-primary">Crime Categories</h1>
        <Button variant="primary">New Category</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {["Theft", "Vandalism", "Assault", "Traffic", "Fraud", "Cybercrime"].map(cat => (
          <div key={cat} className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary shadow-sm flex items-center justify-between">
            <span className="text-label text-text-primary font-medium">{cat}</span>
            <Button variant="subtle" size="small">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminReports() {
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <h1 className="text-title text-text-primary">System Reports</h1>
      <div className="bg-surface-bg p-2xl rounded-corner-lg border border-border-primary shadow-sm text-center">
        <p className="text-text-secondary">Generate and download comprehensive system reports.</p>
        <Button variant="primary" className="mt-xl">Generate Monthly Report</Button>
      </div>
    </div>
  );
}

export function Analytics() {
  const barData = [
    { name: 'Theft', count: 120 },
    { name: 'Assault', count: 80 },
    { name: 'Vandalism', count: 60 },
    { name: 'Traffic', count: 150 },
  ];
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <h1 className="text-title text-text-primary">Analytics</h1>
      <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary shadow-sm">
        <h2 className="text-heading text-text-primary mb-xl">Crimes by Category</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-primary)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="count" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function SystemSettings() {
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <h1 className="text-title text-text-primary">System Settings</h1>
      <div className="bg-surface-bg p-2xl rounded-corner-lg border border-border-primary shadow-sm">
        <p className="text-text-secondary">Configure platform-wide settings.</p>
      </div>
    </div>
  );
}