import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import meshGradient from "../../assets/images/mesh-gradient.webp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    setLocalError("");
    try {
      const userData = await login(email, password);
      
      if (userData) {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${meshGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-[460px] px-8 py-10 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h1 className="text-white text-4xl font-semibold">Login</h1>
            </div>
            {localError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                <span className="text-red-200 text-sm font-medium">{localError}</span>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-semibold uppercase">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter Email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold uppercase">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-8 rounded-xl shadow-lg shadow-purple-500/25 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              style={{ backgroundColor: "#AA1E6B" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white text-base font-semibold uppercase">
                    Logging in...
                  </span>
                </div>
              ) : (
                <span className="text-white text-base font-semibold uppercase">Submit</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
