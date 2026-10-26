import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Droplet, Home, Clock, BarChart3, Trophy, User, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, Plus, Flame, Award, Bell, Moon, Globe, Ruler,
  Lock, HelpCircle, Info, LogOut, Edit3, Check, X, Eye, EyeOff, Sparkles
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

/* ---------------------------------------------------------
   AquaTrack — Smart Hydration Management (UI Prototype)
   All data lives in React state. No backend / no localStorage.
--------------------------------------------------------- */

const COLORS = {
  primary: "#3B82F6",
  secondary: "#60A5FA",
  accent: "#06B6D4",
  bg: "#F5FAFF",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const ACHIEVEMENT_DEFS = [
  { id: "first_drink", name: "First Drink", desc: "Log your very first glass", icon: Droplet, goal: 1, metric: "totalLogs" },
  { id: "goal_achiever", name: "Goal Achiever", desc: "Hit your daily goal once", icon: Check, goal: 1, metric: "goalsHit" },
  { id: "seven_day", name: "Seven-Day Streak", desc: "7 days in a row", icon: Flame, goal: 7, metric: "streak" },
  { id: "thirty_day", name: "Thirty-Day Streak", desc: "30 days in a row", icon: Flame, goal: 30, metric: "streak" },
  { id: "hundred_l", name: "One Hundred Liters", desc: "Drink 100L lifetime", icon: Droplet, goal: 100000, metric: "totalMl" },
  { id: "hydration_master", name: "Hydration Master", desc: "Hit goal 20 times", icon: Award, goal: 20, metric: "goalsHit" },
  { id: "perfect_month", name: "Perfect Month", desc: "30/30 days on goal", icon: Trophy, goal: 30, metric: "perfectMonth" },
];

function calcGoal({ weight, activityLevel }) {
  const w = Number(weight) || 60;
  let base = w * 33; // ml
  if (activityLevel === "active") base += 400;
  if (activityLevel === "very_active") base += 800;
  return Math.round(base / 50) * 50;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ---------------- Floating Bubbles Background ---------------- */
function Bubbles({ count = 14 }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 22,
        delay: Math.random() * 8,
        dur: 9 + Math.random() * 9,
        opacity: 0.08 + Math.random() * 0.18,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${b.left}%`,
            bottom: -40,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            animation: `floatUp ${b.dur}s ease-in ${b.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--op, .2); }
          100% { transform: translateY(-520px) translateX(12px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- Animated Water Bottle ---------------- */
function WaterBottle({ pct }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const waterY = 150 - clamped * 1.2; // svg coords
  return (
    <svg viewBox="0 0 140 180" className="w-28 h-36 drop-shadow-sm">
      <defs>
        <clipPath id="bottleClip">
          <path d="M50 8 h40 v18 c14 8 20 22 20 34 v90 c0 10 -8 18 -18 18 H48 c-10 0 -18 -8 -18 -18 V60 c0 -12 6 -26 20 -34 Z" />
        </clipPath>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path
        d="M50 8 h40 v18 c14 8 20 22 20 34 v90 c0 10 -8 18 -18 18 H48 c-10 0 -18 -8 -18 -18 V60 c0 -12 6 -26 20 -34 Z"
        fill="rgba(255,255,255,0.55)"
        stroke="#93C5FD"
        strokeWidth="2.5"
      />
      <g clipPath="url(#bottleClip)">
        <rect x="0" y={waterY} width="140" height="180" fill="url(#waterGrad)">
          <animate attributeName="y" dur="0.9s" values={`${waterY+10};${waterY}`} fill="freeze" />
        </rect>
        <path
          d={`M0 ${waterY} Q 17.5 ${waterY - 6}, 35 ${waterY} T 70 ${waterY} T 105 ${waterY} T 140 ${waterY} V180 H0 Z`}
          fill="#93C5FD"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            dur="3.2s"
            repeatCount="indefinite"
            values={
              `M0 ${waterY} Q 17.5 ${waterY - 6}, 35 ${waterY} T 70 ${waterY} T 105 ${waterY} T 140 ${waterY} V180 H0 Z;
               M0 ${waterY} Q 17.5 ${waterY + 6}, 35 ${waterY} T 70 ${waterY} T 105 ${waterY} T 140 ${waterY} V180 H0 Z;
               M0 ${waterY} Q 17.5 ${waterY - 6}, 35 ${waterY} T 70 ${waterY} T 105 ${waterY} T 140 ${waterY} V180 H0 Z`
            }
          />
        </path>
      </g>
      <path d="M56 2 h28 a4 4 0 0 1 4 4 v6 h-36 v-6 a4 4 0 0 1 4 -4 Z" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------------- Circular Progress Ring ---------------- */
function ProgressRing({ pct, ml, goal }) {
  const r = 78, c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf, start;
    const from = display;
    const dur = 700;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setDisplay(Math.round(from + (clamped - from) * p));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 190, height: 190 }}>
      <svg width="190" height="190" className="-rotate-90">
        <circle cx="95" cy="95" r={r} fill="none" stroke="#DBEAFE" strokeWidth="12" />
        <circle
          cx="95" cy="95" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (clamped / 100) * c}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <WaterBottle pct={clamped} />
      </div>
      <div className="absolute -bottom-1 flex flex-col items-center">
        <span className="text-2xl font-bold text-blue-600">{display}%</span>
      </div>
    </div>
  );
}

/* ---------------- Ripple Button (Quick Add) ---------------- */
function RippleButton({ children, onClick, className = "", style = {} }) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setPressed(true);
    setTimeout(() => setPressed(false), 140);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    onClick && onClick();
  };
  const transform = pressed ? "scale(0.95)" : hovered ? "translateY(-2px) scale(1.015)" : "scale(1)";
  return (
    <button
      onClick={handle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform,
        filter: hovered && !pressed ? "brightness(1.06)" : "brightness(1)",
        transition: "transform .16s ease, filter .16s ease, box-shadow .16s ease",
        cursor: "pointer",
        ...style,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/50 pointer-events-none"
          style={{ left: r.x - 40, top: r.y - 40, width: 80, height: 80, animation: "rippleAnim .6s ease-out" }}
        />
      ))}
      <style>{`
        @keyframes rippleAnim { from { transform: scale(0); opacity: .7; } to { transform: scale(2.4); opacity: 0; } }
      `}</style>
    </button>
  );
}

