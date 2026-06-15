import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { announce } from "../lib/voiceAnnouncer";
import { cn } from "./ui/utils";
import { isAlertAllowed } from "../lib/settingsHelper";
import { getPersistedAlerts, acknowledgeAlert, resolveAlert } from "../lib/alertsPersister";

export function Alerts() {
  const { data: alertsData } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const res = await api.get('/alerts');
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000
  });

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

  const alerts = alertsData || [];
  const [allLocalAlerts, setAllLocalAlerts] = useState<any[]>([]);

  useEffect(() => {
    setAllLocalAlerts(getPersistedAlerts());
  }, [alertsData]);

  const handleAcknowledge = (timestamp: string, patientId: string) => {
    acknowledgeAlert(timestamp, patientId);
    setAllLocalAlerts(getPersistedAlerts());
  };

  const handleResolve = (timestamp: string, patientId: string) => {
    resolveAlert(timestamp, patientId);
    setAllLocalAlerts(getPersistedAlerts());
  };

  const activeFiltered = allLocalAlerts.filter(a => a.status !== "RESOLVED").filter(isAlertAllowed);
  const resolvedFiltered = allLocalAlerts.filter(a => a.status === "RESOLVED").filter(isAlertAllowed);

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem("voiceAnnouncementsEnabled") !== "false";
  });
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  const toggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    localStorage.setItem("voiceAnnouncementsEnabled", String(nextVal));
    if (!nextVal && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  
  useEffect(() => {
    if (voiceEnabled && voiceData?.message) {
      if (lastMessageRef.current !== voiceData.message) {
        lastMessageRef.current = voiceData.message;
        setCurrentAnnouncement(voiceData.message);
        announce(voiceData.message);
      }
    }
  }, [voiceEnabled, voiceData]);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Moderate": return "bg-amber-50 text-[#F59E0B] border-amber-200";
      case "High": return "bg-orange-50 text-orange-600 border-orange-200";
      case "Critical": return "bg-red-50 text-[#DC2626] border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-red-600 bg-red-50";
      case "Acknowledged": return "text-amber-600 bg-amber-50";
      case "Resolved": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  const handleTestVoice = () => {
    const announcement = "Attention nursing staff. This is a test of the voice alert system.";
    setCurrentAnnouncement(announcement);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announcement);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="p-8 space-y-6">
      {/* Voice Alert Assistant */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
        <CardHeader className="border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Voice Alert Assistant
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleTestVoice}
                className="rounded-xl bg-white"
              >
                Test Voice
              </Button>
              <Button
                size="sm"
                variant={voiceEnabled ? "default" : "outline"}
                onClick={toggleVoice}
                className={cn("rounded-xl", voiceEnabled && "bg-indigo-600 hover:bg-indigo-700")}
              >
                {voiceEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Voice On
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Voice Off
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {currentAnnouncement ? (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Current Announcement</p>
                <p className="text-base text-gray-900">{currentAnnouncement}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600">
                {voiceEnabled 
                  ? "Voice alerts are active. Announcements will play automatically for critical events."
                  : "Enable voice alerts to receive audio notifications for critical patients."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Example Voice Announcements */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg">Example Voice Announcements</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-semibold text-sm text-red-900 mb-1">Critical Alert</p>
                <p className="text-sm text-red-800">"CODE RED. ICU Team to Bed 5 immediately."</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-semibold text-sm text-amber-900 mb-1">High Priority Alert</p>
                <p className="text-sm text-amber-800">"Attention Nurse Sarah. Patient P002 requires immediate assistance."</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-semibold text-sm text-blue-900 mb-1">Moderate Alert</p>
                <p className="text-sm text-blue-800">"Patient James Wilson requires observation."</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Severity color helpers */}
      {(() => {
        const getSeverityBorderColor = (severity: string) => {
          switch (severity) {
            case "Critical": return "border-red-200";
            case "High": return "border-orange-200";
            case "Moderate": return "border-amber-200";
            default: return "border-gray-200";
          }
        };

        const getSeverityBgColor = (severity: string) => {
          switch (severity) {
            case "Critical": return "bg-red-50/50";
            case "High": return "bg-orange-50/50";
            case "Moderate": return "bg-amber-50/50";
            default: return "bg-gray-50/50";
          }
        };

        return (
          <>
            {/* Active Alerts Board */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600 animate-pulse" />
                  Active Clinical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {activeFiltered.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No active alerts. All patients stable.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeFiltered.map((alert: any, index: number) => (
                      <div 
                        key={alert.timestamp + "_" + alert.patient_id || index}
                        className={cn("p-4 rounded-xl border-2 transition-all flex flex-col justify-between", getSeverityBorderColor(alert.severity), getSeverityBgColor(alert.severity))}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#0F172A]">{alert.patient_name}</span>
                              {alert.status === "NEW" ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-800 animate-pulse">
                                  NEW
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                                  ACKNOWLEDGED
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{alert.message}</p>
                          <p className="text-xs text-gray-500 mb-4 font-medium">Recipient: {alert.recipient}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-150">
                          <div className="flex items-center gap-2">
                            {alert.status === "NEW" && (
                              <button
                                onClick={() => handleAcknowledge(alert.timestamp, alert.patient_id)}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs h-8 px-3 cursor-pointer"
                              >
                                Acknowledge
                              </button>
                            )}
                            <Link to={`/simulator/${alert.patient_id}`}>
                              <button
                                className="rounded-lg text-xs h-8 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer"
                              >
                                Simulate
                              </button>
                            </Link>
                          </div>
                          <button
                            onClick={() => handleResolve(alert.timestamp, alert.patient_id)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs h-8 px-3 cursor-pointer"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alert History (Resolved) */}
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b border-gray-100 flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Alert History Archive</CardTitle>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Audit log of resolved patient alerts</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {resolvedFiltered.length} Resolved
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                {resolvedFiltered.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-500">No resolved history available.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Time</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Patient</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Severity</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Message</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Recipient</th>
                          <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {resolvedFiltered.map((alert: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {new Date(alert.timestamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-[#0F172A]">{alert.patient_name}</span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={cn("text-xs font-medium border", getSeverityColor(alert.severity))}>
                                {alert.severity}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-705">{alert.message}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">{alert.recipient}</span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="text-xs font-medium text-green-700 bg-green-50 border border-green-200">
                                RESOLVED
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        );
      })()}
    </div>
  );
}
