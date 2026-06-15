import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Eye, Search, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { cn } from "./ui/utils";

export function PatientsList() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: queueData } = useQuery({
    queryKey: ['priority-queue'],
    queryFn: async () => {
      const res = await api.get('/priority-queue');
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 4000
  });

  const patients = queueData || [];
  
  const filteredPatients = patients.filter((patient: any) => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.bed_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stable": return "bg-[#16A34A]";
      case "Moderate": return "bg-[#F59E0B]";
      case "Critical": return "bg-[#DC2626]";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">All Patients</h1>
          <p className="text-sm text-gray-500">Comprehensive list of ICU patients</p>
        </div>
        <Link to="/admission">
          <Button className="rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8]">
            Add New Patient
          </Button>
        </Link>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, bed number, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Bed</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Patient</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Age/Gender</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Category</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Risk</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Countdown</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Priority</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient: any, index: number) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-sm text-[#0F172A]">{patient.bed_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-sm text-[#0F172A]">{patient.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{patient.age}y, {patient.gender}</span>
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
                      <span className="text-sm font-medium text-[#0F172A]">{patient.risk_score}</span>
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
                      <span className="text-xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
                      </span>
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
          
          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No patients found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
