"use client";

/** "How It Works" 3-step explanation section */
import Section3D from "@/components/shared/Section3D";

export default function WorkflowSteps() {
  return (
    <Section3D className="relative pt-24 pb-12 bg-background">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Your Path to Glory</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative p-6 rounded-2xl border border-border bg-card/50 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full font-display text-2xl mb-4 border border-primary/20">
              1
            </div>
            <h3 className="font-display text-xl mb-2 text-foreground">Browse</h3>
            <p className="text-sm text-muted-foreground">
              Scroll down to view upcoming matches and results.
            </p>
          </div>
          <div className="relative p-6 rounded-2xl border border-border bg-card/50 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full font-display text-2xl mb-4 border border-primary/20">
              2
            </div>
            <h3 className="font-display text-xl mb-2 text-foreground">Predict</h3>
            <p className="text-sm text-muted-foreground">
              Input the exact score and pick the winning team.
            </p>
          </div>
          <div className="relative p-6 rounded-2xl border border-border bg-card/50 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full font-display text-2xl mb-4 border border-primary/20">
              3
            </div>
            <h3 className="font-display text-xl mb-2 text-foreground">Lock In</h3>
            <p className="text-sm text-muted-foreground">
              Verify your email to lock your prediction before the deadline!
            </p>
          </div>
        </div>
      </div>
    </Section3D>
  );
}
