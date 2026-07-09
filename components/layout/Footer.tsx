/** Site footer */

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <span className="font-display tracking-widest">GOAL26</span>
        </div>
        <p>© 2026 GOAL26. Unofficial fan experience. All eyes on the pitch.</p>
      </div>
    </footer>
  );
}
