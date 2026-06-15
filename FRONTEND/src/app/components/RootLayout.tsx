import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, UserPlus, Users, Bell, BarChart3, Settings as SettingsIcon, Activity, AlertTriangle, Sparkles, ClipboardList, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { announce } from "../lib/voiceAnnouncer";
import { cn } from "./ui/utils";
import { ShiftLoginModal } from "./ShiftLoginModal";
import { getShiftInfo, clearShiftInfo } from "../lib/shiftStore";
import { isVoiceAlertAllowed } from "../lib/settingsHelper";
import { mergeBackendAlerts } from "../lib/alertsPersister";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patient Admission", href: "/admission", icon: UserPlus },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "What-If Simulator", href: "/simulator", icon: Sparkles },
  { name: "Shift Handover", href: "/shift-report", icon: ClipboardList },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export function RootLayout() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nurseInfo, setNurseInfo] = useState<any>(null);

  useEffect(() => {
    setNurseInfo(getShiftInfo());
  }, []);

  const handleLogin = (info: any) => {
    setNurseInfo(info);
  };

  const handleSignOut = () => {
    clearShiftInfo();
    setNurseInfo(null);
    window.location.reload();
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000
  });

  useEffect(() => {
    if (dashboardData?.alerts) {
      mergeBackendAlerts(dashboardData.alerts);
    }
  }, [dashboardData]);

  const { isError: isHealthError, isSuccess: isHealthSuccess } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.get('/health');
      return res.data;
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  const lastVoiceMessageRef = useRef<string | null>(null);

  const { data: voiceData } = useQuery({
    queryKey: ['voice-alert'],
    queryFn: async () => {
      const res = await api.get('/voice-alert');
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000
  });

  useEffect(() => {
    if (voiceData?.message && lastVoiceMessageRef.current !== voiceData.message) {
      lastVoiceMessageRef.current = voiceData.message;
      const patientsList = dashboardData?.patients || [];
      if (isVoiceAlertAllowed(voiceData.message, patientsList)) {
        announce(voiceData.message);
      }
    }
  }, [voiceData, dashboardData]);

  const totalPatients = dashboardData?.stats?.total_patients || 0;
  const criticalCount = dashboardData?.stats?.critical_count || 0;
  
  if (!nurseInfo) {
    return <ShiftLoginModal onLogin={handleLogin} />;
  }
  
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-[#0F172A]">CareSync AI</h1>
              <p className="text-xs text-gray-500">Proactive Care Platform</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 space-y-3">
          {nurseInfo && (
            <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Nurse</p>
                  <p className="text-sm font-semibold text-gray-900 truncate" title={nurseInfo.nurseName}>
                    {nurseInfo.nurseName}
                  </p>
                  <p className="text-xs text-gray-500">{nurseInfo.shiftLabel}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out / Handover"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", isHealthError ? "bg-red-500" : "bg-[#16A34A]")} />
              <span className="text-xs font-medium text-gray-700">System Status</span>
            </div>
            <p className="text-xs text-gray-600">
              {isHealthError ? "Backend Unavailable" : "All systems operational"}
            </p>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isHealthError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">Backend connection unavailable. Please ensure the server is running.</span>
          </div>
        )}
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#0F172A]">
                {navigation.find(n => {
                  if (n.href === "/") return location.pathname === "/";
                  return location.pathname.startsWith(n.href);
                })?.name || "CareSync AI"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">From Reactive Care to Proactive Care</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              
              <div className="h-12 w-px bg-gray-200" />
              
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0F172A]">{totalPatients}</p>
                  <p className="text-xs text-gray-500">Total Patients</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#DC2626]">{criticalCount}</p>
                  <p className="text-xs text-gray-500">Critical</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
