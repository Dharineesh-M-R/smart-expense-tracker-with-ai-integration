"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, Database, Settings as Gear } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  preference: string;
};

export default function SettingsPage(){
  const [profile, setProfile] = useState<Profile>({
    name: "John Doe",
    email: "johndoe@email.com",
    preference: "Daily Notifications",
  });

  const [deviceSettings, setDeviceSettings] = useState({
    buzzer: true,
    led: true,
    esp32Sync: false,
  });

  const handleBackup = (): void => {
    alert("Data backup started...");
  };

  const handleRestore = (): void => {
    alert("Restoring data...");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-600 flex items-center gap-2">
        <Gear className="h-7 w-7 text-yellow-600" />
        Settings
      </h1>

      {/* Profile Settings */}
      <Card className="mb-6 border-yellow-600 shadow-md">
        <CardHeader className="flex items-center gap-2">
          <User className="h-6 w-6 text-yellow-600" />
          <CardTitle className="text-yellow-600">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="border-yellow-600"
          />
          <Input
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="border-yellow-600"
          />
          <Input
            placeholder="Preference"
            value={profile.preference}
            onChange={(e) =>
              setProfile({ ...profile, preference: e.target.value })
            }
            className="border-yellow-600 md:col-span-2"
          />
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white md:col-span-2">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Device Settings */}
      <Card className="mb-6 border-yellow-600 shadow-md">
        <CardHeader className="flex items-center gap-2">
          <Gear className="h-6 w-6 text-yellow-600" />
          <CardTitle className="text-yellow-600">Device Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Buzzer</span>
            <Switch
              checked={deviceSettings.buzzer}
              onCheckedChange={(checked) =>
                setDeviceSettings({ ...deviceSettings, buzzer: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">LED Notifications</span>
            <Switch
              checked={deviceSettings.led}
              onCheckedChange={(checked) =>
                setDeviceSettings({ ...deviceSettings, led: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">ESP32 Sync</span>
            <Switch
              checked={deviceSettings.esp32Sync}
              onCheckedChange={(checked) =>
                setDeviceSettings({ ...deviceSettings, esp32Sync: checked })
              }
            />
          </div>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
            Apply Settings
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-yellow-600 shadow-md">
        <CardHeader className="flex items-center gap-2">
          <Database className="h-6 w-6 text-yellow-600" />
          <CardTitle className="text-yellow-600">Data Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={handleBackup}
          >
            Backup Data
          </Button>
          <Button
            variant="outline"
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
            onClick={handleRestore}
          >
            Restore Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
