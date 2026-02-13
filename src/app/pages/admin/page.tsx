"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Settings = {
    heroImageUrl?: string | null;
    heroTitle?: string | null;
    togetherDate?: string | null;
};

export function SettingsManager() {
    const { toast } = useToast();

    const [settings, setSettings] = React.useState<Settings | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load settings");
            const data = (await res.json()) as Settings;
            setSettings(data);
        } catch {
            toast({ title: "Error", description: "Failed to load settings", variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        void load();
    }, [load]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const payload = {
            heroImageUrl: String(formData.get("heroImageUrl") ?? ""),
            heroTitle: String(formData.get("heroTitle") ?? ""),
            togetherDate: String(formData.get("togetherDate") ?? ""),
        };

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update settings");

            toast({ title: "Settings updated!", variant: "success" });
            await load(); // re-sync UI con DB
        } catch {
            toast({ title: "Error", description: "Failed to update settings", variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card className="max-w-md">
                <CardHeader><CardTitle>App Settings</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md">
            <CardHeader><CardTitle>App Settings</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Hero Image URL (Photo of you guys!)</Label>
                        <Input
                            name="heroImageUrl"
                            defaultValue={settings?.heroImageUrl ?? ""}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Hero Title</Label>
                        <Input name="heroTitle" defaultValue={settings?.heroTitle ?? ""} />
                    </div>

                    <div className="space-y-2">
                        <Label>Relationship Start Date</Label>
                        <Input name="togetherDate" type="date" defaultValue={settings?.togetherDate ?? ""} />
                    </div>

                    <Button type="submit" className="w-full" disabled={saving}>
                        {saving ? <Loader2 className="animate-spin" /> : "Save Settings"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
