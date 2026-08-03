import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ position = "top-right", ...props }: ToasterProps) => {
  return (
    <Sonner
      position={position}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast glass-elevated group-[.toaster]:text-foreground group-[.toaster]:rounded-2xl group-[.toaster]:border-border/60 group-[.toaster]:pl-4 relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-2xl before:bg-gradient-brand",
          success: "before:bg-success",
          error: "before:bg-destructive",
          warning: "before:bg-primary-glow",
          info: "before:bg-accent",
          icon: "group-[.toast]:animate-in group-[.toast]:zoom-in-50 group-[.toast]:duration-300",
          title: "group-[.toast]:font-display group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-gradient-brand group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
