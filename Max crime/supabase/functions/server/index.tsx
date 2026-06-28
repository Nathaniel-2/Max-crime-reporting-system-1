import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to verify auth
const getAuthUser = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_ANON_KEY") || ""
  );
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
};

// Health check endpoint
app.get("/make-server-25788204/health", (c) => {
  return c.json({ status: "ok" });
});

// Get users
app.get("/make-server-25788204/users", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const safeUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      name: u.user_metadata?.first_name ? `${u.user_metadata.first_name} ${u.user_metadata.last_name || ''}`.trim() : 'Unknown',
      role: u.user_metadata?.role || 'Citizen'
    }));
    return c.json(safeUsers);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create report
app.post("/make-server-25788204/reports", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw);
    const body = await c.req.json();
    
    const id = `report_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const report = {
      id,
      ...body,
      status: "Open",
      createdAt: new Date().toISOString(),
      user_id: user?.id || "anonymous"
    };

    await kv.set(id, report);
    return c.json(report, 201);
  } catch (error: any) {
    console.error('Error creating report:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get reports
app.get("/make-server-25788204/reports", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw);
    const reports = await kv.getByPrefix("report_");
    
    // In a real app we'd filter by user if Citizen, or show all if Police/Admin
    // For prototyping we'll return all reports, or maybe filter if citizen?
    // Let's check role if possible, but user object metadata is not always in token.
    // We'll just return all for the dashboards to work well, unless we strictly filter.
    
    return c.json(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);