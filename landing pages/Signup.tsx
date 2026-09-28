import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  Mail,
  Lock,
  Building2,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !fullName ||
      !email ||
      !department ||
      !role ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid official email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please agree to the access policy.");
      return;
    }

    // Demo success state
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white text-[#0F1D33]">
        {/* HEADER */}
        <header className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F1D33]">
                <Shield
                  size={24}
                  strokeWidth={2}
                  className="text-[#00C7A5]"
                />
              </div>

              <div className="text-2xl font-extrabold tracking-tight">
                <span className="text-[#0F1D33]">RE</span>
                <span className="text-[#2563EB]">settle</span>
                <span className="text-[#2563EB]">AI</span>
              </div>
            </Link>
          </div>
        </header>

        {/* SUCCESS CONTENT */}
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-[0_12px_40px_rgba(15,29,51,0.07)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
              <CheckCircle2
                size={36}
                className="text-[#059669]"
              />
            </div>

            <h1 className="text-2xl font-extrabold text-[#0F1D33]">
              Request Submitted
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#5F6B7A]">
              Your authority access request has been submitted successfully.
              The administrator will review your details and contact you after
              approval.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14233B] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0F1D33]"
            >
              Return to Login
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0F1D33]">


      {/* HEADER */}
      <header className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">


          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F1D33]">
              <Shield
                size={24}
                strokeWidth={2}
                className="text-[#00C7A5]"
              />
            </div>

            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-[#0F1D33]">RE</span>
              <span className="text-[#2563EB]">settle</span>
              <span className="text-[#2563EB]">AI</span>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center space-x-8">
            <a href="/home" className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              Home
            </a>
            <a href="/about" className="text-sm font-medium text-slate-600 hover:text-[#0A192F] transition-colors">
              About
            </a>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-700 hover:text-[#0A192F] transition-colors"
            >
              Authority Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-sm font-medium bg-[#0A192F] text-white px-4 py-2.5 rounded-md hover:bg-slate-800 transition-all shadow-sm"
            >
              Authority Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex justify-center px-5 py-12 sm:py-16">
        <div className="w-full max-w-2xl">


          {/* TOP LABEL */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F1D33] shadow-lg">
              <Shield
                size={34}
                strokeWidth={2}
                className="text-[#00C7A5]"
              />
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              Authority Registration
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F1D33]">
              Request access to REsettleAI
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#5F6B7A]">
              Submit your official details to request access to the disaster
              management and relocation platform.
            </p>
          </div>

          {/* SIGNUP CARD */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(15,29,51,0.07)] sm:p-8">


            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">


              {/* FULL NAME AND EMAIL */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-bold text-[#0F1D33]"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                    />

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-4 text-sm text-[#0F1D33] outline-none transition placeholder:text-[#8A94A3] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#0F1D33]"
                  >
                    Official Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="official@email.com"
                      className="w-full rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-4 text-sm text-[#0F1D33] outline-none transition placeholder:text-[#8A94A3] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* DEPARTMENT AND ROLE */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                
                {/* DEPARTMENT */}
                <div>
                  <label
                    htmlFor="department"
                    className="mb-2 block text-sm font-bold text-[#0F1D33]"
                  >
                    Department
                  </label>

                  <div className="relative">
                    <Building2
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                    />

                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-4 text-sm text-[#0F1D33] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select department</option>
                      <option value="disaster-management">
                        Disaster Management
                      </option>
                      <option value="municipal-corporation">
                        Municipal Corporation
                      </option>
                      <option value="district-administration">
                        District Administration
                      </option>
                      <option value="revenue-department">
                        Revenue Department
                      </option>
                      <option value="emergency-services">
                        Emergency Services
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* ROLE */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-bold text-[#0F1D33]"
                  >
                    Authority Role
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                    />

                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-4 text-sm text-[#0F1D33] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select role</option>
                      <option value="district-officer">
                        District Officer
                      </option>
                      <option value="disaster-coordinator">
                        Disaster Coordinator
                      </option>
                      <option value="municipal-officer">
                        Municipal Officer
                      </option>
                      <option value="relocation-officer">
                        Relocation Officer
                      </option>
                      <option value="field-officer">Field Officer</option>
                      <option value="administrator">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-bold text-[#0F1D33]"
                >
                  District / Operational Location
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                  />

                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter district or operational location"
                    className="w-full rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-4 text-sm text-[#0F1D33] outline-none transition placeholder:text-[#8A94A3] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PASSWORDS */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#0F1D33]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-12 text-sm text-[#0F1D33] outline-none transition placeholder:text-[#8A94A3] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A94A3] transition hover:text-[#0F1D33]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-bold text-[#0F1D33]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A94A3]"
                    />

                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-[#D9DEE7] bg-[#F9FAFB] py-3.5 pl-11 pr-12 text-sm text-[#0F1D33] outline-none transition placeholder:text-[#8A94A3] focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A94A3] transition hover:text-[#0F1D33]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACCESS POLICY */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#14233B]"
                  />

                  <span className="text-sm leading-6 text-[#5F6B7A]">
                    I confirm that the information provided is accurate and I
                    agree to follow the platform's access and security policy.
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#14233B] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0F1D33] active:scale-[0.98]"
              >
                Submit Access Request

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* LOGIN LINK */}
            <div className="mt-7 border-t border-[#E5E7EB] pt-6 text-center text-sm text-[#5F6B7A]">
              Already have authority access?{" "}
              <Link
                to="/login"
                className="font-bold text-[#2563EB] transition hover:text-[#1D4ED8]"
              >
                Authority Login
              </Link>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <p className="mt-6 text-center text-xs leading-5 text-[#8A94A3]">
            Access requests are reviewed by the REsettleAI system
            administrator.
          </p>
        </div>
      </main>
    </div>
  );
}