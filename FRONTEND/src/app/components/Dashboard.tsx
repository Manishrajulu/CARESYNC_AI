import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, TrendingUp, AlertTriangle, Activity, Eye, Stethoscope, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { cn } from "./ui/utils";
import { isAlertAllowed } from "../lib/settingsHelper";
import { getActiveAlerts, acknowledgeAlert, resolveAlert } from "../lib/alertsPersister";

export function Dashboard() {
  const { data } = useQuery({
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

  const patients = data?.patients || [];
  
  const [localAlerts, setLocalAlerts] = useState<any[]>([]);

  useEffect(() => {
    setLocalAlerts(getActiveAlerts());
  }, [data]);

  const handleAcknowledge = (timestamp: string, patientId: string) => {
    acknowledgeAlert(timestamp, patientId);
    setLocalAlerts(getActiveAlerts());
  };

  const handleResolve = (timestamp: string, patientId: string) => {
    resolveAlert(timestamp, patientId);
    setLocalAlerts(getActiveAlerts());
  };

  const filteredAlerts = localAlerts.filter(isAlertAllowed);
  
  const stableCount = data?.stats?.stable_count || 0;
  const moderateCount = data?.stats?.moderate_count || 0;
  const criticalCount = data?.stats?.critical_count || 0;
  const avgRiskScore = data?.stats?.average_risk_score || 0;
  
  const priorityPatients = data?.priorityQueue?.slice(0, 3) || [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stable": return "bg-[#16A34A]";
      case "Moderate": return "bg-[#F59E0B]";
      case "Critical": return "bg-[#DC2626]";
      default: return "bg-gray-500";
    }
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Stable": return "default";
      case "Moderate": return "secondary";
      case "Critical": return "destructive";
      default: return "outline";
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Moderate": return "text-[#F59E0B] bg-amber-50";
      case "High": return "text-[#F59E0B] bg-amber-50";
      case "Critical": return "text-[#DC2626] bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  return (
    <div className="p-8 space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-[#0F172A]">{patients.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Stable</p>
                <p className="text-3xl font-bold text-[#16A34A]">{stableCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#16A34A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Moderate Risk</p>
                <p className="text-3xl font-bold text-[#F59E0B]">{moderateCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Critical</p>
                <p className="text-3xl font-bold text-[#DC2626]">{criticalCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Risk Score</p>
                <p className="text-3xl font-bold text-[#0F172A]">{avgRiskScore}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Main Patient Table */}
        <div className="col-span-2">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold">ICU Patient Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Bed</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Patient</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Risk Score</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Countdown</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-sm text-[#0F172A]">{patient.bed_number}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-sm text-[#0F172A]">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.age}y, {patient.gender}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-xs">{patient.category}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", getStatusColor(patient.status))} />
                            <span className={cn("text-sm font-medium", 
                              patient.status === "Stable" && "text-[#16A34A]",
                              patient.status === "Moderate" && "text-[#F59E0B]",
                              patient.status === "Critical" && "text-[#DC2626]"
                            )}>
                              {patient.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 w-16">
                              <div 
                                className={cn("h-2 rounded-full transition-all",
                                  patient.risk_score < 40 && "bg-[#16A34A]",
                                  patient.risk_score >= 40 && patient.risk_score < 70 && "bg-[#F59E0B]",
                                  patient.risk_score >= 70 && "bg-[#DC2626]"
                                )}
                                style={{ width: `${patient.risk_score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-[#0F172A] w-8">{patient.risk_score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {patient.countdown === "Critical Now" || patient.countdown === null && patient.status === "Critical" ? (
                            <Badge variant="destructive" className="text-xs">Critical Now</Badge>
                          ) : patient.countdown === null ? (
                            <span className="text-sm text-gray-500">-</span>
                          ) : (
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span className={cn("font-medium",
                                parseInt(patient.countdown) > 60 && "text-gray-600",
                                parseInt(patient.countdown) <= 60 && parseInt(patient.countdown) > 30 && "text-[#F59E0B]",
                                parseInt(patient.countdown) <= 30 && "text-[#DC2626]"
                              )}>
                                {patient.countdown}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/patients/${patient.id}`}>
                            <Button size="sm" variant="ghost" className="h-8">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel */}
        <div className="space-y-6">
          {/* Priority Queue */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold">Priority Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {priorityPatients.map((patient, index) => (
                <Link key={patient.id} to={`/patients/${patient.id}`}>
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-[#2563EB] transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-[#0F172A]">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.bed_number}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={getStatusBadgeVariant(patient.status)}
                        className="text-xs"
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Risk: {patient.risk_score}</span>
                      {patient.countdown && patient.countdown !== "Critical Now" && (
                        <span className={cn("font-medium",
                          parseInt(patient.countdown) <= 30 && "text-[#DC2626]",
                          parseInt(patient.countdown) > 30 && parseInt(patient.countdown) <= 60 && "text-[#F59E0B]",
                          parseInt(patient.countdown) > 60 && "text-gray-600"
                        )}>
                          {patient.countdown} to critical
                        </span>
                      )}
                      {patient.countdown === "Critical Now" && (
                        <span className="font-medium text-[#DC2626]">Critical Now</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          
          {/* Live Alert Feed */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold">Live Alert Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-500">No active alerts. All patients stable.</p>
                </div>
              ) : (
                filteredAlerts.map((alert: any, idx: number) => (
                  <div 
                    key={alert.timestamp + "_" + alert.patient_id || idx}
                    className={cn("p-3 rounded-xl border transition-all", getSeverityColor(alert.severity))}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-xs">{alert.patient_name}</p>
                        {alert.status === "NEW" ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-800 animate-pulse">
                            NEW
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                            ACK
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-70">
                        {new Date(alert.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <p className="text-xs leading-relaxed">{alert.message}</p>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {alert.status === "NEW" && (
                          <button
                            onClick={() => handleAcknowledge(alert.timestamp, alert.patient_id)}
                            className="text-[10px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            Ack
                          </button>
                        )}
                        <Link
                          to={`/simulator/${alert.patient_id}`}
                          className="text-[10px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded transition-colors"
                        >
                          Simulate
                        </Link>
                      </div>
                      <button
                        onClick={() => handleResolve(alert.timestamp, alert.patient_id)}
                        className="text-[10px] font-medium text-green-700 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}