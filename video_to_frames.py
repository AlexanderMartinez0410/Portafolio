#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════╗
║   SCRIPT: video_to_frames.py                                            ║
║   Propósito: Extrae frames de un MP4 para usar en el lab #07           ║
║   Requisito: pip install opencv-python Pillow                           ║
╚══════════════════════════════════════════════════════════════════════════╝

Uso:
  python video_to_frames.py --input mi_video.mp4 --fps 30 --width 1280
  python video_to_frames.py  (modo interactivo)
"""

import argparse
import os
import sys
import shutil

# Asegurar encoding UTF-8 en stdout/stderr para Windows (cp1252 fix)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ─── Verificar dependencias ────────────────────────────────────────────────────
def check_deps():
    missing = []
    try:
        import cv2  # noqa: F401
    except ImportError:
        missing.append("opencv-python")
    try:
        from PIL import Image  # noqa: F401
    except ImportError:
        missing.append("Pillow")

    if missing:
        print(f"\n[ERROR] Dependencias faltantes: {', '.join(missing)}")
        print(f"   Instala con: pip install {' '.join(missing)}")
        sys.exit(1)


def extract_frames(
    input_path: str,
    output_dir: str,
    target_fps: int = 30,
    target_width: int = 1280,
    format: str = "jpg",
    quality: int = 85,
    clean: bool = True,
) -> dict:
    import cv2
    from PIL import Image

    if not os.path.exists(input_path):
        print(f"[ERROR] Video no encontrado: {input_path}")
        sys.exit(1)

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"[ERROR] No se pudo abrir el video: {input_path}")
        sys.exit(1)

    original_fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames_orig = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration_s = total_frames_orig / original_fps if original_fps > 0 else 0

    print(f"\n[INFO] Video fuente: {os.path.basename(input_path)}")
    print(f"   Resolución: {orig_w}x{orig_h}")
    print(f"   FPS original: {original_fps:.2f}")
    print(f"   Frames totales: {total_frames_orig}")
    print(f"   Duración: {duration_s:.2f}s")

    # Calcular aspect ratio para redimensionar
    aspect = orig_h / orig_w
    target_h = int(target_width * aspect)
    # Asegurar que ambas dimensiones sean pares (requerido por H.264)
    target_h = target_h if target_h % 2 == 0 else target_h + 1

    # Limpiar frames previos si se solicita
    if clean and os.path.exists(output_dir):
        for f in os.listdir(output_dir):
            if f.startswith("frame_") or f == "manifest.json":
                try:
                    os.remove(os.path.join(output_dir, f))
                except OSError:
                    pass

    os.makedirs(output_dir, exist_ok=True)

    frame_interval = max(1, round(original_fps / target_fps))
    saved_count = 0
    frame_idx = 0

    print(f"\n[INFO] Extrayendo frames a {target_fps}fps -> {target_width}x{target_h}...")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_interval == 0:
            # Redimensionar con OpenCV (más rápido)
            resized = cv2.resize(frame, (target_width, target_h), interpolation=cv2.INTER_AREA)

            # Convertir BGR → RGB para PIL
            img_rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(img_rgb)

            filename = f"frame_{saved_count:05d}.{format}"
            filepath = os.path.join(output_dir, filename)

            if format.lower() == "jpg":
                pil_img.save(filepath, "JPEG", quality=quality, optimize=True)
            else:
                pil_img.save(filepath, "PNG", optimize=True)

            saved_count += 1

            # Progreso
            if saved_count % 50 == 0:
                pct = (frame_idx / total_frames_orig) * 100
                print(f"   [{pct:5.1f}%] {saved_count} frames guardados...", end="\r")

        frame_idx += 1

    cap.release()

    # Calcular tamaño total
    total_size = sum(
        os.path.getsize(os.path.join(output_dir, f))
        for f in os.listdir(output_dir)
    )
    total_mb = total_size / (1024 * 1024)

    import json
    manifest_path = os.path.join(output_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_frames": saved_count,
            "fps": target_fps,
            "duration": duration_s,
            "format": format,
            "width": target_width,
            "height": target_h,
            "pattern": f"frame_%05d.{format}"
        }, f, indent=2)

    result = {
        "frames": saved_count,
        "output_dir": output_dir,
        "resolution": f"{target_width}x{target_h}",
        "fps": target_fps,
        "total_mb": total_mb,
        "format": format,
    }

    print(f"\n[OK] Extracción completa:")
    print(f"   Frames guardados: {saved_count}")
    print(f"   Resolución: {target_width}x{target_h}")
    print(f"   Directorio: {output_dir}/")
    print(f"   Manifiesto: {manifest_path}")
    print(f"   Tamaño total: {total_mb:.1f} MB")

    return result


def copy_original_video(src: str, dest_dir: str):
    """Copia el video original al directorio public/videos/ del portfolio."""
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, "demo.mp4")
    if src != dest:
        shutil.copy2(src, dest)
        size_mb = os.path.getsize(dest) / (1024 * 1024)
        print(f"\n[INFO] Video copiado a: {dest}")
        print(f"   Tamaño: {size_mb:.1f} MB")
    else:
        print(f"\n[INFO] Video ya está en: {dest}")


def main():
    parser = argparse.ArgumentParser(
        description="Extrae frames de un MP4 para el Lab #07 del portfolio",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--input", "-i", help="Ruta al video MP4 fuente")
    parser.add_argument("--fps", type=int, default=30, help="FPS objetivo (default: 30)")
    parser.add_argument("--width", type=int, default=1280, help="Ancho objetivo en px (default: 1280)")
    parser.add_argument(
        "--output",
        default="public/videos/frames",
        help="Directorio de frames (default: public/videos/frames)",
    )
    parser.add_argument(
        "--format",
        choices=["jpg", "png"],
        default="jpg",
        help="Formato de imagen (default: jpg)",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=85,
        help="Calidad JPEG 1-100 (default: 85)",
    )
    parser.add_argument(
        "--no-frames",
        action="store_true",
        help="Solo copia el video MP4, sin extraer frames",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        default=True,
        help="Limpia frames previos antes de extraer (default: True)",
    )

    args = parser.parse_args()

    check_deps()

    # Modo interactivo solo si no se pasa --input
    input_path = args.input
    if not input_path:
        print("\n╔══════════════════════════════════════════════════╗")
        print("║   Lab #07 — Video Scrubbing: Setup de Video      ║")
        print("╚══════════════════════════════════════════════════╝")
        print("\nEste script:")
        print("  1. Copia tu video MP4 a public/videos/demo.mp4")
        print("  2. Extrae los frames en public/videos/frames/ (opcional)\n")
        input_path = input("Ruta a tu video MP4: ").strip().strip('"').strip("'")
        copy_original_video(input_path, "public/videos")
        if not args.no_frames:
            answer = input("\n¿Extraer frames individuales también? [s/N]: ").strip().lower()
            if answer in ("s", "si", "sí", "y", "yes"):
                extract_frames(
                    input_path=input_path,
                    output_dir=args.output,
                    target_fps=args.fps,
                    target_width=args.width,
                    format=args.format,
                    quality=args.quality,
                    clean=args.clean,
                )
    else:
        # Modo automático / headless por CLI
        copy_original_video(input_path, "public/videos")
        if not args.no_frames:
            extract_frames(
                input_path=input_path,
                output_dir=args.output,
                target_fps=args.fps,
                target_width=args.width,
                format=args.format,
                quality=args.quality,
                clean=args.clean,
            )

    print("\n🚀 ¡Listo! Ahora recarga el portfolio y el Lab #07 mostrará tu video.")
    print("   La ruta configurada en el componente es: /videos/demo.mp4\n")


if __name__ == "__main__":
    main()
