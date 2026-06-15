import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ClipboardList, Clock, AlertTriangle, Activity, Users, Sparkles } from "lucide-react";
import { cn } from "./ui/utils";
import { getShiftInfo } from "../lib/shiftStore";

const severityStyle: Record<string, string> = {
  Critical: "text-red-700 bg-red-50 border-red-200",
  High: "text-orange-700 bg-orange-50 border-orange-200",
  Moderate: "text-amber-700 bg-amber-50 border-amber-200",
  Info: "text-blue-700 bg-blue-50 border-blue-200",
};

const statusDot: Record<string, string> = {
  Critical: "bg-[#DC2626]",
  Moderate: "bg-[#F59E0B]",
  Stable: "bg-[#16A34A]",
};

export function ShiftReport() {
  const nurse = getShiftInfo();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["shift-report"],
    queryFn: async () => {
      const res = await api.get("/shift-report");
      return res.data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-blue-600" />
            Shift Handover Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {nurse ? `Prepared for: ${nurse.nurseName} · ${nurse.shiftLabel} (${nurse.shiftTime})` : "Shift summary for incoming nurse"}
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={() => refetch()}
            className="text-sm text-[#2563EB] hover:underline font-medium"
          >
            ↻ Refresh
          </button>
          {data?.generated_at && (
            <p className="text-xs text-gray-400 mt-1">
              Generated: {new Date(data.generated_at).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {data && (
        <>
          {/* Shift Info Banner */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Current Shift</p>
                  <p className="text-2xl font-bold">{data.shift}</p>
                  <p className="text-blue-100 text-sm mt-1">{data.total_events} clinical events recorded</p>
                </div>
                <Activity className="w-16 h-16 text-white/20" />
              </div>
            </CardContent>
          </Card>

          {/* Patient Status Summary */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Patient Status at Handover
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Bed", "Patient", "Category", "Status", "Risk Score", "Countdown", "Priority Score"].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-gray-500 px-6 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(data.patient_summary || []).map((p: any) => (
                      <tr key={p.patient_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-[#0F172A]">{p.bed_number}</td>
                        <td className="px-6 py-3">
                          <p className="text-sm font-medium text-[#0F172A]">{p.patient_name}</p>
                          <p className="text-xs text-gray-500">{p.patient_id}</p>
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant="outline" className="text-xs">{p.category}</Badge>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", statusDot[p.current_status] || "bg-gray-400")} />
                            <span className={cn("text-sm font-medium",
                              p.current_status === "Critical" && "text-[#DC2626]",
                              p.current_status === "Moderate" && "text-[#F59E0B]",
                              p.current_status === "Stable" && "text-[#16A34A]",
                            )}>
                              {p.current_status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-2">
                              <div
                                className={cn("h-2 rounded-full",
                                  p.risk_score >= 70 ? "bg-[#DC2626]" :
                                  p.risk_score >= 40 ? "bg-[#F59E0B]" : "bg-[#16A34A]"
                                )}
                                style={{ width: `${p.risk_score}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold">{p.risk_score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm font-medium">
                          {p.countdown === "Critical Now" ? (
                            <span className="text-red-600 font-bold">🚨 Critical Now</span>
                          ) : p.countdown ? (
                            <span className="text-gray-700">⏳ {p.countdown}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {typeof p.priority === "number" ? p.priority.toFixed(2) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Event Timeline */}
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Clinical Event Timeline
                <span className="text-sm font-normal text-gray-500">(newest first)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {(!data.events || data.events.length === 0) ? (
                <div className="text-center py-10">
                  <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No events recorded yet. Events appear as patients deteriorate.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.events.map((event: any, i: number) => (
                    <div
                      key={i}
                      className={cn("p-4 rounded-xl border", severityStyle[event.severity] || "text-gray-700 bg-gray-50 border-gray-200")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {event.severity === "Info" ? (
                              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="font-semibold text-sm">
                              {event.patient_name} · {event.bed_number}
                            </span>
                            <Badge
                              className={cn("text-xs border", severityStyle[event.severity])}
                              variant="outline"
                            >
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-xs mt-1 opacity-80">{event.outcome}</p>
                          {event.risk_score !== undefined && (
                            <p className="text-xs mt-1 opacity-70">
                              Risk: {event.risk_score}
                              {event.countdown ? ` · Countdown: ${event.countdown}` : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs opacity-70">
                            {new Date(event.timestamp).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </p>
                          <p className="text-xs opacity-60">
                            {new Date(event.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