/* ---------------- Glass Card wrapper ---------------- */
function GlassCard({ children, className = "", style = {}, tint }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/55 backdrop-blur-xl border border-white/70 rounded-3xl ${className}`}
      style={{
        boxShadow: "0 8px 30px -8px rgba(59,130,246,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
        ...style,
      }}
    >
      {/* top light sheen */}
      <span
        className="pointer-events-none absolute -top-8 -left-8 w-2/3 h-16 rounded-full opacity-60"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.9), transparent 70%)", filter: "blur(2px)" }}
      />
      {tint && (
        <span
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: `linear-gradient(135deg, ${tint}22, transparent 60%)` }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------------- Ambient background blobs (glass depth layer) ---------------- */
function GlassBlobs({ variant = "default" }) {
  const sets = {
    default: [
      { top: -60, left: -50, size: 220, color: COLORS.secondary, op: 0.35 },
      { top: 140, right: -70, size: 200, color: COLORS.accent, op: 0.28 },
      { bottom: -60, left: 40, size: 180, color: COLORS.primary, op: 0.2 },
    ],
    calm: [
      { top: -40, right: -60, size: 200, color: COLORS.accent, op: 0.3 },
      { bottom: 100, left: -60, size: 190, color: COLORS.secondary, op: 0.25 },
    ],
  };
  const blobs = sets[variant] || sets.default;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            width: b.size, height: b.size,
            background: b.color, opacity: b.op,
            filter: "blur(50px)",
            animation: `blobDrift ${14 + i * 3}s ease-in-out ${i * 1.2}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes blobDrift {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(14px,-18px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

/* ---------------- Phone Shell ---------------- */
function PhoneShell({ children }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: `linear-gradient(160deg, ${COLORS.bg} 0%, #EAF3FF 55%, #E0F2FE 100%)`, fontFamily: "'Inter', ui-sans-serif, system-ui" }}
    >
      <div
        className="relative w-[390px] h-[820px] rounded-[46px] overflow-hidden shadow-2xl border-[6px] border-white"
        style={{ background: COLORS.bg, boxShadow: "0 30px 60px -20px rgba(59,130,246,0.35), inset 0 0 0 1px rgba(255,255,255,0.6)" }}
      >
        <span
          className="pointer-events-none absolute top-0 left-0 w-full h-16 opacity-60 z-30"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)", mixBlendMode: "overlay" }}
        />
        {children}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
          .font-display { font-family: 'Poppins', ui-sans-serif, system-ui; }
        `}</style>
      </div>
    </div>
  );
}

/* ================= SPLASH ================= */
function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center" style={{ background: `linear-gradient(160deg, ${COLORS.primary}, ${COLORS.accent})` }}>
      <Bubbles count={10} />
      <div className="rounded-3xl bg-white/20 p-6 backdrop-blur-md" style={{ animation: "popIn 0.6s ease-out" }}>
        <Droplet size={56} color="white" fill="white" fillOpacity={0.35} />
      </div>
      <h1 className="font-display text-white text-3xl font-bold mt-5 tracking-tight">AquaTrack</h1>
      <p className="text-white/80 text-sm mt-1">Smart Hydration Management</p>
      <style>{`@keyframes popIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}

