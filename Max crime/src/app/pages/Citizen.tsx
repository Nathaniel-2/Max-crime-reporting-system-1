import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { SidebarNavigation, SidebarButton, Avatar, Button, InputField, SelectField, TextareaField, SearchComponent, Badge } from "@figma/astraui";
import { Home, Edit3, Map, FileText, Settings, Bell, Filter } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import lagosLogo from "../../imports/images__2_.jpg";
import { supabase } from "../utils/supabaseClient";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-25788204`;

export function CitizenLayout() {
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
              active={path === "/citizen/settings"}
              onClick={() => navigate("/citizen/settings")}
            />
            <button onClick={() => navigate("/citizen/profile")} className="rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary">
              <Avatar type="initial" initials="CT" size="medium" shape="circle" />
            </button>
          </>
        }
      >
        <div className="mb-3">
          <img src={lagosLogo} alt="Lagos State Police Logo" className="w-8 h-8 rounded-sm object-contain" />
        </div>
        <SidebarButton 
          icon={<Home className="size-full" strokeWidth={1.5} />} 
          active={path === "/citizen"}
          onClick={() => navigate("/citizen")}
        />
        <SidebarButton 
          icon={<Edit3 className="size-full" strokeWidth={1.5} />} 
          active={path === "/citizen/report"}
          onClick={() => navigate("/citizen/report")}
        />
        <SidebarButton 
          icon={<Map className="size-full" strokeWidth={1.5} />} 
          active={path === "/citizen/map"}
          onClick={() => navigate("/citizen/map")}
        />
        <SidebarButton 
          icon={<FileText className="size-full" strokeWidth={1.5} />} 
          active={path.startsWith("/citizen/report") && path !== "/citizen/report"}
          onClick={() => navigate("/citizen/reports")}
        />
      </SidebarNavigation>
      <main className="flex-1 bg-brand-tertiary p-2xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export function CitizenDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    
    fetch(`${API_BASE}/reports`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } })
      .then(r => r.json())
      .then(data => {
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReports(data);
      })
      .catch(console.error);
  }, []);

  const recentReports = reports.slice(0, 3);
  const activeCount = reports.filter(r => r.status !== 'Closed').length;

  return (
    <div className="flex flex-col gap-2xl max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-text-primary">Citizen Dashboard</h1>
          <p className="text-label-sm text-text-secondary mt-xs">
            Welcome back, {user?.user_metadata?.first_name || 'Citizen'}. Here is your community overview.
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <Button variant="primary" iconStart={<Edit3 size={16} />} onClick={() => navigate("/citizen/report")}>
            Report Incident
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary">
          <span className="text-text-secondary text-label-sm">Active Reports</span>
          <span className="text-3xl font-semibold text-text-primary">{activeCount}</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary">
          <span className="text-text-secondary text-label-sm">Community Alerts</span>
          <span className="text-3xl font-semibold text-text-primary">2</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary">
          <span className="text-text-secondary text-label-sm">Safety Score</span>
          <span className="text-3xl font-semibold text-success">92/100</span>
        </div>
      </div>

      <div>
        <h2 className="text-heading text-text-primary mb-lg">Recent Activity</h2>
        <div className="flex flex-col gap-xl">
          {recentReports.length > 0 ? recentReports.map((report) => (
            <div key={report.id} className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary flex items-center justify-between">
              <div className="flex items-center gap-lg">
                <div className="bg-brand-tertiary p-md rounded-corner-full">
                  <Bell className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-label text-text-primary font-medium">{report.type} Reported</h3>
                  <p className="text-label-sm text-text-secondary">{report.location} • {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Button variant="neutral" size="small" onClick={() => navigate('/citizen/reports')}>View</Button>
            </div>
          )) : (
            <div className="text-text-secondary text-label-sm">No recent activity.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReportCrime() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type || !date || !location || !description) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ type, date, time, location, description })
      });
      if (res.ok) {
        navigate("/citizen/reports");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e: any) {
      alert(`Error submitting report: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-xl">
        <h1 className="text-title text-text-primary">Report an Incident</h1>
        <p className="text-label-sm text-text-secondary mt-xs">Please provide detailed information about the incident.</p>
      </div>

      <div className="flex flex-col gap-xl">
        <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary">
          <h2 className="text-label text-text-primary font-semibold mb-lg">Incident Details</h2>
          <div className="flex flex-col gap-lg">
            <SelectField 
              label="Incident Type *" 
              options={[
                { value: "Theft / Burglary", label: "Theft / Burglary" },
                { value: "Vandalism", label: "Vandalism" },
                { value: "Suspicious Activity", label: "Suspicious Activity" },
                { value: "Assault", label: "Assault" },
                { value: "Traffic Violation", label: "Traffic Violation" },
                { value: "Other", label: "Other" }
              ]} 
              value={type}
              onChange={(val) => setType(val)}
            />
            <div className="flex gap-xl">
              <div className="flex-1"><InputField label="Date *" type="date" value={date} onChange={(val) => setDate(val)} /></div>
              <div className="flex-1"><InputField label="Time" type="time" value={time} onChange={(val) => setTime(val)} /></div>
            </div>
            <InputField label="Location / Address *" placeholder="123 Main St..." value={location} onChange={(val) => setLocation(val)} />
            <TextareaField label="Description *" placeholder="Describe what happened in detail..." rows={5} value={description} onChange={(val) => setDescription(val)} />
          </div>
        </div>

        <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary flex justify-end">
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CitizenCrimeMap() {
  return (
    <div className="flex flex-col h-full gap-xl">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-title text-text-primary">Interactive Crime Map</h1>
        <div className="flex items-center gap-lg">
          <SelectField 
            options={[
              { value: "7d", label: "Last 7 Days" },
              { value: "30d", label: "Last 30 Days" }
            ]} 
            value="7d" 
            onChange={() => {}}
          />
          <Button variant="neutral" iconStart={<Filter size={16} />}>Filters</Button>
        </div>
      </div>
      <div className="flex-1 bg-surface-bg rounded-corner-lg border border-border-primary overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" alt="Map" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-surface-bg/90 backdrop-blur-sm p-md rounded-corner-lg border border-border-primary shadow-lg flex flex-col items-center">
            <Map className="w-8 h-8 text-brand-primary mb-2" />
            <span className="text-label text-text-primary font-medium">Map View</span>
            <span className="text-label-sm text-text-secondary">Interactive mapping enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE}/reports`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReports(data);
        }
      } catch (e) {
        console.error("Failed to fetch reports", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col gap-2xl max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-text-primary">My Reports</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Track the status of incidents you've reported.</p>
        </div>
        <div className="w-64">
          <SearchComponent placeholder="Search reports..." />
        </div>
      </div>

      <div className="bg-surface-bg rounded-corner-lg border border-border-primary overflow-hidden">
        {loading ? (
          <div className="p-xl text-center text-text-secondary">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-xl text-center text-text-secondary">No reports found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-brand-tertiary border-b border-border-primary">
              <tr>
                <th className="p-md text-label-sm font-medium text-text-secondary">ID</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Type</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Date</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Status</th>
                <th className="p-md text-label-sm font-medium text-text-secondary">Location</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-border-primary last:border-0 hover:bg-brand-tertiary/50">
                  <td className="p-md text-label text-text-primary font-mono text-sm">{report.id.split('_')[2]}</td>
                  <td className="p-md text-label text-text-primary">{report.type}</td>
                  <td className="p-md text-label text-text-primary">{report.date}</td>
                  <td className="p-md">
                    <Badge>{report.status}</Badge>
                  </td>
                  <td className="p-md text-label text-text-secondary truncate max-w-[200px]">{report.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function CitizenNotifications() {
  return (
    <div className="flex flex-col gap-2xl max-w-5xl mx-auto">
      <h1 className="text-title text-text-primary">Notifications</h1>
      <div className="flex flex-col gap-xl">
        <div className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-label text-text-primary font-medium">Welcome to the portal</h3>
            <p className="text-label-sm text-text-secondary">Please complete your profile to enable all features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CitizenProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="flex flex-col gap-2xl max-w-5xl mx-auto">
      <h1 className="text-title text-text-primary">My Profile</h1>
      <div className="bg-surface-bg p-2xl rounded-corner-lg border border-border-primary shadow-sm flex items-center gap-2xl">
        <Avatar type="initial" initials={user?.user_metadata?.first_name?.[0] || "C"} size="large" shape="circle" />
        <div>
          <h2 className="text-heading text-text-primary">{user?.user_metadata?.first_name || 'Jane'} {user?.user_metadata?.last_name || 'Citizen'}</h2>
          <p className="text-text-secondary">{user?.email || 'citizen@example.com'}</p>
        </div>
      </div>
    </div>
  );
}

export function CitizenSettings() {
  return (
    <div className="flex flex-col gap-2xl max-w-5xl mx-auto">
      <h1 className="text-title text-text-primary">Settings</h1>
      <div className="bg-surface-bg p-2xl rounded-corner-lg border border-border-primary shadow-sm">
        <h2 className="text-heading text-text-primary mb-xl">Account Preferences</h2>
        <div className="flex flex-col gap-lg">
          <label className="flex items-center gap-md">
            <input type="checkbox" className="w-4 h-4 text-brand-primary" defaultChecked />
            <span className="text-label text-text-primary">Receive SMS Alerts</span>
          </label>
          <label className="flex items-center gap-md">
            <input type="checkbox" className="w-4 h-4 text-brand-primary" defaultChecked />
            <span className="text-label text-text-primary">Email Notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
}
