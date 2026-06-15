import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Droplet, Syringe, Eye, TrendingUp, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { cn } from "./ui/utils";
import { motion } from "motion/react";

const INTERVENTIONS = [
  {
    id: "Oxygen Support",
    name: "Oxygen Support",
    icon: Droplet,
    description: "Increase oxygen supplementation to improve SpO₂ levels",
    badge: "SpO₂ ↑",
  },
  {
    id: "Medication",
    name: "Administer Medication",
    icon: Syringe,
    description: "Provide appropriate medication based on patient condition",
    badge: "HR ↓",
  },
  {
    id: "Fluid Support",
    name: "Fluid Support",
    icon: Droplet,
    description: "IV fluid administration to stabilize blood pressure",
    badge: "BP ↑",
  },
  {
    id: "Increase Monitoring",
    name: "Increase Monitoring",
    icon: Eye,
    description: "Enhanced monitoring frequency and additional parameters",
    badge: "Oversight ↑",
  },
];

interface SimResult {
  intervention: string;
  before: { Risk: number; Countdown: string | null };
  after: { Risk: number; Countdown: string | null };
  explanation: string;
  improvement: string;
}

export function WhatIfSimulator() {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(urlId || "");
  const [simulation, setSimulation] = useState<SimResult | null>(null);

  // Load all patients for the picker
  const { data: allPatients } = useQuery({
    queryKey: ["patients-list"],
    queryFn: async () => {
      const res = await api.get("/patients");
      return res.data as any[];
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Load selected patient details
  const { data: patient } = useQuery({
    queryKey: ["patient", selectedPatientId],
    queryFn: async () => {
      const res = await api.get(`/patients/${selectedPatientId}`);
      return res.data.patient;
    },
    enabled: !!selectedPatientId,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000,
  });

  const simMutation = useMutation({
    mutationFn: async ({ patientId, intervention }: { patientId: string; intervention: string }) => {
      const res = await api.post("/simulate-intervention", { patientId, intervention });
      return res.data;
    },
    onSuccess: (data, variables) => {
      const reduction = data.before.Risk - data.after.Risk;
      const improvement =
        reduction > 20 ? "Significant improvement expected" :
        reduction > 10 ? "Moderate improvement expected" :
        "Minor improvement expected";
      setSimulation({
        intervention: variables.intervention,
        before: data.before,
        after: data.after,
        explanation: data.explanation,
        improvement,
      });
    },
  });

  const runSimulation = (interventionId: string) => {
    if (!selectedPatientId) return;
    setSimulation(null);
    simMutation.mutate({ patientId: selectedPatientId, intervention: interventionId });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={patient ? `/patients/${patient.id}` : "/patients"}>
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {patient ? "Back to Patient" : "Back to Patients"}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              What-If Intervention Simulator
            </h1>
            <p className="text-sm text-gray-500">Simulate interventions before acting — see predicted outcomes instantly</p>
          </div>
        </div>
      </div>

      {/* Patient Selector */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-base flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-blue-600" />
            Step 1 — Select Patient
          </CardTitle>
          <CardDescription>Choose the patient to simulate an intervention for</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(allPatients || []).map((p: any) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPatientId(p.id); setSimulation(null); }}
                className={cn(
                  "p-3 rounded-xl border-2 text-left transition-all",
                  selectedPatientId === p.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/40"
                )}
              >
                <p className="font-semibold text-xs text-[#0F172A]">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.bed_number}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                    p.status === "Critical" ? "bg-[#DC2626]" :
                    p.status === "Moderate" ? "bg-[#F59E0B]" : "bg-[#16A34A]"
                  )} />
                  <span className={cn("text-xs font-medium",
                    p.status === "Critical" ? "text-[#DC2626]" :
                    p.status === "Moderate" ? "text-[#F59E0B]" : "text-[#16A34A]"
                  )}>{p.status}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Risk: {p.risk_score}</p>
              </button>
            ))}
          </div>
          {!allPatients?.length && (
            <p className="text-gray-400 text-sm text-center py-4">Loading patients from backend…</p>
          )}
        </CardContent>
      </Card>

      {/* Current Patient State */}
      {patient && (
        <Card className="border-none shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-base">Current State — {patient.name} ({patient.bed_number})</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Risk Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={cn("h-3 rounded-full transition-all",
                        patient.risk_score >= 70 ? "bg-[#DC2626]" :
                        patient.risk_score >= 40 ? "bg-[#F59E0B]" : "bg-[#16A34A]"
                      )}
                      style={{ width: `${patient.risk_score}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-[#0F172A]">{patient.risk_score}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Countdown</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {patient.countdown === "Critical Now" ? "🚨 Critical Now" :
                   patient.countdown ? `⏳ ${patient.countdown}` : "✅ Stable"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <Badge className={cn("text-sm font-medium px-3 py-1",
                  patient.status === "Critical" ? "text-[#DC2626] bg-red-50" :
                  patient.status === "Moderate" ? "text-[#F59E0B] bg-amber-50" : "text-[#16A34A] bg-green-50"
                )}>
                  {patient.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intervention Picker */}
      {selectedPatientId && (
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Step 2 — Select Intervention &amp; Run Simulation
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {INTERVENTIONS.map(iv => {
              const Icon = iv.icon;
              const isPending = simMutation.isPending && simMutation.variables?.intervention === iv.id;
              return (
                <Card
                  key={iv.id}
                  className={cn(
                    "border-none shadow-sm hover:shadow-md transition-all cursor-pointer group",
                    isPending && "opacity-70"
                  )}
                  onClick={() => runSimulation(iv.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {isPending ? (
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Icon className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#0F172A]">{iv.name}</h3>
                          <Badge variant="secondary" className="text-xs">{iv.badge}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{iv.description}</p>
                        <Button size="sm" className="mt-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs h-7">
                          {isPending ? "Simulating…" : "▶ Run Simulation"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {simulation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="border-b border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Simulation Results — {simulation.intervention}
                  </CardTitle>
                  <CardDescription className="text-green-700 mt-1">{simulation.improvement}</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSimulation(null)} className="bg-white">
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-8 items-center">
                {/* Before */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Before Intervention</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Risk Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={cn("h-3 rounded-full", simulation.before.Risk >= 70 ? "bg-[#DC2626]" : simulation.before.Risk >= 40 ? "bg-[#F59E0B]" : "bg-[#16A34A]")}
                            style={{ width: `${simulation.before.Risk}%` }}
                          />
                        </div>
                        <span className="text-3xl font-bold text-[#0F172A]">{simulation.before.Risk}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Countdown</p>
                      <p className="text-xl font-bold text-[#0F172A]">
                        {simulation.before.Countdown === "Critical Now" || !simulation.before.Countdown ? "🚨 Critical Now" : `⏳ ${simulation.before.Countdown}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="w-12 h-12 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Apply {simulation.intervention}</span>
                  </div>
                </div>

                {/* After */}
                <div>
                  <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-4">After Intervention</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Risk Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <motion.div
                            className={cn("h-3 rounded-full", simulation.after.Risk >= 70 ? "bg-[#DC2626]" : simulation.after.Risk >= 40 ? "bg-[#F59E0B]" : "bg-[#16A34A]")}
                            initial={{ width: `${simulation.before.Risk}%` }}
                            animate={{ width: `${simulation.after.Risk}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-3xl font-bold text-green-600">{simulation.after.Risk}</span>
                      </div>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        ↓ {simulation.before.Risk - simulation.after.Risk} points reduced
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Countdown</p>
                      <p className="text-xl font-bold text-green-600">
                        {simulation.after.Countdown === "Critical Now" || !simulation.after.Countdown ? "🚨 Still Critical" : `⏳ ${simulation.after.Countdown}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="mt-8 p-4 bg-white rounded-xl border border-green-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-green-700">🩺 Clinical Recommendation: </span>
                  {simulation.explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
