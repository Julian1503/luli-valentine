"use client";

import * as React from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Props = {
    value?: string | null;
    onChange: (url: string) => void;
    label?: string;
};

const ACCEPT = ["image/png", "image/jpeg", "image/webp"];

export function UploadDropzone({ value, onChange, label = "Hero Image" }: Props) {
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

            onChange(url);
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

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{label}</p>
                {value ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange("")}
                        className="text-destructive"
                    >
                        <X className="mr-1 h-4 w-4" /> Eliminar
                    </Button>
                ) : null}
            </div>

            {/* Preview */}
            {(value || file) && (
                <div className="overflow-hidden rounded-lg border bg-muted/20">
                    <img
                        src={file ? URL.createObjectURL(file) : (value as string)}
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
                <p className="text-sm font-medium">Arrastrá y soltá una imagen</p>
                <p className="text-xs text-muted-foreground mb-3">PNG, JPG, WEBP</p>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                        Explorar
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
                Subí primero → luego hacé clic en <b>Guardar Configuración</b> para guardar en la BD.
            </p>
        </div>
    );
}
