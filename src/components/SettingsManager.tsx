"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {UploadDropzone} from "@/components/UploadDropzone";

type Settings = {
    heroImageUrl?: string | null;
    heroTitle?: string | null;
    togetherDate?: string | null;
};

export default function SettingsManager() {
    const { toast } = useToast();

    const [settings, setSettings] = React.useState<Settings | null>(null);
    const [heroImageUrl, setHeroImageUrl] = React.useState<string>("");

    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load settings");
            const data = (await res.json()) as Settings;
            setSettings(data);
            setHeroImageUrl(data.heroImageUrl ?? "");
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
        if (!settings) return;

        setSaving(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            heroImageUrl: heroImageUrl || null,
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
            await load();
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to update settings",
                variant: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader><CardTitle>App Settings</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader><CardTitle>App Settings</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <UploadDropzone
                        value={heroImageUrl}
                        onChange={(url) => setHeroImageUrl(url)}
                        label="Hero image"
                    />

                    <div className="space-y-2">
                        <Label>Hero Title</Label>
                        <Input name="heroTitle" defaultValue={settings?.heroTitle ?? ""} />
                    </div>

                    <div className="space-y-2">
                        <Label>Relationship Start Date</Label>
                        <Input name="togetherDate" type="date" defaultValue={settings?.togetherDate ?? ""} />
                    </div>

                    <Button type="submit" className="w-full" disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Settings
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
