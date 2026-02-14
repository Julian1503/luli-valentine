"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SettingsManager from "@/components/SettingsManager";
import { UploadDropzone } from "@/components/UploadDropzone";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

type Memory = {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    imageUrls?: string[] | null;
    descriptions?: string[] | null;
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
    const [editingMemory, setEditingMemory] = React.useState<Memory | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    // Create form state
    const [newMemoryImages, setNewMemoryImages] = React.useState<string[]>([]);
    const [newMemoryDescriptions, setNewMemoryDescriptions] = React.useState<string>("");

    // Edit form state
    const [editImages, setEditImages] = React.useState<string[]>([]);
    const [editDescriptions, setEditDescriptions] = React.useState<string>("");

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/memories", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to load memories");
            const data = await res.json();
            setMemories(data);
        } catch {
            toast({ title: "Error", description: "Fallo al cargar recuerdos", variant: "error" });
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

        // Parse descriptions (one per line)
        const descriptionsArray = newMemoryDescriptions.split("\n").filter(d => d.trim());

        const payload = {
            title: String(formData.get("title") ?? ""),
            description: descriptionsArray[0] || String(formData.get("title") ?? ""),
            imageUrls: newMemoryImages.length > 0 ? newMemoryImages : null,
            descriptions: descriptionsArray.length > 0 ? descriptionsArray : null,
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

            toast({ title: "¡Recuerdo creado!", variant: "success" });
            e.currentTarget.reset();
            setNewMemoryImages([]);
            setNewMemoryDescriptions("");
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al crear recuerdo", variant: "error" });
        }
    };

    const handleEdit = (memory: Memory) => {
        setEditingMemory(memory);
        setEditImages(memory.imageUrls && Array.isArray(memory.imageUrls) ? memory.imageUrls : []);
        const descriptions = memory.descriptions && Array.isArray(memory.descriptions) 
            ? memory.descriptions 
            : [memory.description];
        setEditDescriptions(descriptions.join("\n"));
        setDialogOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingMemory) return;

        const formData = new FormData(e.currentTarget);
        const descriptionsArray = editDescriptions.split("\n").filter(d => d.trim());

        const payload = {
            title: String(formData.get("title") ?? ""),
            description: descriptionsArray[0] || String(formData.get("title") ?? ""),
            imageUrls: editImages.length > 0 ? editImages : null,
            descriptions: descriptionsArray.length > 0 ? descriptionsArray : null,
            date: String(formData.get("date") ?? ""),
            order: Number(formData.get("order") ?? 0),
        };

        try {
            const res = await fetch(`/api/memories/${editingMemory.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update memory");

            toast({ title: "¡Recuerdo actualizado!", variant: "success" });
            setDialogOpen(false);
            setEditingMemory(null);
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al actualizar recuerdo", variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este recuerdo?")) return;

        try {
            const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete memory");

            toast({ title: "¡Recuerdo eliminado!", variant: "success" });
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al eliminar recuerdo", variant: "error" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recuerdos</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Cargando...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recuerdos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Nuevo Recuerdo
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input name="title" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input name="date" type="date" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descripciones (una por línea, una por imagen o una para todas)</Label>
                        <Textarea 
                            value={newMemoryDescriptions}
                            onChange={(e) => setNewMemoryDescriptions(e.target.value)}
                            placeholder="Primera descripción&#10;Segunda descripción&#10;Tercera descripción"
                            rows={4}
                        />
                    </div>

                    <MultiImageUpload
                        values={newMemoryImages}
                        onChange={setNewMemoryImages}
                        label="Imágenes del recuerdo"
                    />

                    <div className="space-y-2">
                        <Label>Orden</Label>
                        <Input name="order" type="number" defaultValue="0" />
                    </div>

                    <Button type="submit" className="w-full">
                        Crear Recuerdo
                    </Button>
                </form>

                <div className="space-y-3">
                    <h3 className="font-semibold">Recuerdos Existentes ({memories.length})</h3>
                    {memories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay recuerdos todavía.</p>
                    ) : (
                        <div className="space-y-2">
                            {memories.map((memory) => (
                                <div key={memory.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{memory.title}</p>
                                        <p className="text-sm text-muted-foreground">{memory.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(memory)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(memory.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Recuerdo</DialogTitle>
                    </DialogHeader>
                    {editingMemory && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input name="title" defaultValue={editingMemory.title} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha</Label>
                                    <Input name="date" type="date" defaultValue={editingMemory.date} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Descripciones (una por línea)</Label>
                                <Textarea 
                                    value={editDescriptions}
                                    onChange={(e) => setEditDescriptions(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <MultiImageUpload
                                values={editImages}
                                onChange={setEditImages}
                                label="Imágenes del recuerdo"
                            />

                            <div className="space-y-2">
                                <Label>Orden</Label>
                                <Input name="order" type="number" defaultValue={editingMemory.order} />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    Guardar Cambios
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function QuizzesManager() {
    const { toast } = useToast();
    const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [editingQuiz, setEditingQuiz] = React.useState<Quiz | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    // Edit form state
    const [editOptions, setEditOptions] = React.useState<string>("");

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/quizzes", { cache: "no-store" });
            if (!res.ok) throw new Error("Fallo al cargar trivia");
            const data = await res.json();
            setQuizzes(data);
        } catch {
            toast({ title: "Error", description: "Fallo al cargar trivia", variant: "error" });
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
                description: "Por favor proporcioná al menos 2 opciones para la trivia",
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

            if (!res.ok) throw new Error("Fallo al crear trivia");

            toast({ title: "¡Trivia creada!", variant: "success" });
            e.currentTarget.reset();
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al crear trivia", variant: "error" });
        }
    };

    const handleEdit = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setEditOptions(quiz.options.join("\n"));
        setDialogOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingQuiz) return;

        const formData = new FormData(e.currentTarget);
        const options = editOptions.split("\n").filter((o) => o.trim());

        if (options.length < 2) {
            toast({
                title: "Error",
                description: "Por favor proporcioná al menos 2 opciones para la trivia",
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
            const res = await fetch(`/api/quizzes/${editingQuiz.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Fallo al actualizar trivia");

            toast({ title: "¡Trivia actualizada!", variant: "success" });
            setDialogOpen(false);
            setEditingQuiz(null);
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al actualizar trivia", variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta trivia?")) return;

        try {
            const res = await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Fallo al eliminar trivia");

            toast({ title: "¡Trivia eliminada!", variant: "success" });
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al eliminar trivia", variant: "error" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Trivia</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Cargando...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trivia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Nueva Trivia
                    </h3>

                    <div className="space-y-2">
                        <Label>Pregunta</Label>
                        <Input name="question" required />
                    </div>

                    <div className="space-y-2">
                        <Label>Respuesta Correcta</Label>
                        <Input name="correctAnswer" required />
                    </div>

                    <div className="space-y-2">
                        <Label>Opciones (una por línea)</Label>
                        <Textarea name="options" placeholder={"Opción 1\nOpción 2\nOpción 3"} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Mensaje de Éxito</Label>
                        <Input name="successMessage" placeholder="¡Muy bien!" />
                    </div>

                    <Button type="submit" className="w-full">
                        Crear Trivia
                    </Button>
                </form>

                <div className="space-y-3">
                    <h3 className="font-semibold">Trivia Existentes ({quizzes.length})</h3>
                    {quizzes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay trivia todavía.</p>
                    ) : (
                        <div className="space-y-2">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{quiz.question}</p>
                                        <p className="text-sm text-muted-foreground">Respuesta: {quiz.correctAnswer}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(quiz)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(quiz.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Trivia</DialogTitle>
                    </DialogHeader>
                    {editingQuiz && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Pregunta</Label>
                                <Input name="question" defaultValue={editingQuiz.question} required />
                            </div>

                            <div className="space-y-2">
                                <Label>Respuesta Correcta</Label>
                                <Input name="correctAnswer" defaultValue={editingQuiz.correctAnswer} required />
                            </div>

                            <div className="space-y-2">
                                <Label>Opciones (una por línea)</Label>
                                <Textarea 
                                    value={editOptions}
                                    onChange={(e) => setEditOptions(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Mensaje de Éxito</Label>
                                <Input name="successMessage" defaultValue={editingQuiz.successMessage || ""} placeholder="¡Muy bien!" />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    Guardar Cambios
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function SecretsManager() {
    const { toast } = useToast();
    const [secrets, setSecrets] = React.useState<Secret[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [editingSecret, setEditingSecret] = React.useState<Secret | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    // Create form state
    const [newSecretImageUrl, setNewSecretImageUrl] = React.useState<string>("");

    // Edit form state
    const [editImageUrl, setEditImageUrl] = React.useState<string>("");

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/secrets", { cache: "no-store" });
            if (!res.ok) throw new Error("Fallo al cargar secretos");
            const data = await res.json();
            setSecrets(data);
        } catch {
            toast({ title: "Error", description: "Fallo al cargar secretos", variant: "error" });
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
            imageUrl: newSecretImageUrl || null,
            code: String(formData.get("code") ?? ""),
        };

        try {
            const res = await fetch("/api/secrets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Fallo al crear secreto");

            toast({ title: "¡Secreto creado!", variant: "success" });
            e.currentTarget.reset();
            setNewSecretImageUrl("");
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al crear secreto", variant: "error" });
        }
    };

    const handleEdit = (secret: Secret) => {
        setEditingSecret(secret);
        setEditImageUrl(secret.imageUrl || "");
        setDialogOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingSecret) return;

        const formData = new FormData(e.currentTarget);

        const payload = {
            title: String(formData.get("title") ?? ""),
            content: String(formData.get("content") ?? ""),
            imageUrl: editImageUrl || null,
            code: String(formData.get("code") ?? ""),
        };

        try {
            const res = await fetch(`/api/secrets/${editingSecret.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Fallo al actualizar secreto");

            toast({ title: "¡Secreto actualizado!", variant: "success" });
            setDialogOpen(false);
            setEditingSecret(null);
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al actualizar secreto", variant: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este secreto?")) return;

        try {
            const res = await fetch(`/api/secrets/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Fallo al eliminar secreto");

            toast({ title: "¡Secreto eliminado!", variant: "success" });
            await load();
        } catch {
            toast({ title: "Error", description: "Fallo al eliminar secreto", variant: "error" });
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Secretos</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Cargando...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Secretos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Nuevo Secreto
                    </h3>

                    <div className="space-y-2">
                        <Label>Título</Label>
                        <Input name="title" />
                    </div>

                    <div className="space-y-2">
                        <Label>Contenido</Label>
                        <Textarea name="content" />
                    </div>

                    <UploadDropzone
                        value={newSecretImageUrl}
                        onChange={setNewSecretImageUrl}
                        label="Imagen del secreto"
                    />

                    <div className="space-y-2">
                        <Label>URL de Imagen (solo lectura)</Label>
                        <Input value={newSecretImageUrl} readOnly placeholder="Subí una imagen para generar una URL" />
                    </div>

                    <div className="space-y-2">
                        <Label>Código de Desbloqueo</Label>
                        <Input name="code" required placeholder="SECRET123" />
                    </div>

                    <Button type="submit" className="w-full">
                        Crear Secreto
                    </Button>
                </form>

                <div className="space-y-3">
                    <h3 className="font-semibold">Secretos Existentes ({secrets.length})</h3>
                    {secrets.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay secretos todavía.</p>
                    ) : (
                        <div className="space-y-2">
                            {secrets.map((secret) => (
                                <div key={secret.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{secret.title || "Secreto Sin Título"}</p>
                                        <p className="text-sm text-muted-foreground">Código: {secret.code}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(secret)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(secret.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Secreto</DialogTitle>
                    </DialogHeader>
                    {editingSecret && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input name="title" defaultValue={editingSecret.title || ""} />
                            </div>

                            <div className="space-y-2">
                                <Label>Contenido</Label>
                                <Textarea name="content" defaultValue={editingSecret.content || ""} />
                            </div>

                            <UploadDropzone
                                value={editImageUrl}
                                onChange={setEditImageUrl}
                                label="Imagen del secreto"
                            />

                            <div className="space-y-2">
                                <Label>URL de Imagen (solo lectura)</Label>
                                <Input value={editImageUrl} readOnly placeholder="Subí una imagen para generar una URL" />
                            </div>

                            <div className="space-y-2">
                                <Label>Código de Desbloqueo</Label>
                                <Input name="code" defaultValue={editingSecret.code} required placeholder="SECRET123" />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    Guardar Cambios
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default function AdminPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
            <Tabs defaultValue="settings">
                <TabsList className="mb-6">
                    <TabsTrigger value="settings">Configuración</TabsTrigger>
                    <TabsTrigger value="memories">Recuerdos</TabsTrigger>
                    <TabsTrigger value="quizzes">Trivia</TabsTrigger>
                    <TabsTrigger value="secrets">Secretos</TabsTrigger>
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
