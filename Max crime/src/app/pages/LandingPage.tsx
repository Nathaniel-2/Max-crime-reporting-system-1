import { Button } from "@figma/astraui";
import { Link } from "react-router";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import bgImage from "../../imports/Nigeria-Police-oje751ajvij3f7dy7z0qk7rmbhejx6zy56z3i8uxdc.jpg";
import lagosLogo from "../../imports/images__2_.jpg";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden">
      {/* Background Image & Overlays */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-brand-dark/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center pt-2xl px-2xl pb-2xl">
        <div className="mb-2xl flex flex-col items-center text-center mt-xl">
          <div className="bg-surface-bg p-md rounded-corner-full mb-xl border border-border-primary shadow-xl ring-4 ring-brand-primary/30">
            <img src={lagosLogo} alt="Lagos State Police Logo" className="w-20 h-20 rounded-sm object-contain" />
          </div>
          <h1 className="text-title text-white mb-lg font-extrabold tracking-tighter drop-shadow-2xl text-5xl md:text-6xl lg:text-7xl">
            Lagos State Police Portal
          </h1>
          <p className="text-label text-white/90 w-full max-w-[800px] text-balance leading-relaxed drop-shadow-md text-xl md:text-2xl">
            A unified platform connecting citizens, law enforcement, and administrators for a safer community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl max-w-6xl w-full mt-24 md:mt-32">
          {/* Citizen Portal */}
          <div className="bg-black/60 backdrop-blur-md rounded-corner-lg p-2xl flex flex-col items-center text-center border border-white/20 shadow-2xl transition-transform hover:-translate-y-1 duration-300">
            <div className="bg-brand-tertiary p-xl rounded-corner-full mb-xl shadow-inner border border-brand-primary/20">
              <Shield className="w-12 h-12 text-brand-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-heading text-white mb-sm">Citizen Portal</h2>
            <p className="text-label-sm text-white/80 mb-2xl flex-1 text-balance">
              Report crimes, view interactive crime maps, and stay updated with community alerts.
            </p>
            <Link to="/auth/login" className="w-full mt-xl">
              <Button variant="primary" className="w-full">Access Citizen Dashboard</Button>
            </Link>
          </div>

          {/* Police Portal */}
          <div className="bg-black/60 backdrop-blur-md rounded-corner-lg p-2xl flex flex-col items-center text-center border border-white/20 shadow-2xl transition-transform hover:-translate-y-1 duration-300">
            <div className="bg-brand-tertiary p-xl rounded-corner-full mb-xl shadow-inner border border-brand-primary/20">
              <ShieldAlert className="w-12 h-12 text-brand-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-heading text-white mb-sm">Police Portal</h2>
            <p className="text-label-sm text-white/80 mb-2xl flex-1 text-balance">
              Manage cases, track incidents in real-time, and coordinate officer deployments.
            </p>
            <Link to="/auth/police-login" className="w-full mt-xl">
              <Button variant="primary" className="w-full">Access Police Dashboard</Button>
            </Link>
          </div>

          {/* Admin Portal */}
          <div className="bg-black/60 backdrop-blur-md rounded-corner-lg p-2xl flex flex-col items-center text-center border border-white/20 shadow-2xl transition-transform hover:-translate-y-1 duration-300">
            <div className="bg-brand-tertiary p-xl rounded-corner-full mb-xl shadow-inner border border-brand-primary/20">
              <ShieldCheck className="w-12 h-12 text-brand-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-heading text-white mb-sm">Admin Portal</h2>
            <p className="text-label-sm text-white/80 mb-2xl flex-1 text-balance">
              Manage system users, analyze crime trends, and configure platform settings.
            </p>
            <Link to="/auth/admin-login" className="w-full mt-xl">
              <Button variant="primary" className="w-full">Access Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}