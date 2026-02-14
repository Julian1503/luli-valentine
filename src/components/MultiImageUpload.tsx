"use client";

import * as React from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Props = {
    values: string[];
    onChange: (urls: string[]) => void;
    label?: string;
};

const ACCEPT = ["image/png", "image/jpeg", "image/webp"];

export function MultiImageUpload({ values, onChange, label = "Imágenes" }: Props) {
    const [dragActive, setDragActive] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const pickFile = (f: File | null) => {
        if (!f) return;
        if (!ACCEPT.includes(f.type)) {
            toast({ title: "Archivo inválido", description: "Usá PNG, JPG, o WEBP.", variant: "error" });
            return;
        }
        setFile(f);
    };

    const onDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        if (e.type === "dragleave") setDragActive(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const f = e.dataTransfer.files?.[0] ?? null;
        pickFile(f);
    };

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        pickFile(f);
        e.target.value = "";
    };

    const upload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
            if (!signRes.ok) throw new Error("Fallo al firmar la subida");
            const sign = (await signRes.json()) as {
                cloudName: string;
                apiKey: string;
                timestamp: number;
                signature: string;
                folder: string;
            };

            const fd = new FormData();
            fd.append("file", file);
            fd.append("api_key", sign.apiKey);
            fd.append("timestamp", String(sign.timestamp));
            fd.append("signature", sign.signature);
            fd.append("folder", sign.folder);

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
                { method: "POST", body: fd }
            );

            if (!cloudRes.ok) throw new Error("Fallo la subida a Cloudinary");
            const cloud = await cloudRes.json();

            const url = String(cloud.secure_url ?? "");
            if (!url) throw new Error("URL segura no encontrada");

            onChange([...values, url]);
            setFile(null);

            toast({ title: "¡Subida exitosa!", description: "Imagen lista para guardar.", variant: "success" });
        } catch (e) {
            toast({
                title: "Fallo la subida",
                description: e instanceof Error ? e.message : "Intentá de nuevo.",
                variant: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        onChange(values.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{label}</p>
            </div>

            {/* Preview existing images */}
            {values.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {values.map((url, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg border bg-muted/20 group">
                            <img
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                className="h-32 w-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview file before upload */}
            {file && (
                <div className="overflow-hidden rounded-lg border bg-muted/20">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Vista previa"
                        className="h-48 w-full object-cover"
                    />
                </div>
            )}

            {/* Dropzone */}
            <div
                onDragEnter={onDrag}
                onDragOver={onDrag}
                onDragLeave={onDrag}
                onDrop={onDrop}
                className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
            >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Arrastra y suelta una imagen</p>
                <p className="text-xs text-muted-foreground mb-3">PNG, JPG, WEBP</p>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                        <Plus className="mr-1 h-4 w-4" /> Seleccionar
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        onClick={upload}
                        disabled={!file || uploading}
                    >
                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Subir
                    </Button>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT.join(",")}
                    className="hidden"
                    onChange={onSelect}
                />
            </div>

            <p className="text-xs text-muted-foreground">
                Sube primero las imágenes → luego hacé clic en <b>Crear Recuerdo</b> para guardar en la BD.
            </p>
        </div>
    );
}
