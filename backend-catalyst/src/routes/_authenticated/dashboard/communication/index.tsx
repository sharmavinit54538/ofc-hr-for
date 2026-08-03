import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Megaphone,
  Radio,
  MessageSquare,
  Target,
  Newspaper,
  FileText,
  History,
  Plus,
  Send,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ModuleCard } from "@/components/admin/module-card";
import { SIDEBAR_NAV_ITEMS } from "@/lib/admin-navigation";
import { MOCK_ANNOUNCEMENTS, MOCK_SURVEYS, MOCK_POLLS } from "@/lib/communication/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/communication/")({
  component: CommunicationLandingPage,
});

function CommunicationLandingPage() {
  const commNav = SIDEBAR_NAV_ITEMS.find((item) => item.id === "communication");

  // Modals
  const [isAncModalOpen, setIsAncModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Announcement Published", {
      description: "Company notice broadcasted to all workforce channels.",
    });
    setIsAncModalOpen(false);
  };

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Employee Survey Launched", {
      description: "Survey dispatched to target department employees.",
    });
    setIsSurveyModalOpen(false);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Live Poll Created", {
      description: "Workforce poll opened for 1-click voting.",
    });
    setIsPollModalOpen(false);
  };

  const kpiCards = [
    { title: "Total Announcements", value: "14", sub: "Active notices", icon: Megaphone, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Active Notices", value: "8", sub: "Company wide", icon: Newspaper, color: "text-sky-500", bg: "bg-sky-500/10" },
    { title: "Broadcast Messages", value: "42", sub: "SMS & Email sent", icon: Radio, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Active Surveys", value: "2", sub: "84% response rate", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Employee Polls", value: "3", sub: "Voting open", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Unread Notices", value: "0", sub: "100% read receipts", icon: Eye, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Communication & Employee Engagement Center"
        description="Company announcements, executive broadcasts, multi-channel SMS/Email campaigns, pulse surveys, and workforce polls."
        breadcrumbs={[{ label: "Communication" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAncModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Megaphone className="size-4" /> Create Announcement
            </button>
            <button
              onClick={() => setIsSurveyModalOpen(true)}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
            >
              <MessageSquare className="size-4 text-emerald-500" /> Create Survey
            </button>
            <button
              onClick={() => setIsPollModalOpen(true)}
              className="glass-tile inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold hover:bg-secondary"
            >
              <Target className="size-4 text-amber-500" /> Create Poll
            </button>
          </div>
        }
      />

      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="glass-tile rounded-2xl p-4 transition-all hover-lift">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-display text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="mt-0.5 text-[10px] font-medium text-muted-foreground truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Announcement & Active Poll Widget */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Announcement */}
        <div className="glass-tile space-y-4 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Megaphone className="size-4 text-primary" /> Active Company Announcement
            </h3>
            <Link to="/dashboard/communication/announcements" className="text-xs font-semibold text-primary hover:underline">
              View All 14
            </Link>
          </div>

          {MOCK_ANNOUNCEMENTS.slice(0, 2).map((anc) => (
            <div key={anc.id} className="rounded-xl border border-border/50 bg-card/40 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {anc.category}
                </span>
                <span className="text-muted-foreground text-[11px]">{anc.publishedDate}</span>
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">{anc.title}</h4>
              <p className="text-muted-foreground line-clamp-2">{anc.content}</p>
              <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[11px] text-muted-foreground">
                <span>By {anc.author}</span>
                <span className="font-bold text-emerald-400">Read: {anc.readCount} / {anc.totalRecipients}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Employee Poll */}
        <div className="glass-tile space-y-4 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Target className="size-4 text-amber-500" /> Live Workforce Poll
            </h3>
            <Link to={"/dashboard/communication/polls" as any} className="text-xs font-semibold text-primary hover:underline">
              All Polls
            </Link>
          </div>

          {MOCK_POLLS[0] && (
            <div className="rounded-xl border border-border/50 bg-card/40 p-4 text-xs space-y-3">
              <p className="font-bold text-foreground">{MOCK_POLLS[0].question}</p>
              <div className="space-y-2">
                {MOCK_POLLS[0].options.map((opt) => (
                  <div key={opt.label} className="space-y-1">
                    <div className="flex items-center justify-between font-medium text-[11px]">
                      <span className="text-foreground">{opt.label}</span>
                      <span className="text-muted-foreground">{opt.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-brand" style={{ width: `${opt.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                <span>{MOCK_POLLS[0].totalVotes} votes cast</span>
                <span className="font-semibold text-primary">Ends {MOCK_POLLS[0].endDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Communication Sub-Modules Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Communication Sub-Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {commNav?.subModules.map((subModule) => (
            <ModuleCard key={subModule.id} module={subModule} />
          ))}
        </div>
      </div>

      {/* Modal: Create Announcement */}
      <Dialog open={isAncModalOpen} onOpenChange={setIsAncModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Publish Company Announcement</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Broadcast official notice across email, portal dashboard & mobile apps.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Announcement Title</label>
              <input type="text" required placeholder="e.g. Q3 Townhall Meeting" className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none" />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Category</label>
              <select className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer">
                <option>CEO Townhall</option>
                <option>Policy Update</option>
                <option>Health & Safety</option>
                <option>Company Event</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Notice Content</label>
              <textarea rows={3} required placeholder="Write announcement details..." className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none resize-none" />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAncModalOpen(false)} className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold">Cancel</button>
              <button type="submit" className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow">Publish Notice</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Create Survey */}
      <Dialog open={isSurveyModalOpen} onOpenChange={setIsSurveyModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Launch Employee Pulse Survey</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Gather anonymous workforce feedback and satisfaction scores.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSurvey} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Survey Title</label>
              <input type="text" required placeholder="e.g. Work Culture Pulse 2026" className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none" />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Target Department</label>
              <select className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none cursor-pointer">
                <option>All Departments</option>
                <option>Product Engineering</option>
                <option>Human Resources</option>
                <option>Finance Operations</option>
              </select>
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsSurveyModalOpen(false)} className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold">Cancel</button>
              <button type="submit" className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow">Launch Survey</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Create Poll */}
      <Dialog open={isPollModalOpen} onOpenChange={setIsPollModalOpen}>
        <DialogContent className="glass-elevated max-w-md rounded-2xl border border-glass-border p-6 shadow-float">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Create Quick Poll</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">1-click voting poll for instant employee feedback.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePoll} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Poll Question</label>
              <input type="text" required placeholder="e.g. Which topic for next workshop?" className="w-full rounded-xl border border-input bg-card/70 px-3 py-2 outline-none" />
            </div>

            <DialogFooter className="mt-5 flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsPollModalOpen(false)} className="glass-tile rounded-xl px-4 py-2 text-xs font-semibold">Cancel</button>
              <button type="submit" className="rounded-xl bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow">Start Voting</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
