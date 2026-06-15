import { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SHIFTS, ShiftType, ShiftInfo, saveShiftInfo } from "../lib/shiftStore";
import { cn } from "./ui/utils";

interface Props {
  onLogin: (info: ShiftInfo) => void;
}

export function ShiftLoginModal({ onLogin }: Props) {
  const [name, setName] = useState("");
  const [shift, setShift] = useState<ShiftType>("morning");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name to continue.");
      return;
    }
    const selected = SHIFTS.find(s => s.id === shift)!;
    const info: ShiftInfo = {
      nurseName: name.trim(),
      shift,
      shiftLabel: selected.label,
      shiftTime: selected.time,
      loginTime: new Date().toISOString(),
    };
    saveShiftInfo(info);
    onLogin(info);
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">CareSync AI</h1>
          <p className="text-gray-500 text-sm mt-1">ICU Clinical Decision Support System</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-base font-semibold text-[#0F172A]">Nurse Shift Sign-In</p>
            <p className="text-xs text-gray-500 mt-0.5">Identify yourself to begin monitoring</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nurseName">Your Name *</Label>
            <Input
              id="nurseName"
              placeholder="e.g. Nurse Sarah Williams"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              className="h-11 rounded-xl"
              autoFocus
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Select Your Shift *</Label>
            <div className="grid grid-cols-3 gap-3">
              {SHIFTS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShift(s.id)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all",
                    shift === s.id
                      ? "border-[#2563EB] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <p className="text-xl">{s.emoji}</p>
                  <p className="text-xs font-medium text-[#0F172A] mt-1">{s.label.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500">{s.time}</p>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/20 text-base font-semibold"
          >
            Begin Monitoring
          </Button>
        </form>
      </div>
    </div>
  );
}
