import React, { useRef } from "react";
import { QrCode, Printer, Download, Copy, Check, X, Tag, User, MapPin, Building, ShieldCheck, Barcode, Laptop } from "lucide-react";
import { toast } from "sonner";
import type { AssetItem } from "@/types/asset";

interface AssetQrModalProps {
  asset: AssetItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssetQrModal({ asset, isOpen, onClose }: AssetQrModalProps) {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !asset) return null;

  // Construct scannable text payload & deep link
  const assetUrl = `${window.location.origin}/dashboard/assets/inventory?search=${encodeURIComponent(asset.tag_id)}`;
  
  const qrTextPayload = `[OFC-HR ASSET TELEMETRY]
Tag ID: ${asset.tag_id}
Asset Name: ${asset.name}
Serial No: ${asset.serial_number}
Assigned Employee: ${asset.assigned_to_name || "Unassigned (Available)"}
Department: ${asset.department || "N/A"}
Location: ${asset.location || "N/A"}
Status: ${asset.status}
Verification Link: ${assetUrl}`;

  // High-resolution QR code endpoint
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(assetUrl)}&color=0f172a&bgcolor=ffffff`;

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(qrTextPayload);
    setCopied(true);
    toast.success("Asset telemetry copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `QR_${asset.tag_id}_${asset.name.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("QR Code image downloading...");
  };

  const handlePrintLabel = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=600,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Tag Label - ${asset.tag_id}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #0f172a; }
            .badge { border: 2px solid #0f172a; border-radius: 16px; padding: 20px; text-align: center; max-width: 320px; margin: 0 auto; }
            .qr-img { width: 180px; height: 180px; margin: 12px auto; }
            .tag { font-size: 20px; font-weight: 800; letter-spacing: 1px; color: #2563eb; }
            .title { font-size: 16px; font-weight: 700; margin-top: 4px; }
            .meta { font-size: 12px; color: #475569; margin-top: 8px; line-height: 1.4; }
            .owner { font-size: 13px; font-weight: 600; color: #16a34a; margin-top: 8px; background: #f0fdf4; padding: 4px 8px; border-radius: 8px; display: inline-block; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-tile relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              <QrCode className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Asset QR Code & Tag
              </h3>
              <p className="text-xs text-muted-foreground">
                Scan to verify asset ownership & details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Printable Label Badge Card */}
        <div
          ref={printRef}
          className="rounded-2xl border border-border bg-card/60 p-5 text-center shadow-inner space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            <Tag className="size-3.5" /> Tag ID: {asset.tag_id}
          </div>

          {/* QR Code Container */}
          <div className="relative mx-auto size-44 rounded-2xl bg-white p-3 shadow-md border border-slate-200 flex items-center justify-center group">
            <img
              src={qrImageUrl}
              alt={`QR Code for ${asset.tag_id}`}
              className="size-full object-contain"
              loading="eager"
            />
          </div>

          <div>
            <h4 className="font-display text-lg font-bold text-foreground">
              {asset.name}
            </h4>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
              <Barcode className="size-3.5" /> Serial: {asset.serial_number}
            </p>
          </div>

          {/* Ownership Badge */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-500 font-semibold space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider font-bold">
              <User className="size-3.5" /> Asset Custodian
            </div>
            <div className="text-sm font-bold text-foreground">
              {asset.assigned_to_name || "Unassigned (Available in Stock)"}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-left pt-1 text-xs text-muted-foreground">
            <div className="rounded-lg bg-secondary/50 p-2 border border-border/50">
              <span className="text-[10px] block font-bold uppercase text-muted-foreground">Department</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <Building className="size-3 text-primary" /> {asset.department || "N/A"}
              </span>
            </div>

            <div className="rounded-lg bg-secondary/50 p-2 border border-border/50">
              <span className="text-[10px] block font-bold uppercase text-muted-foreground">Location</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3 text-amber-500" /> {asset.location || "N/A"}
              </span>
            </div>

            <div className="rounded-lg bg-secondary/50 p-2 border border-border/50">
              <span className="text-[10px] block font-bold uppercase text-muted-foreground">Status</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <ShieldCheck className="size-3 text-emerald-500" /> {asset.status}
              </span>
            </div>

            <div className="rounded-lg bg-secondary/50 p-2 border border-border/50">
              <span className="text-[10px] block font-bold uppercase text-muted-foreground">Category</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                <Laptop className="size-3 text-purple-500" /> {asset.category_name || "Hardware"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleDownloadQr}
            className="glass-tile flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <Download className="size-4 text-primary" />
            <span>Download</span>
          </button>

          <button
            onClick={handlePrintLabel}
            className="glass-tile flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <Printer className="size-4 text-amber-500" />
            <span>Print Label</span>
          </button>

          <button
            onClick={handleCopyDetails}
            className="glass-tile flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4 text-purple-500" />}
            <span>{copied ? "Copied!" : "Copy Details"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
