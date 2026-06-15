import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";
import { patientCategories, availableMonitoringParams } from "../lib/mockData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "sonner";

const defaultMonitoringParams = ["Heart Rate", "SpO₂", "Blood Pressure", "Temperature"];

export function PatientAdmission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    gender: "",
    bedNumber: "",
    category: "",
  });
  
  const [selectedParams, setSelectedParams] = useState<string[]>(defaultMonitoringParams);
  const [showParamSelector, setShowParamSelector] = useState(false);
  
  const availableToAdd = availableMonitoringParams.filter(p => !selectedParams.includes(p));
  
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newPatient: any) => {
      const res = await api.post('/patients', newPatient);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Patient admitted successfully!", {
        description: `${formData.name} has been added to ${formData.bedNumber}`,
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['priority-queue'] });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error("Failed to admit patient", {
        description: error.response?.data?.detail || error.message,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.name || !formData.age || !formData.gender || !formData.bedNumber || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    mutation.mutate({
      id: formData.patientId,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      bed_number: formData.bedNumber,
      category: formData.category,
      monitoring_profile: selectedParams,
      vitals: {
        heart_rate: 75,
        spo2: 98,
        temperature: 37.0,
        blood_pressure: "120/80"
      }
    });
  };
  
  const addParam = (param: string) => {
    setSelectedParams([...selectedParams, param]);
    setShowParamSelector(false);
  };
  
  const removeParam = (param: string) => {
    setSelectedParams(selectedParams.filter(p => p !== param));
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="border-none shadow-lg">
        <CardHeader className="border-b border-gray-100 space-y-2">
          <CardTitle className="text-2xl">Patient Admission</CardTitle>
          <CardDescription>Register a new patient to the ICU monitoring system</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Patient Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID *</Label>
                  <Input
                    id="patientId"
                    placeholder="P009"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="45"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bedNumber">Bed Number *</Label>
                  <Input
                    id="bedNumber"
                    placeholder="ICU-09"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Patient Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {patientCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Adaptive Monitoring Profile */}
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Adaptive Monitoring Profile</h3>
              <p className="text-sm text-gray-500 mb-4">
                Customize which vital signs and parameters to monitor for this patient based on their condition
              </p>
              
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedParams.map((param) => (
                    <Badge 
                      key={param}
                      variant="secondary"
                      className="px-3 py-2 text-sm bg-white border border-blue-200 hover:bg-white"
                    >
                      <span className="mr-2">✓</span>
                      {param}
                      <button
                        type="button"
                        onClick={() => removeParam(param)}
                        className="ml-2 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {availableToAdd.length > 0 && (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowParamSelector(!showParamSelector)}
                      className="bg-white hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Parameter
                    </Button>
                    
                    {showParamSelector && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10">
                        {availableToAdd.map((param) => (
                          <button
                            key={param}
                            type="button"
                            onClick={() => addParam(param)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors"
                          >
                            {param}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {formData.category && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Suggested for {formData.category}:</span>
                    {" "}
                    {formData.category === "Cardiac" && "Heart Rate, Blood Pressure, ECG, SpO₂"}
                    {formData.category === "Respiratory" && "SpO₂, Respiratory Rate, Temperature, Heart Rate"}
                    {formData.category === "Post-Surgery" && "Heart Rate, Blood Pressure, Temperature, SpO₂"}
                    {formData.category === "Infection" && "Temperature, WBC Count, Heart Rate, SpO₂"}
                    {formData.category === "General ICU" && "Heart Rate, Blood Pressure, SpO₂, Temperature"}
                    {formData.category === "Neurological" && "Blood Pressure, Heart Rate, Temperature, Glucose Level"}
                    {formData.category === "Trauma" && "Heart Rate, Blood Pressure, SpO₂, Lactate Level"}
                  </p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 h-12 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/20"
              >
                {mutation.isPending ? "Admitting..." : "Admit Patient"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1 h-12 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
