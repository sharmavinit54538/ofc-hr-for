import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { fetchHitlQueue, takeHitlAction, AIHumanInLoopItem } from "@/lib/ai-workforce";

interface HitlApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export function HitlApprovalDrawer({ isOpen, onClose, onRefresh }: HitlApprovalDrawerProps) {
  const [items, setItems] = useState<AIHumanInLoopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchHitlQueue();
      setItems(data);
    } catch (err) {
      console.error("Failed to load HITL queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadQueue();
  }, [isOpen]);

  const handleAction = async (itemId: string, action: 'approve' | 'reject') => {
    setActionLoading(itemId);
    try {
      await takeHitlAction(itemId, action, notes[itemId] || "");
      await loadQueue();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("HITL Action Error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <SheetTitle className="text-base font-bold">Human-in-the-Loop Approvals Queue</SheetTitle>
          </div>
          <SheetDescription className="text-xs">
            High-risk AI generated actions (offer letters, candidate communications, e-signatures) requiring explicit HR sign-off.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading pending approvals...
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold">HITL Queue Clear!</p>
              <p className="text-xs text-muted-foreground">All AI-generated letters, communications, and onboarding plans have been reviewed.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Agent: <span className="font-mono text-primary">{item.agent_key}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                    Pending Review
                  </Badge>
                </div>

                <div className="p-3 rounded-md bg-slate-950 text-slate-100 font-mono text-[11px] max-h-[160px] overflow-y-auto">
                  <pre>{JSON.stringify(item.details, null, 2)}</pre>
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Optional reviewer notes / approval reasoning..."
                    value={notes[item.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                    rows={2}
                    className="text-xs"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(item.id, "reject")}
                      disabled={actionLoading === item.id}
                      className="text-destructive hover:bg-destructive/10 text-xs h-8"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(item.id, "approve")}
                      disabled={actionLoading === item.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    >
                      {actionLoading === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      )}
                      Approve & Dispatch
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