/* ================= WELCOME ================= */
function Welcome({ onLogin, onRegister }) {
  return (
    <div className="relative h-full w-full flex flex-col justify-end" style={{ background: `linear-gradient(180deg, ${COLORS.secondary} 0%, ${COLORS.primary} 60%, #2563EB 100%)` }}>
      <Bubbles count={16} />
      <div className="relative z-10 px-8 pb-10 text-center">
        <div
          className="relative overflow-hidden mx-auto mb-6 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center"
          style={{ boxShadow: "0 8px 26px -6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)" }}
        >
          <span className="pointer-events-none absolute -top-4 -left-4 w-16 h-10 rounded-full bg-white/40 blur-md" />
          <Droplet size={38} color="white" fill="white" fillOpacity={0.4} />
        </div>
        <h1 className="font-display text-white text-3xl font-bold leading-tight">Stay Hydrated.<br/>Stay Healthy.</h1>
        <p className="text-white/85 text-sm mt-3 leading-relaxed">
          AquaTrack learns your drinking patterns and helps you build a hydration habit that sticks — with reminders only when you actually need them.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <RippleButton onClick={onRegister} className="w-full py-4 rounded-2xl bg-white text-blue-600 font-semibold shadow-lg">
            Create Account
          </RippleButton>
          <RippleButton
            onClick={onLogin}
            className="w-full py-4 rounded-2xl bg-white/15 border border-white/40 text-white font-semibold backdrop-blur-xl"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }}
          >
            Login
          </RippleButton>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Auth Shell (vivid gradient backdrop for Login/Register) ---------------- */
function AuthShell({ children }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${COLORS.primary} 0%, #2C7BF2 40%, ${COLORS.accent} 100%)` }}
    >
      <Bubbles count={16} />
      <GlassBlobs variant="calm" />
      <div className="relative z-10 h-full overflow-y-auto pb-10">{children}</div>
    </div>
  );
}
function Login({ onBack, onSubmit, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!isValidEmail(email)) { setError("Please enter a valid email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setError("");
    onSubmit();
  };
  return (
    <AuthShell>
      <TopBar onBack={onBack} title="" light />
      <div className="px-6 pt-4">
        <GlassCard
          className="p-7"
          style={{ boxShadow: "0 30px 70px -20px rgba(8,47,110,0.55), inset 0 1px 0 rgba(255,255,255,0.95)" }}
        >
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)", boxShadow: "0 14px 30px -10px rgba(59,130,246,0.6)" }}
            >
              <Droplet size={28} color="white" fill="white" fillOpacity={0.35} />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1 text-center">Login to continue your hydration streak.</p>
          </div>

          <div className="space-y-4">
            <Field label="Email">
              <input value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} type="email" placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
            </Field>
            <Field label="Password">
              <div className="flex items-center">
                <input value={password} onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }} type={showPw ? "text" : "password"} placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
                <button onClick={() => setShowPw((s) => !s)} className="text-slate-400 hover:text-blue-500 transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500">
                <input type="checkbox" checked={remember} onChange={() => setRemember((r) => !r)} className="accent-blue-500 w-4 h-4 rounded" />
                Remember me
              </label>
              <button className="text-blue-500 font-medium hover:underline hover:text-blue-600 transition">Forgot password?</button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mt-5 text-center" style={{ animation: "fadeUp .2s ease-out" }}>
              {error}
            </p>
          )}

          <RippleButton
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl text-white font-semibold mt-8 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)", boxShadow: "0 16px 34px -10px rgba(37,99,235,0.55)" }}
          >
            Login
          </RippleButton>
          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{" "}
            <button onClick={onGoRegister} className="text-blue-500 font-semibold hover:underline hover:text-blue-600 transition">Create Account</button>
          </p>
        </GlassCard>
      </div>
    </AuthShell>
  );
}

