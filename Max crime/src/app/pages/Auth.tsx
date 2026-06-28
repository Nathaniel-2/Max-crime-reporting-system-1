import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { Button, InputField, Checkbox } from "@figma/astraui";
import lagosLogo from "../../imports/images__2_.jpg";
import { supabase } from "../utils/supabaseClient";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-tertiary flex items-center justify-center p-2xl font-sans">
      <div className="bg-surface-bg rounded-corner-lg p-2xl w-full max-w-md border border-border-primary shadow-sm">
        <div className="flex justify-center mb-2xl">
          <Link to="/">
            <img src={lagosLogo} alt="Lagos State Police Logo" className="w-12 h-12 rounded-sm object-contain shadow-sm" />
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        navigate("/citizen");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <div className="text-center mb-xl">
        <h1 className="text-heading text-text-primary">Welcome Back</h1>
        <p className="text-label-sm text-text-secondary mt-xs">Sign in to your account</p>
      </div>

      {error && <div className="text-danger text-label-sm bg-bg-subtle p-md rounded-corner-md">{error}</div>}

      <div className="flex flex-col gap-lg">
        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(val) => setEmail(val)}
        />
        <InputField 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(val) => setPassword(val)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Checkbox label="Remember me" />
        <Button variant="subtle" size="small" className="text-brand-primary">Forgot Password?</Button>
      </div>

      <Button variant="primary" className="w-full" onClick={handleLogin} disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="text-center mt-xl">
        <p className="text-label-sm text-text-secondary">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-brand-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      if (error) throw error;
      navigate("/citizen");
    } catch (err: any) {
      setError(err.message || "Failed to register");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <div className="text-center mb-xl">
        <h1 className="text-heading text-text-primary">Create Account</h1>
        <p className="text-label-sm text-text-secondary mt-xs">Join the secure city portal</p>
      </div>

      {error && <div className="text-danger text-label-sm bg-bg-subtle p-md rounded-corner-md">{error}</div>}

      <div className="flex flex-col gap-lg">
        <div className="flex gap-xl">
          <div className="flex-1">
            <InputField 
              label="First Name" 
              value={firstName}
              onChange={(val) => setFirstName(val)}
            />
          </div>
          <div className="flex-1">
            <InputField 
              label="Last Name" 
              value={lastName}
              onChange={(val) => setLastName(val)}
            />
          </div>
        </div>
        <InputField 
          label="Email Address" 
          type="email" 
          value={email}
          onChange={(val) => setEmail(val)}
        />
        <InputField 
          label="Password" 
          type="password" 
          value={password}
          onChange={(val) => setPassword(val)}
        />
        <InputField 
          label="Confirm Password" 
          type="password" 
          value={confirmPassword}
          onChange={(val) => setConfirmPassword(val)}
        />
      </div>

      <Checkbox label="I agree to the Terms of Service and Privacy Policy" />

      <Button variant="primary" className="w-full" onClick={handleRegister} disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center mt-xl">
        <p className="text-label-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-brand-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export function PoliceLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        navigate("/police");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <div className="text-center mb-xl">
        <h1 className="text-heading text-text-primary">Officer Portal</h1>
        <p className="text-label-sm text-text-secondary mt-xs">Sign in to the police command center</p>
      </div>

      {error && <div className="text-danger text-label-sm bg-bg-subtle p-md rounded-corner-md">{error}</div>}

      <div className="flex flex-col gap-lg">
        <InputField 
          label="Badge Number / Email" 
          type="email" 
          placeholder="officer@lagospolice.gov.ng" 
          value={email}
          onChange={(val) => setEmail(val)}
        />
        <InputField 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(val) => setPassword(val)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Checkbox label="Remember me" />
        <Button variant="subtle" size="small" className="text-brand-primary">Forgot Password?</Button>
      </div>

      <Button variant="primary" className="w-full" onClick={handleLogin} disabled={loading}>
        {loading ? "Authenticating..." : "Sign In to Command Center"}
      </Button>

      <div className="text-center mt-xl">
        <p className="text-label-sm text-text-secondary">
          Are you a citizen?{" "}
          <Link to="/auth/login" className="text-brand-primary hover:underline">
            Go to Citizen Portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        navigate("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <div className="text-center mb-xl">
        <h1 className="text-heading text-text-primary">System Admin</h1>
        <p className="text-label-sm text-text-secondary mt-xs">Secure platform administration access</p>
      </div>

      {error && <div className="text-danger text-label-sm bg-bg-subtle p-md rounded-corner-md">{error}</div>}

      <div className="flex flex-col gap-lg">
        <InputField 
          label="Admin Email" 
          type="email" 
          placeholder="admin@lagospolice.gov.ng" 
          value={email}
          onChange={(val) => setEmail(val)}
        />
        <InputField 
          label="Secure Password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(val) => setPassword(val)}
        />
      </div>

      <Button variant="primary" className="w-full mt-lg" onClick={handleLogin} disabled={loading}>
        {loading ? "Authenticating..." : "Access Admin Portal"}
      </Button>

      <div className="text-center mt-xl">
        <p className="text-label-sm text-text-secondary">
          Not an admin?{" "}
          <Link to="/auth/login" className="text-brand-primary hover:underline">
            Return to main portal
          </Link>
        </p>
      </div>
    </div>
  );
}
