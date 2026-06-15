import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Bell, Volume2, Shield, User } from "lucide-react";

export function Settings() {
  const [critical, setCritical] = useState(() => localStorage.getItem("criticalAlertsEnabled") !== "false");
  const [high, setHigh] = useState(() => localStorage.getItem("highPriorityAlertsEnabled") !== "false");
  const [moderate, setModerate] = useState(() => localStorage.getItem("moderateAlertsEnabled") === "true");
  const [threshold, setThreshold] = useState(() => localStorage.getItem("riskThreshold") || "70");
  const [voice, setVoice] = useState(() => localStorage.getItem("voiceAnnouncementsEnabled") !== "false");

  const handleSave = () => {
    localStorage.setItem("criticalAlertsEnabled", String(critical));
    localStorage.setItem("highPriorityAlertsEnabled", String(high));
    localStorage.setItem("moderateAlertsEnabled", String(moderate));
    localStorage.setItem("riskThreshold", threshold);
    localStorage.setItem("voiceAnnouncementsEnabled", String(voice));
    if (!voice && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setCritical(true);
    setHigh(true);
    setModerate(false);
    setThreshold("70");
    setVoice(true);
    
    localStorage.setItem("criticalAlertsEnabled", "true");
    localStorage.setItem("highPriorityAlertsEnabled", "true");
    localStorage.setItem("moderateAlertsEnabled", "false");
    localStorage.setItem("riskThreshold", "70");
    localStorage.setItem("voiceAnnouncementsEnabled", "true");
    
    toast.info("Settings reset to defaults.");
  };
  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Settings</h1>
        <p className="text-sm text-gray-500">Configure system preferences and notification settings</p>
      </div>
      
      {/* Alert Settings */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2563EB]" />
            <CardTitle className="text-lg">Alert Settings</CardTitle>
          </div>
          <CardDescription>Configure how and when you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Critical Alert Notifications</Label>
              <p className="text-xs text-gray-500 mt-1">Receive immediate notifications for critical patients</p>
            </div>
            <Switch checked={critical} onCheckedChange={setCritical} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">High Priority Alerts</Label>
              <p className="text-xs text-gray-500 mt-1">Get notified for high priority events</p>
            </div>
            <Switch checked={high} onCheckedChange={setHigh} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Moderate Risk Alerts</Label>
              <p className="text-xs text-gray-500 mt-1">Enable notifications for moderate risk changes</p>
            </div>
            <Switch checked={moderate} onCheckedChange={setModerate} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alert-threshold">Risk Score Alert Threshold</Label>
            <Select value={threshold} onValueChange={setThreshold}>
              <SelectTrigger id="alert-threshold" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="70">70 - Medium threshold</SelectItem>
                <SelectItem value="80">80 - High threshold</SelectItem>
                <SelectItem value="90">90 - Critical threshold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Voice Settings */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#2563EB]" />
            <CardTitle className="text-lg">Voice Announcements</CardTitle>
          </div>
          <CardDescription>Configure voice alert preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable Voice Announcements</Label>
              <p className="text-xs text-gray-500 mt-1">Play audio alerts for critical events</p>
            </div>
            <Switch checked={voice} onCheckedChange={setVoice} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="voice-volume">Voice Volume</Label>
            <Select defaultValue="100">
              <SelectTrigger id="voice-volume" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30% - Low</SelectItem>
                <SelectItem value="60">60% - Medium</SelectItem>
                <SelectItem value="100">100% - High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="voice-rate">Speech Rate</Label>
            <Select defaultValue="normal">
              <SelectTrigger id="voice-rate" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* User Profile */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB]" />
            <CardTitle className="text-lg">User Profile</CardTitle>
          </div>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" defaultValue="Dr. Sarah Williams" className="h-11 rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="physician">
                <SelectTrigger id="role" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physician">Physician</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="sarah.williams@hospital.com" className="h-11 rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="h-11 rounded-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* System Preferences */}
      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#2563EB]" />
            <CardTitle className="text-lg">System Preferences</CardTitle>
          </div>
          <CardDescription>General system configuration</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="refresh-rate">Dashboard Refresh Rate</Label>
            <Select defaultValue="10">
              <SelectTrigger id="refresh-rate" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">60 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Dark Mode</Label>
              <p className="text-xs text-gray-500 mt-1">Switch to dark theme</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Compact View</Label>
              <p className="text-xs text-gray-500 mt-1">Show more information in less space</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1 h-12 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
          Save Changes
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1 h-12 rounded-xl">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