/* ================= REGISTER (multi-step) ================= */
const digitsOnly = (v) => v.replace(/\D/g, "");
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function validateStep(step, form) {
  if (step === 0) {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!isValidEmail(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
  }
  if (step === 1) {
    const age = Number(form.age);
    if (!form.age || age < 5 || age > 120) return "Please enter a valid age (5–120).";
  }
  if (step === 2) {
    const h = Number(form.height);
    const w = Number(form.weight);
    if (!form.height || h < 50 || h > 250) return "Please enter a valid height (50–250 cm).";
    if (!form.weight || w < 20 || w > 300) return "Please enter a valid weight (20–300 kg).";
  }
  return "";
}

function Register({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    age: "", gender: "female", height: "", weight: "",
    activityLevel: "moderate", wakeTime: "07:00", sleepTime: "23:00",
  });
  const steps = ["Account", "About You", "Body", "Activity", "Schedule"];
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); if (error) setError(""); };

  const next = () => {
    const err = validateStep(step, form);
    if (err) { setError(err); return; }
    setError("");
    step < steps.length - 1 ? setStep(step + 1) : onComplete(form);
  };

  return (
    <AuthShell>
      <TopBar onBack={step === 0 ? onBack : () => { setError(""); setStep(step - 1); }} title="" light />
      <div className="px-6 pt-2">
        <GlassCard
          className="p-7"
          style={{ boxShadow: "0 30px 70px -20px rgba(8,47,110,0.55), inset 0 1px 0 rgba(255,255,255,0.95)" }}
        >
          <div className="flex flex-col items-center mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)", boxShadow: "0 14px 30px -10px rgba(59,130,246,0.6)" }}
            >
              <Sparkles size={24} color="white" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-800">Create Account</h2>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  background: i <= step ? "linear-gradient(90deg,#3B82F6,#06B6D4)" : "#E2E8F0",
                  boxShadow: i <= step ? "0 0 8px rgba(59,130,246,0.6)" : "none",
                }}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">{steps[step]}</p>

          {step === 0 && (
            <div className="space-y-4 mt-4">
              <Field label="Full Name"><input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="w-full bg-transparent outline-none" placeholder="Alex Carter" /></Field>
              <Field label="Email"><input value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-transparent outline-none" placeholder="you@example.com" /></Field>
              <Field label="Password"><input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className="w-full bg-transparent outline-none" placeholder="••••••••" /></Field>
              <Field label="Confirm Password"><input type="password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} className="w-full bg-transparent outline-none" placeholder="••••••••" /></Field>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4 mt-4">
              <Field label="Age">
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3}
                  value={form.age} onChange={(e) => set("age", digitsOnly(e.target.value))}
                  className="w-full bg-transparent outline-none" placeholder="28"
                />
              </Field>
              <div>
                <p className="text-xs text-slate-500 mb-2 ml-1">Gender</p>
                <div className="grid grid-cols-3 gap-2">
                  {["female", "male", "other"].map((g) => (
                    <Chip key={g} active={form.gender === g} onClick={() => set("gender", g)} label={g[0].toUpperCase() + g.slice(1)} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 mt-4">
              <Field label="Height (cm)">
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3}
                  value={form.height} onChange={(e) => set("height", digitsOnly(e.target.value))}
                  className="w-full bg-transparent outline-none" placeholder="170"
                />
              </Field>
              <Field label="Weight (kg)">
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3}
                  value={form.weight} onChange={(e) => set("weight", digitsOnly(e.target.value))}
                  className="w-full bg-transparent outline-none" placeholder="65"
                />
              </Field>
            </div>
          )}
          {step === 3 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-2 ml-1">Activity Level</p>
              <div className="space-y-2">
                {[
                  { k: "low", label: "Low", desc: "Mostly sitting, little exercise" },
                  { k: "moderate", label: "Moderate", desc: "Light exercise a few times/week" },
                  { k: "active", label: "Active", desc: "Regular workouts" },
                  { k: "very_active", label: "Very Active", desc: "Intense daily training" },
                ].map((o) => (
                  <button key={o.k} onClick={() => set("activityLevel", o.k)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 ${form.activityLevel === o.k ? "border-blue-400 bg-blue-50/80" : "border-white/70 bg-white/40 backdrop-blur-md hover:border-blue-300 hover:bg-white/70 hover:-translate-y-0.5"}`}>
                    <p className="font-semibold text-slate-700 text-sm">{o.label}</p>
                    <p className="text-xs text-slate-500">{o.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4 mt-4">
              <Field label="Wake-up Time"><input type="time" value={form.wakeTime} onChange={(e) => set("wakeTime", e.target.value)} className="w-full bg-transparent outline-none" /></Field>
              <Field label="Sleep Time"><input type="time" value={form.sleepTime} onChange={(e) => set("sleepTime", e.target.value)} className="w-full bg-transparent outline-none" /></Field>
              <GlassCard className="p-4 mt-2" tint={COLORS.primary}>
                <p className="text-sm text-slate-600">Based on your info, your estimated daily goal will be <span className="font-bold text-blue-600">{calcGoal(form)} mL</span>.</p>
              </GlassCard>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mt-5 text-center" style={{ animation: "fadeUp .2s ease-out" }}>
              {error}
            </p>
          )}

          <RippleButton
            onClick={next}
            className="w-full py-4 rounded-2xl text-white font-semibold mt-8 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)", boxShadow: "0 16px 34px -10px rgba(37,99,235,0.55)" }}
          >
            {step === steps.length - 1 ? "Finish & Go to Dashboard" : "Continue"}
          </RippleButton>
        </GlassCard>
      </div>
    </AuthShell>
  );
}

function Chip({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
        active
          ? "bg-blue-500 border-blue-500 text-white hover:brightness-110"
          : "bg-white/60 border-slate-100 text-slate-600 hover:border-blue-300 hover:bg-blue-50/70 hover:-translate-y-0.5"
      }`}
    >
      {label}
    </button>
  );
}
function Field({ label, children }) {
  return (
    <div
      className="bg-white/55 backdrop-blur-xl border border-white/70 rounded-2xl px-4 py-3 transition-all duration-150 hover:border-blue-200 hover:bg-white/65 focus-within:border-blue-300 focus-within:bg-white/75"
      style={{ boxShadow: "0 4px 18px -6px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.85)" }}
    >
      <p className="text-[11px] text-slate-400 mb-0.5">{label}</p>
      {children}
    </div>
  );
}
function TopBar({ onBack, title }) {
  return (
    <div className="relative z-10 flex items-center px-5 pt-6 pb-2">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-xl border border-white/70 flex items-center justify-center transition hover:scale-110 hover:bg-white/80 active:scale-95"
        style={{ boxShadow: "0 4px 14px -4px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.9)" }}
      >
        <ChevronLeft size={18} className="text-slate-600" />
      </button>
      {title && <h3 className="ml-3 font-semibold text-slate-700">{title}</h3>}
    </div>
  );
}
function ScreenScroll({ children, blobVariant = "default" }) {
  return (
    <div className="relative h-full w-full overflow-y-auto pb-8" style={{ background: COLORS.bg }}>
      <div className="fixed w-[378px]" style={{ height: 820 }}>
        <GlassBlobs variant={blobVariant} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ================= DASHBOARD ================= */
function Dashboard({ user, logs, addWater, dailyGoal }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const [toast, setToast] = useState(null);
  const totalToday = logs.reduce((s, l) => s + l.amount, 0);
  const pct = Math.round((totalToday / dailyGoal) * 100);
  const remaining = Math.max(0, dailyGoal - totalToday);

  const messages = pct >= 100
    ? "Excellent! You've hit today's goal 🎉"
    : remaining < 400
    ? `Almost there — only ${remaining} mL remaining.`
    : pct < 30 && new Date().getHours() >= 14
    ? "You usually drink less in the afternoon — a good time for a glass now."
    : "You're on track. Keep the streak alive!";

  const fire = (amt) => {
    addWater(amt);
    setToast("Great! Keep it up!");
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <ScreenScroll>
      <div className="px-6 pt-8 pb-3 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs">Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"},</p>
          <h2 className="font-display text-xl font-bold text-slate-800">{user.fullName?.split(" ")[0] || "Alex"}</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {(user.fullName || "A").charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="px-6 grid grid-cols-3 gap-2 mb-4">
        <StatMini label="Goal" value={`${(dailyGoal/1000).toFixed(1)}L`} />
        <StatMini label="Intake" value={`${(totalToday/1000).toFixed(2)}L`} />
        <StatMini label="Left" value={`${(remaining/1000).toFixed(2)}L`} />
      </div>

      <div className="flex justify-center py-2 relative">
        <ProgressRing pct={pct} ml={totalToday} goal={dailyGoal} />
        {toast && (
          <div className="absolute -bottom-2 bg-blue-500 text-white text-xs px-4 py-2 rounded-full shadow-lg" style={{ animation: "fadeUp .3s ease-out" }}>
            {toast}
          </div>
        )}
      </div>
      <p className="text-center text-slate-500 text-xs mb-4">{totalToday} mL of {dailyGoal} mL today</p>

      <div className="px-6 grid grid-cols-4 gap-2 mb-2">
        {[250, 500, 750, 1000].map((amt) => (
          <RippleButton
            key={amt}
            onClick={() => fire(amt)}
            className="py-3 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 text-blue-600 font-semibold text-xs"
            style={{ boxShadow: "0 6px 18px -6px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.9)" }}
          >
            +{amt}mL
          </RippleButton>
        ))}
      </div>
      <div className="px-6 mb-5">
        {!customOpen ? (
          <button
            onClick={() => setCustomOpen(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-blue-300/70 bg-white/25 backdrop-blur-md text-blue-400 text-xs font-medium flex items-center justify-center gap-1 transition-all duration-150 hover:border-blue-400 hover:bg-white/45 hover:text-blue-500"
          >
            <Plus size={14} /> Custom Amount
          </button>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                autoFocus type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4}
                value={customVal}
                onChange={(e) => setCustomVal(digitsOnly(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = Number(customVal);
                    if (n > 0 && n <= 5000) { fire(n); setCustomVal(""); setCustomOpen(false); }
                  }
                }}
                placeholder="mL"
                className="flex-1 rounded-2xl border border-blue-200/70 px-4 py-2.5 bg-white/60 backdrop-blur-xl outline-none text-sm"
              />
              <button
                onClick={() => {
                  const n = Number(customVal);
                  if (n > 0 && n <= 5000) { fire(n); setCustomVal(""); setCustomOpen(false); }
                }}
                disabled={!(Number(customVal) > 0 && Number(customVal) <= 5000)}
                className="px-4 rounded-2xl bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-300/40 disabled:opacity-40 disabled:shadow-none transition"
              >
                Add
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
              {Number(customVal) > 5000 ? "Max 5,000 mL per entry." : "Enter an amount between 1–5,000 mL."}
            </p>
          </div>
        )}
      </div>

      <div className="px-6 mb-5">
        <GlassCard className="p-4 flex gap-3 items-start" tint={COLORS.accent}>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0"><Sparkles size={16} className="text-cyan-600" /></div>
          <div>
            <p className="text-xs font-semibold text-cyan-700 mb-0.5">Hydration Coach</p>
            <p className="text-sm text-slate-600 leading-snug">{messages}</p>
          </div>
        </GlassCard>
      </div>

      <div className="px-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-2">Today's Timeline</h3>
        <div className="space-y-2">
          {logs.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No water logged yet — tap a button above to start.</p>}
          {[...logs].reverse().map((l) => (
            <GlassCard key={l.id} className="px-4 py-3 flex items-center justify-between" style={{ animation: "fadeUp .3s ease-out" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Droplet size={14} className="text-blue-500" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{l.amount} mL</p>
                  <p className="text-[11px] text-slate-400">{l.time}</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">Completed</span>
            </GlassCard>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }`}</style>
    </ScreenScroll>
  );
}
function StatMini({ label, value }) {
  return (
    <GlassCard className="py-2.5 text-center">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </GlassCard>
  );
}

/* ================= HISTORY ================= */
function History({ logs, onDelete }) {
  const [filter, setFilter] = useState("Today");
  return (
    <ScreenScroll>
      <div className="px-6 pt-8 pb-3">
        <h2 className="font-display text-xl font-bold text-slate-800 mb-4">History</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Today", "Yesterday", "Last Week", "Last Month"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${filter === f ? "bg-blue-500 text-white hover:brightness-110" : "bg-white/70 text-slate-500 hover:bg-blue-50 hover:text-blue-500"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 space-y-2">
        {logs.length === 0 && <p className="text-xs text-slate-400 text-center py-10">No records for this period yet.</p>}
        {[...logs].reverse().map((l) => (
          <GlassCard key={l.id} className="px-4 py-3 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Droplet size={14} className="text-blue-500" /></div>
              <div>
                <p className="text-sm font-medium text-slate-700">{l.amount} mL</p>
                <p className="text-[11px] text-slate-400">{l.time} · Today</p>
              </div>
            </div>
            <button onClick={() => onDelete(l.id)} className="text-slate-300 hover:text-red-400 hover:scale-110 transition"><X size={16} /></button>
          </GlassCard>
        ))}
      </div>
    </ScreenScroll>
  );
}

/* ================= ANALYTICS ================= */
function Analytics({ logs, dailyGoal, streak }) {
  const weekly = useMemo(() => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    return days.map((d, i) => ({
      day: d,
      ml: i === todayIdx ? logs.reduce((s,l)=>s+l.amount,0) : Math.round(dailyGoal * (0.55 + Math.random()*0.6)),
    }));
  }, [logs, dailyGoal]);

  const monthly = useMemo(() => Array.from({length: 6}).map((_,i)=>({
    m: ["Feb","Mar","Apr","May","Jun","Jul"][i],
    pct: Math.round(60 + Math.random()*35),
  })), []);

  const totalToday = logs.reduce((s,l)=>s+l.amount,0);
  const completion = Math.min(100, Math.round((totalToday/dailyGoal)*100));
  const pieData = [{ name: "Done", value: completion }, { name: "Left", value: 100-completion }];

  return (
    <ScreenScroll>
      <div className="px-6 pt-8 pb-2">
        <h2 className="font-display text-xl font-bold text-slate-800 mb-4">Analytics</h2>
      </div>
      <div className="px-6 grid grid-cols-2 gap-3 mb-4">
        <GlassCard className="p-4">
          <p className="text-[11px] text-slate-400">Longest Streak</p>
          <p className="text-lg font-bold text-blue-600 flex items-center gap-1"><Flame size={16} className="text-orange-400" />{streak} days</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[11px] text-slate-400">Avg Daily</p>
          <p className="text-lg font-bold text-blue-600">{Math.round(weekly.reduce((s,d)=>s+d.ml,0)/7)} mL</p>
        </GlassCard>
      </div>

      <div className="px-6 mb-4">
        <GlassCard className="p-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">Weekly Intake (mL)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EEFB" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="ml" fill={COLORS.primary} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="px-6 mb-4">
        <GlassCard className="p-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">Monthly Goal Completion</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={monthly}>
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0,100]} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="pct" stroke={COLORS.accent} strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="px-6 mb-6">
        <GlassCard className="p-4 flex items-center gap-4">
          <ResponsiveContainer width={90} height={90}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={28} outerRadius={40} startAngle={90} endAngle={-270}>
                <Cell fill={COLORS.primary} />
                <Cell fill="#DBEAFE" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div>
            <p className="text-xs font-semibold text-slate-500">Today's Completion</p>
            <p className="text-2xl font-bold text-blue-600">{completion}%</p>
          </div>
        </GlassCard>
      </div>
    </ScreenScroll>
  );
}

/* ================= ACHIEVEMENTS ================= */
function Achievements({ stats, justUnlocked }) {
  return (
    <ScreenScroll>
      <div className="px-6 pt-8 pb-4">
        <h2 className="font-display text-xl font-bold text-slate-800">Achievements</h2>
        <p className="text-slate-400 text-xs mt-1">Unlock badges as you build your hydration habit.</p>
      </div>
      <div className="px-6 grid grid-cols-2 gap-3 relative">
        {ACHIEVEMENT_DEFS.map((a) => {
          const current = stats[a.metric] || 0;
          const unlocked = current >= a.goal;
          const Icon = a.icon;
          const isNew = justUnlocked === a.id;
          return (
            <GlassCard key={a.id} className={`p-4 flex flex-col items-center text-center transition-all duration-150 ${unlocked ? "hover:-translate-y-1 hover:shadow-lg cursor-pointer" : "opacity-45 grayscale"}`}
              style={isNew ? { animation: "popIn .5s ease-out" } : {}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2" style={{ background: unlocked ? "linear-gradient(135deg,#3B82F6,#06B6D4)" : "#E2E8F0" }}>
                <Icon size={20} color="white" />
              </div>
              <p className="text-xs font-semibold text-slate-700">{a.name}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{a.desc}</p>
              {!unlocked && <p className="text-[10px] text-blue-400 mt-1.5">{Math.min(current,a.goal)}/{a.goal}</p>}
            </GlassCard>
          );
        })}
      </div>
      {justUnlocked && <Confetti />}
      <style>{`@keyframes popIn { 0% { transform: scale(.6); opacity:0; } 60% { transform: scale(1.08);} 100% { transform: scale(1); opacity:1; } }`}</style>
    </ScreenScroll>
  );
}
function Confetti() {
  const pieces = useMemo(() => Array.from({length: 26}).map((_,i)=>({
    id:i, left: Math.random()*100, color: [COLORS.primary,COLORS.accent,COLORS.warning,COLORS.success][i%4],
    delay: Math.random()*0.4, rot: Math.random()*360,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {pieces.map(p => (
        <span key={p.id} className="absolute w-2 h-3 rounded-sm" style={{
          left: `${p.left}%`, top: -10, background: p.color,
          animation: `confettiFall 1.6s ease-in ${p.delay}s forwards`, transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
      <style>{`@keyframes confettiFall { to { transform: translateY(760px) rotate(400deg); opacity: 0; } }`}</style>
    </div>
  );
}

/* ================= PROFILE ================= */
function Profile({ user, dailyGoal, onLogout, onEdit }) {
  return (
    <ScreenScroll>
      <div className="px-6 pt-8 pb-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
          {(user.fullName || "A").charAt(0).toUpperCase()}
        </div>
        <h2 className="font-display text-lg font-bold text-slate-800 mt-3">{user.fullName || "Alex Carter"}</h2>
        <p className="text-slate-400 text-xs">{user.email || "alex@example.com"}</p>
      </div>

      <div className="px-6 grid grid-cols-2 gap-3 mb-4">
        <InfoTile label="Age" value={user.age || "—"} />
        <InfoTile label="Gender" value={user.gender || "—"} />
        <InfoTile label="Height" value={user.height ? `${user.height} cm` : "—"} />
        <InfoTile label="Weight" value={user.weight ? `${user.weight} kg` : "—"} />
        <InfoTile label="Activity" value={(user.activityLevel || "moderate").replace("_"," ")} />
        <InfoTile label="Daily Goal" value={`${dailyGoal} mL`} />
      </div>

      <div className="px-6 space-y-2">
        <ProfileRow icon={Edit3} label="Edit Profile" onClick={onEdit} />
        <ProfileRow icon={Lock} label="Change Password" />
        <ProfileRow icon={Bell} label="Reminder Settings" />
        <ProfileRow icon={LogOut} label="Logout" danger onClick={onLogout} />
      </div>
    </ScreenScroll>
  );
}
function InfoTile({ label, value }) {
  return (
    <GlassCard className="p-3 text-center">
      <p className="text-[10px] text-slate-400 capitalize">{label}</p>
      <p className="text-sm font-semibold text-slate-700 capitalize">{value}</p>
    </GlassCard>
  );
}
function ProfileRow({ icon: Icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-white/60 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${danger ? "hover:bg-red-50/70 hover:border-red-100" : "hover:bg-white/90"}`}>
      <span className={`flex items-center gap-3 text-sm font-medium ${danger ? "text-red-500" : "text-slate-700"}`}>
        <Icon size={16} /> {label}
      </span>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}

/* ================= SETTINGS ================= */
function SettingsScreen({ units, setUnits }) {
  const [notif, setNotif] = useState(true);
  const [theme, setTheme] = useState("light");
  return (
    <ScreenScroll>
      <div className="px-6 pt-8 pb-4">
        <h2 className="font-display text-xl font-bold text-slate-800">Settings</h2>
      </div>
      <div className="px-6 space-y-2">
        <ToggleRow icon={Moon} label="Dark Theme" checked={theme === "dark"} onChange={() => setTheme(t => t === "dark" ? "light" : "dark")} />
        <ToggleRow icon={Bell} label="Notifications" checked={notif} onChange={() => setNotif(n => !n)} />
        <div className="w-full flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-white/60 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/90">
          <span className="flex items-center gap-3 text-sm font-medium text-slate-700"><Ruler size={16}/> Units</span>
          <div className="flex bg-slate-100 rounded-full p-1">
            {["mL","oz"].map(u => (
              <button key={u} onClick={()=>setUnits(u)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${units===u ? "bg-blue-500 text-white hover:brightness-110" : "text-slate-500 hover:text-blue-500 hover:bg-white"}`}>{u}</button>
            ))}
          </div>
        </div>
        <ProfileRow icon={Globe} label="Language" />
        <ProfileRow icon={Lock} label="Privacy" />
        <ProfileRow icon={HelpCircle} label="Help" />
        <ProfileRow icon={Info} label="About" />
        <ProfileRow icon={X} label="Delete Account" danger />
      </div>
    </ScreenScroll>
  );
}
function ToggleRow({ icon: Icon, label, checked, onChange }) {
  return (
    <div className="w-full flex items-center justify-between bg-white/70 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-white/60 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:bg-white/90">
      <span className="flex items-center gap-3 text-sm font-medium text-slate-700"><Icon size={16} /> {label}</span>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition relative hover:brightness-105 ${checked ? "bg-blue-500" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

/* ================= BOTTOM NAV ================= */
function BottomNav({ active, setActive }) {
  const items = [
    { k: "dashboard", icon: Home, label: "Home" },
    { k: "history", icon: Clock, label: "History" },
    { k: "analytics", icon: BarChart3, label: "Stats" },
    { k: "achievements", icon: Trophy, label: "Badges" },
    { k: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div className="absolute left-4 right-4 bottom-4 z-20">
      <div
        className="relative overflow-hidden flex justify-around px-2 py-2.5 rounded-[28px] bg-white/55 backdrop-blur-2xl border border-white/80"
        style={{ boxShadow: "0 12px 34px -10px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.9)" }}
      >
        <span
          className="pointer-events-none absolute -top-6 left-4 w-2/3 h-10 rounded-full opacity-70"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.9), transparent 70%)" }}
        />
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.k;
          return (
            <button key={it.k} onClick={() => setActive(it.k)} className="relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl transition-all duration-150 hover:-translate-y-0.5"
              style={{ background: isActive ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.12))" : "transparent" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(59,130,246,0.08)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={19} style={{ color: isActive ? COLORS.primary : "#94A3B8" }} />
              <span className="text-[9.5px] font-medium" style={{ color: isActive ? COLORS.primary : "#94A3B8" }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================= APP ROOT ================= */
export default function App() {
  const [screen, setScreen] = useState("splash"); // splash, welcome, login, register, app
  const [tab, setTab] = useState("dashboard");
  const [units, setUnits] = useState("mL");
  const [user, setUser] = useState({ fullName: "", email: "", age: "", gender: "", height: "", weight: "", activityLevel: "moderate" });
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [logs, setLogs] = useState([]); // today's logs
  const [goalsHit, setGoalsHit] = useState(0);
  const [streak, setStreak] = useState(4);
  const [justUnlocked, setJustUnlocked] = useState(null);
  const prevUnlockedRef = useRef(new Set());

  const totalToday = logs.reduce((s, l) => s + l.amount, 0);

  useEffect(() => {
    if (totalToday >= dailyGoal && logs.length > 0 && !prevUnlockedRef.current.has("goal_hit_today")) {
      prevUnlockedRef.current.add("goal_hit_today");
      setGoalsHit((g) => g + 1);
    }
  }, [totalToday, dailyGoal, logs.length]);

  const stats = {
    totalLogs: logs.length,
    goalsHit,
    streak,
    totalMl: totalToday + 42000, // seed some lifetime volume for demo realism
    perfectMonth: 0,
  };

  useEffect(() => {
    for (const a of ACHIEVEMENT_DEFS) {
      const val = stats[a.metric] || 0;
      if (val >= a.goal && !prevUnlockedRef.current.has(a.id)) {
        prevUnlockedRef.current.add(a.id);
        setJustUnlocked(a.id);
        setTimeout(() => setJustUnlocked(null), 1800);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, goalsHit, streak]);

  const addWater = (amount) => {
    setLogs((l) => [...l, { id: Date.now(), amount, time: timeNow() }]);
  };
  const deleteLog = (id) => setLogs((l) => l.filter((x) => x.id !== id));

  const completeRegister = (form) => {
    setUser(form);
    setDailyGoal(calcGoal(form));
    setScreen("app");
    setTab("dashboard");
  };
  const completeLogin = () => {
    setUser((u) => (u.fullName ? u : { ...u, fullName: "Alex Carter", email: "alex@example.com" }));
    setDailyGoal((g) => g || 2500);
    setScreen("app");
    setTab("dashboard");
  };

  return (
    <PhoneShell>
      {screen === "splash" && <Splash onDone={() => setScreen("welcome")} />}
      {screen === "welcome" && <Welcome onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />}
      {screen === "login" && (
        <Login onBack={() => setScreen("welcome")} onGoRegister={() => setScreen("register")} onSubmit={completeLogin} />
      )}
      {screen === "register" && <Register onBack={() => setScreen("welcome")} onComplete={completeRegister} />}
      {screen === "app" && (
        <div className="relative h-full w-full">
          {tab === "dashboard" && <Dashboard user={user} logs={logs} addWater={addWater} dailyGoal={dailyGoal} />}
          {tab === "history" && <History logs={logs} onDelete={deleteLog} />}
          {tab === "analytics" && <Analytics logs={logs} dailyGoal={dailyGoal} streak={streak} />}
          {tab === "achievements" && <Achievements stats={stats} justUnlocked={justUnlocked} />}
          {tab === "profile" && <Profile user={user} dailyGoal={dailyGoal} onLogout={() => setScreen("welcome")} onEdit={() => setTab("settings")} />}
          {tab === "settings" && <SettingsScreen units={units} setUnits={setUnits} />}
          <div className="h-24" />
          <BottomNav active={tab === "settings" ? "profile" : tab} setActive={setTab} />
        </div>
      )}
    </PhoneShell>
  );
}


