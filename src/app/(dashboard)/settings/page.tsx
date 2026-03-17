"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useProviders } from "@/lib/hooks/use-providers";
import { Save, Plug } from "lucide-react";
import type { AppSettings } from "@/lib/types";

// ---------------------------------------------------------------------------
// Default settings used as fallback before the API responds
// ---------------------------------------------------------------------------
const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  defaultProvider: "",
  defaultModel: "",
  maxConcurrentRuns: 3,
  workingDirectory: "",
  terminalShell: "",
  autoSave: true,
  showTokenCosts: true,
  language: "en",
};

export default function SettingsPage() {
  const { providers, loading: providersLoading } = useProviders();

  const [form, setForm] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // -----------------------------------------------------------------------
  // Load current settings from API
  // -----------------------------------------------------------------------
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data: AppSettings = await res.json();
          setForm(data);
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // -----------------------------------------------------------------------
  // Save handler
  // -----------------------------------------------------------------------
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Helpers to update individual fields
  // -----------------------------------------------------------------------
  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // -----------------------------------------------------------------------
  // Enabled providers for the select dropdown
  // -----------------------------------------------------------------------
  const enabledProviders = providers.filter((p) => p.isEnabled);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Genel uygulama tercihlerini yapılandırın."
        action={
          <Link href="/settings/providers">
            <Button variant="outline" size="sm">
              <Plug className="mr-2 size-4" />
              Sağlayıcıları Yönet
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Genel</CardTitle>
          <CardDescription>
            Tüm uygulama genelinde geçerli olan temel ayarlar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Provider */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="defaultProvider">
              Varsayılan Sağlayıcı
            </label>
            <Select
              value={form.defaultProvider}
              onValueChange={(v) => set("defaultProvider", v)}
            >
              <SelectTrigger id="defaultProvider" className="w-full">
                <SelectValue placeholder="Bir sağlayıcı seçin" />
              </SelectTrigger>
              <SelectContent>
                {enabledProviders.length === 0 && (
                  <SelectItem value="__none" disabled>
                    Etkin sağlayıcı yok
                  </SelectItem>
                )}
                {enabledProviders.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Default Model */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="defaultModel">
              Varsayılan Model
            </label>
            <Input
              id="defaultModel"
              value={form.defaultModel}
              onChange={(e) => set("defaultModel", e.target.value)}
              placeholder="örn. gpt-4o, claude-3-opus"
            />
          </div>

          <Separator />

          {/* Max Concurrent Runs */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="maxConcurrentRuns">
              Maksimum Eşzamanlı Çalıştırma
            </label>
            <Input
              id="maxConcurrentRuns"
              type="number"
              min={1}
              max={20}
              value={form.maxConcurrentRuns}
              onChange={(e) =>
                set("maxConcurrentRuns", parseInt(e.target.value, 10) || 1)
              }
            />
          </div>

          {/* Working Directory */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="workingDirectory">
              Çalışma Dizini
            </label>
            <Input
              id="workingDirectory"
              value={form.workingDirectory}
              onChange={(e) => set("workingDirectory", e.target.value)}
              placeholder="/çalışma/alanı/yolu"
            />
          </div>

          {/* Terminal Shell */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="terminalShell">
              Terminal Kabuğu
            </label>
            <Input
              id="terminalShell"
              value={form.terminalShell}
              onChange={(e) => set("terminalShell", e.target.value)}
              placeholder="örn. bash, zsh, powershell"
            />
          </div>

          <Separator />

          {/* Auto Save */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="autoSave">
              Otomatik Kayıt
            </label>
            <div className="flex items-center gap-3">
              <Switch
                id="autoSave"
                checked={form.autoSave}
                onCheckedChange={(v) => set("autoSave", v)}
              />
              <span className="text-sm text-muted-foreground">
                {form.autoSave ? "Etkin" : "Devre Dışı"}
              </span>
            </div>
          </div>

          {/* Show Token Costs */}
          <div className="grid gap-2 sm:grid-cols-[200px_1fr] items-center">
            <label className="text-sm font-medium" htmlFor="showTokenCosts">
              Token Maliyetlerini Göster
            </label>
            <div className="flex items-center gap-3">
              <Switch
                id="showTokenCosts"
                checked={form.showTokenCosts}
                onCheckedChange={(v) => set("showTokenCosts", v)}
              />
              <span className="text-sm text-muted-foreground">
                {form.showTokenCosts ? "Görünür" : "Gizli"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Save button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {saved ? "Kaydedildi!" : "Ayarları Kaydet"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
