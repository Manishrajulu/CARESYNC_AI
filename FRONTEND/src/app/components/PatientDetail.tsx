import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  ArrowLeft, Heart, Droplet, Activity, Thermometer, 
  Clock, AlertTriangle, Sparkles, TrendingUp 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generateVitalTrends } from "../lib/mockData";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { cn } from "./ui/utils";

export function PatientDetail() {
  const { id } = useParams();
  const { data: patient, isLoading, isError } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const res = await api.get(`/patients/${id}`);
      return res.data.patient;
    },
    enabled: !!id,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000
  });

  const [hrTrends] = useState(generateVitalTrends(patient?.vitals?.heart_rate || 75, 15));
  const [spO2Trends] = useState(generateVitalTrends(patient?.vitals?.spo2 || 95, 5));
  const [tempTrends] = useState(generateVitalTrends(patient?.vitals?.temperature || 37, 1.5));
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="p-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-1">Unable to load patient</p>
            <p className="text-gray-500 text-sm mb-4">The patient record could not be retrieved. Please try again.</p>
            <Link to="/">
              <Button className="mt-2">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const patientExplanations = patient.explanations || [];
  const aiSummary = patient.summary || "";
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stable": return "text-[#16A34A] bg-green-50";
      case "Moderate": return "text-[#F59E0B] bg-amber-50";
      case "Critical": return "text-[#DC2626] bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">{patient.name}</h1>
            <p className="text-sm text-gray-500">{patient.age} years • {patient.gender} • {patient.bed_number}</p>
          </div>
        </div>
        
        <Link to={`/simulator/${patient.id}`}>
          <Button className="rounded-xl bg-purple-600 hover:bg-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            What-If Simulator
          </Button>
        </Link>
      </div>
      
      {/* Patient Overview */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <Badge variant="outline" className="text-sm">{patient.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge className={cn("text-sm font-medium", getStatusColor(patient.status))}>
                  {patient.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div 
                      className={cn("h-3 rounded-full transition-all",
                        patient.risk_score < 40 && "bg-[#16A34A]",
                        patient.risk_score >= 40 && patient.risk_score < 70 && "bg-[#F59E0B]",
                        patient.risk_score >= 70 && "bg-[#DC2626]"
                      )}
                      style={{ width: `${patient.risk_score}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-[#0F172A]">{patient.risk_score}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Priority</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Calculated Priority (Score: {patient.priority?.toFixed(2)})</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Countdown - BIGGEST USP */}
        <Card className={cn("border-none shadow-lg col-span-2",
          patient.countdown === "Critical Now" || patient.countdown === null && patient.status === "Critical" ? "bg-gradient-to-br from-red-500 to-red-600" :
          patient.countdown === null ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
          parseInt(patient.countdown) <= 30 ? "bg-gradient-to-br from-red-500 to-red-600" :
          parseInt(patient.countdown) <= 60 ? "bg-gradient-to-br from-amber-500 to-orange-600" :
          "bg-gradient-to-br from-blue-500 to-indigo-600"
        )}>
          <CardContent className="p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-lg opacity-90 mb-2">Estimated Time to Critical Event</p>
                <div className="flex items-baseline gap-3">
                  {patient.countdown === "Critical Now" || patient.countdown === null && patient.status === "Critical" ? (
                    <>
                      <AlertTriangle className="w-16 h-16 animate-pulse" />
                      <span className="text-6xl font-bold">CRITICAL NOW</span>
                    </>
                  ) : patient.countdown === null ? (
                    <>
                      <span className="text-4xl font-bold">Stable</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-12 h-12" />
                      <span className="text-7xl font-bold">{patient.countdown}</span>
                      <span className="text-3xl font-medium">Minutes</span>
                    </>
                  )}
                </div>
                <p className="text-sm opacity-90 mt-4">
                  {patient.countdown === "Critical Now" || patient.countdown === null && patient.status === "Critical"
                    ? "Immediate intervention required"
                    : patient.countdown === null
                    ? "Patient is stable"
                    : parseInt(patient.countdown) <= 30
                    ? "Urgent attention needed within the next half hour"
                    : parseInt(patient.countdown) <= 60
                    ? "Close monitoring recommended"
                    : "Patient condition stable but monitored"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Current Vitals */}
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Current Vitals</h2>
        <div className="grid grid-cols-4 gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Heart Rate</p>
              <p className="text-3xl font-bold text-[#0F172A]">{patient.vitals?.heart_rate}</p>
              <p className="text-xs text-gray-500 mt-1">bpm</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">SpO₂</p>
              <p className="text-3xl font-bold text-[#0F172A]">{patient.vitals?.spo2}</p>
              <p className="text-xs text-gray-500 mt-1">%</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-purple-500" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Blood Pressure</p>
              <p className="text-2xl font-bold text-[#0F172A]">{patient.vitals?.blood_pressure}</p>
              <p className="text-xs text-gray-500 mt-1">mmHg</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-orange-500" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Temperature</p>
              <p className="text-3xl font-bold text-[#0F172A]">{patient.vitals?.temperature}</p>
              <p className="text-xs text-gray-500 mt-1">°C</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Vital Trends */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base">Heart Rate Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hrTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} domain={[60, 120]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#DC2626" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base">SpO₂ Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={spO2Trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} domain={[85, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base">Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tempTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} domain={[36, 40]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Explainable AI Section */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
          <CardHeader className="border-b border-purple-100">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Why was this patient flagged?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {patientExplanations.length > 0 ? (
              <ul className="space-y-3">
                {patientExplanations.map((explanation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-700 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{explanation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No significant risk factors detected at this time.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* AI Clinical Summary */}
      {aiSummary && (
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Clinical Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
