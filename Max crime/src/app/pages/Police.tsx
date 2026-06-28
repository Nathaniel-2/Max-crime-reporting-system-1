import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { SidebarNavigation, SidebarButton, Avatar, Button, SearchComponent, Badge, SelectField } from "@figma/astraui";
import { LayoutDashboard, FileText, Map, Users, Settings, ShieldAlert, Filter, ChevronDown } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import lagosLogo from "../../imports/images__2_.jpg";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-25788204`;

export function PoliceLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <SidebarNavigation
        footer={
          <>
            <Avatar type="initial" initials="PO" size="medium" shape="circle" />
          </>
        }
      >
        <div className="mb-3">
          <img src={lagosLogo} alt="Lagos State Police Logo" className="w-8 h-8 rounded-sm object-contain" />
        </div>
        <SidebarButton 
          icon={<LayoutDashboard className="size-full" strokeWidth={1.5} />} 
          active={path === "/police"}
          onClick={() => navigate("/police")}
        />
        <SidebarButton 
          icon={<FileText className="size-full" strokeWidth={1.5} />} 
          active={path === "/police/cases"}
          onClick={() => navigate("/police/cases")}
        />
        <SidebarButton 
          icon={<Map className="size-full" strokeWidth={1.5} />} 
          active={path === "/police/map"}
          onClick={() => navigate("/police/map")}
        />
        <SidebarButton 
          icon={<Users className="size-full" strokeWidth={1.5} />} 
          active={path === "/police/officers"}
          onClick={() => navigate("/police/officers")}
        />
      </SidebarNavigation>
      <main className="flex-1 bg-brand-tertiary p-2xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export function PoliceDashboard() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/reports`, { headers: { 'Authorization': `Bearer ${publicAnonKey}` } })
      .then(r => r.json())
      .then(data => {
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReports(data);
      })
      .catch(console.error);
  }, []);

  const activeCases = reports.filter(r => r.status !== 'Closed').length;
  const resolvedCases = reports.filter(r => r.status === 'Closed').length;
  const criticalCases = reports.filter(r => r.type === 'Assault' || r.type === 'Robbery').length;
  const recentIncidents = reports.slice(0, 3);

  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-text-primary">Police Dashboard</h1>
          <p className="text-label-sm text-text-secondary mt-xs">Active operations and station overview.</p>
        </div>
        <Button variant="primary" iconStart={<ShieldAlert size={16} />}>Dispatch Units</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-xl">
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Active Cases</span>
          <span className="text-3xl font-semibold text-text-primary">{activeCases}</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Officers on Duty</span>
          <span className="text-3xl font-semibold text-text-primary">124</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Critical Incidents</span>
          <span className="text-3xl font-semibold text-danger">{criticalCases}</span>
        </div>
        <div className="bg-surface-bg rounded-corner-lg p-xl flex flex-col gap-sm border border-border-primary shadow-sm">
          <span className="text-text-secondary text-label-sm">Resolved</span>
          <span className="text-3xl font-semibold text-brand-primary">{resolvedCases}</span>
        </div>
      </div>

      <div>
        <h2 className="text-heading text-text-primary mb-lg">Recent Incidents</h2>
        <div className="flex flex-col gap-xl">
          {recentIncidents.length > 0 ? recentIncidents.map((incident) => (
            <div key={incident.id} className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-lg">
                <div className="bg-brand-tertiary p-md rounded-corner-full">
                  <ShieldAlert className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-label text-text-primary font-medium">{incident.type} in Progress</h3>
                  <p className="text-label-sm text-text-secondary">{incident.location} • {new Date(incident.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Button variant="neutral" size="small">Assign Officers</Button>
            </div>
          )) : (
            <div className="text-text-secondary text-label-sm">No recent incidents.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CaseManagement() {
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-text-primary">Case Management</h1>
        </div>
        <div className="flex gap-lg">
          <div className="w-64"><SearchComponent placeholder="Search cases..." /></div>
          <Button variant="neutral" iconStart={<Filter size={16} />}>Filter</Button>
        </div>
      </div>

      <div className="bg-surface-bg rounded-corner-lg border border-border-primary shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-tertiary border-b border-border-primary">
            <tr>
              <th className="p-md text-label-sm font-medium text-text-secondary">Case ID</th>
              <th className="p-md text-label-sm font-medium text-text-secondary">Type</th>
              <th className="p-md text-label-sm font-medium text-text-secondary">Location</th>
              <th className="p-md text-label-sm font-medium text-text-secondary">Status</th>
              <th className="p-md text-label-sm font-medium text-text-secondary">Lead Officer</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "CAS-1029", type: "Burglary", loc: "North Sector", status: "Open", officer: "Det. Johnson" },
              { id: "CAS-1030", type: "Assault", loc: "East Side", status: "Under Investigation", officer: "Off. Ramirez" },
              { id: "CAS-1031", type: "Vandalism", loc: "Downtown", status: "Closed", officer: "Off. Smith" },
            ].map((c, i) => (
              <tr key={i} className="border-b border-border-primary last:border-0 hover:bg-brand-tertiary/50 cursor-pointer">
                <td className="p-md text-label text-text-primary font-mono">{c.id}</td>
                <td className="p-md text-label text-text-primary">{c.type}</td>
                <td className="p-md text-label text-text-secondary">{c.loc}</td>
                <td className="p-md">
                  <Badge>{c.status}</Badge>
                </td>
                <td className="p-md text-label text-text-primary">{c.officer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IncidentMap() {
  return (
    <div className="flex flex-col h-full gap-xl">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-title text-text-primary">Live Incident Map</h1>
        <Button variant="neutral" iconStart={<Filter size={16} />}>Map Layers</Button>
      </div>
      <div className="flex-1 bg-surface-bg rounded-corner-lg border border-border-primary shadow-sm overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" alt="Map" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-surface-bg/90 backdrop-blur-sm p-md rounded-corner-lg border border-border-primary shadow-lg flex flex-col items-center">
            <Map className="w-8 h-8 text-brand-primary mb-2" />
            <span className="text-label text-text-primary font-medium">Command Center View</span>
            <span className="text-label-sm text-text-secondary">Tracking active deployments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfficerManagement() {
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-title text-text-primary">Officer Deployment</h1>
        <Button variant="primary">Deploy Unit</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {["Unit Alpha", "Unit Bravo", "Unit Charlie", "Unit Delta"].map((unit) => (
          <div key={unit} className="bg-surface-bg rounded-corner-lg p-xl border border-border-primary shadow-sm flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <span className="text-label text-text-primary font-semibold">{unit}</span>
              <Badge>Active Patrol</Badge>
            </div>
            <p className="text-label-sm text-text-secondary">Currently assigned to Sector 4</p>
            <Button variant="neutral" className="w-full mt-2">View Status</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PoliceReports() {
  return (
    <div className="flex flex-col gap-2xl max-w-6xl mx-auto">
      <h1 className="text-title text-text-primary">Internal Reports</h1>
      <div className="bg-surface-bg p-2xl rounded-corner-lg border border-border-primary shadow-sm">
        <p className="text-text-secondary">Access to tactical and shift reports.</p>
      </div>
    </div>
  );
}
