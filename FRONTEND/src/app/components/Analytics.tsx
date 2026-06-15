import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, AlertTriangle, Activity } from "lucide-react";

const COLORS = ['#2563EB', '#F59E0B', '#16A34A', '#DC2626', '#8B5CF6', '#EC4899', '#14B8A6'];

const TREND_DATA = [
  { day: "Mon", patients: 8, critical: 1 },
  { day: "Tue", patients: 8, critical: 2 },
  { day: "Wed", patients: 9, critical: 2 },
  { day: "Thu", patients: 8, critical: 1 },
  { day: "Fri", patients: 9, critical: 2 },
  { day: "Sat", patients: 9, critical: 3 },
  { day: "Today", patients: 0, critical: 0 }, // filled below
];

export function Analytics() {
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard");
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000,
  });

  const patients: any[] = dashboardData?.patients || [];
  const stats = dashboardData?.stats || {};

  const stableCount: number = stats.stable_count || 0;
  const moderateCount: number = stats.moderate_count || 0;
  const criticalCount: number = stats.critical_count || 0;
  const totalPatients: number = stats.total_patients || 0;
  const avgRiskScore: number = Math.round(stats.average_risk_score || 0);

  // Category distribution from real patients
  const categoryData = Object.values(
    patients.reduce((acc: Record<string, { name: string; value: number }>, p: any) => {
      const cat = p.category || "Unknown";
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += 1;
      return acc;
    }, {})
  );

  // Risk distribution
  const riskData = [
    { range: "0–30",  count: patients.filter((p: any) => p.risk_score <= 30).length },
    { range: "31–50", count: patients.filter((p: any) => p.risk_score > 30 && p.risk_score <= 50).length },
    { range: "51–70", count: patients.filter((p: any) => p.risk_score > 50 && p.risk_score <= 70).length },
    { range: "71–100",count: patients.filter((p: any) => p.risk_score > 70).length },
  ];

  // Trend with today filled in
  const trendData = TREND_DATA.map((d, i) =>
    i === TREND_DATA.length - 1
      ? { ...d, patients: totalPatients, critical: criticalCount }
      : d
  );

  return (
    <div className="p-8 space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Total Patients", value: totalPatients, icon: Users, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "Stable",          value: stableCount,   icon: Activity,      color: "text-[#16A34A]", bg: "bg-green-50" },
          { label: "At Risk",         value: moderateCount + criticalCount, icon: AlertTriangle, color: "text-[#F59E0B]", bg: "bg-amber-50" },
          { label: "Avg Risk Score",  value: avgRiskScore,  icon: TrendingUp,    color: "text-purple-600", bg: "bg-purple-50" },
        ].map(kpi => (
          <Card key={kpi.label} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold text-[#0F172A]">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base">Patient Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base">Risk Score Distribution (Live)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base">Weekly Patient Trend (Today reflects live data)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#2563EB" strokeWidth={2} name="Total Patients" />
              <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2} name="Critical Patients" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
