"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SettingsManager from "@/components/SettingsManager";
import { UploadDropzone } from "@/components/UploadDropzone";

type Settings = {
    heroImageUrl?: string | null;
    heroTitle?: string | null;
    togetherDate?: string | null;
};

type Memory = {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    date: string;
    order: number;
};

type Quiz = {
    id: number;
    question: string;
    correctAnswer: string;
    options: string[];
    successMessage: string | null;
};

type Secret = {
    id: number;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    code: string;
};

function MemoriesManager() {
    const { toast } = useToast();
    const [memories, setMemories] = React.useState<Memory[]>([]);
    const [loading, setLoading] = React.useState(true);

    // NEW: dropzone state for "create memory"
    const [newMemoryImageUrl, setNewMemoryImageUrl] = React.useState<string>("");

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/memories", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load memories");
            const data = await res.json();
            setMemories(data);
        } catch {
            toast({ title: "Error", description: "Failed to load memories", variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        void load();
    }, [load]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? ""),
            // NEW: use dropzone url (nullable)
            imageUrl: newMemoryImageUrl || null,
            date: String(formData.get("date") ?? ""),
            order: Number(formData.get("order") ?? 0),
        };

        try {
            const res = await fetch("/api/memories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create memory");

            toast({ title: "Memory created!", variant: "success" });
            e.currentTarget.reset();
            // NEW: reset dropzone state
            setNewMemoryImageUrl("");
            await load();
        } catch {
            toast({ title: "Error", description: "Failed to create memory", variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete memory");

            toast({ title: "Memory deleted!", variant: "success" });
            await load();
        } catch {
            toast({ title: "Error", description: "Failed to delete memory", variant: "error" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Memories</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Memories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Memory
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input name="title" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input name="date" type="date" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" required />
                    </div>

                    {/* NEW: same dropzone UX as settings */}
                    <UploadDropzone
                        value={newMemoryImageUrl}
                        onChange={setNewMemoryImageUrl}
                        label="Memory image"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input name="order" type="number" defaultValue="0" />
                        </div>

                        {/* Optional: keep layout symmetric; remove if you want */}
                        <div className="space-y-2">
                            <Label>Image URL (read-only)</Label>
                            <Input value={newMemoryImageUrl} readOnly placeholder="Upload an image to generate a URL" />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Create Memory
                    </Button>
                </form>

                <div className="space-y-3">
                    <h3 className="font-semibold">Existing Memories ({memories.length})</h3>
                    {memories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No memories yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {memories.map((memory) => (
                                <div key={memory.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{memory.title}</p>
                                        <p className="text-sm text-muted-foreground">{memory.date}</p>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(memory.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function QuizzesManager() {
    const { toast } = useToast();
    const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
    const [loading, setLoading] = React.useState(true);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/quizzes", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load quizzes");
            const data = await res.json();
            setQuizzes(data);
        } catch {
            toast({ title: "Error", description: "Failed to load quizzes", variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        void load();
    }, [load]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const optionsText = String(formData.get("options") ?? "");
        const options = optionsText.split("\n").filter((o) => o.trim());

        if (options.length < 2) {
            toast({
                title: "Error",
                description: "Please provide at least 2 options for the quiz",
                variant: "error",
            });
            return;
        }

        const payload = {
            question: String(formData.get("question") ?? ""),
            correctAnswer: String(formData.get("correctAnswer") ?? ""),
            options,
            successMessage: String(formData.get("successMessage") ?? ""),
        };

        try {
            const res = await fetch("/api/quizzes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create quiz");

            toast({ title: "Quiz created!", variant: "success" });
            e.currentTarget.reset();
            await load();
        } catch {
            toast({ title: "Error", description: "Failed to create quiz", variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete quiz");

            toast({ title: "Quiz deleted!", variant: "success" });
            await load();
        } catch {
            toast({ title: "Error", description: "Failed to delete quiz", variant: "error" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quizzes</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quizzes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Quiz
                    </h3>

                    <div className="space-y-2">
                        <Label>Question</Label>
                        <Input name="question" required />
                    </div>

                    <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <Input name="correctAnswer" required />
                    </div>

                    <div className="space-y-2">
                        <Label>Options (one per line)</Label>
                        <Textarea name="options" placeholder={"Option 1\nOption 2\nOption 3"} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Success Message</Label>
                        <Input name="successMessage" placeholder="Great job!" />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Quiz
                    </Button>
                </form>

                <div className="space-y-3">
                    <h3 className="font-semibold">Existing Quizzes ({quizzes.length})</h3>
                    {quizzes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No quizzes yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{quiz.question}</p>
                                        <p className="text-sm text-muted-foreground">Answer: {quiz.correctAnswer}</p>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(quiz.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function SecretsManager() {
    const { toast } = useToast();
    const [secrets, setSecrets] = React.useState<Secret[]>([]);
    const [loading, setLoading] = React.useState(true);

    // NEW: dropzone state for "create secret"
    const [newSecretImageUrl, setNewSecretImageUrl] = React.useState<string>("");

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/secrets", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load secrets");
            const data = await res.json();
            setSecrets(data);
        } catch {
            toast({ title: "Error", description: "Failed to load secrets", variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        void load();
    }, [load]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload = {
            title: String(formData.get("title") ?? ""),
            content: String(formData.get("content") ?? ""),
            // NEW: use dropzone url (nullable)
            imageUrl: newSecretImageUrl || null,
            code: String(formData.get("code") ?? ""),
        };

        try {
            const res = await fetch("/api/secrets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create secret");

            toast({ title: "Secret created!", variant: "success" });
            e.currentTarget.reset();
            // NEW: reset dropzone state
            setNewSecretImageUrl("");
            await load();
        } catch {
            toast({ title: "Error", description: "Failed to create secret", variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/secrets/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete secret");

            toast({ title: "Secret deleted!", variant: "success" });
            await load();
        } catch {
            toast({ title: "Error", description: "Failed to delete secret", variant: "error" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Secrets</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Secrets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Secret
                    </h3>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input name="title" />
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea name="content" />
                    </div>

                    {/* NEW: same dropzone UX as settings */}
                    <UploadDropzone
                        value={newSecretImageUrl}
                        onChange={setNewSecretImageUrl}
                        label="Secret image"
                    />

                    <div className="space-y-2">
                        <Label>Image URL (read-only)</Label>
                        <Input value={newSecretImageUrl} readOnly placeholder="Upload an image to generate a URL" />
                    </div>

                    <div className="space-y-2">
                        <Label>Unlock Code</Label>
                        <Input name="code" required placeholder="SECRET123" />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Secret
                    </Button>
                </form>

                <div className="space-y-3">
                    <h3 className="font-semibold">Existing Secrets ({secrets.length})</h3>
                    {secrets.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No secrets yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {secrets.map((secret) => (
                                <div key={secret.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{secret.title || "Untitled Secret"}</p>
                                        <p className="text-sm text-muted-foreground">Code: {secret.code}</p>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(secret.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
            <Tabs defaultValue="settings">
                <TabsList className="mb-6">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="memories">Memories</TabsTrigger>
                    <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    <TabsTrigger value="secrets">Secrets</TabsTrigger>
                </TabsList>

                <TabsContent value="settings">
                    <SettingsManager />
                </TabsContent>

                <TabsContent value="memories">
                    <MemoriesManager />
                </TabsContent>

                <TabsContent value="quizzes">
                    <QuizzesManager />
                </TabsContent>

                <TabsContent value="secrets">
                    <SecretsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}
