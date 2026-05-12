import { assert, assertEquals } from "@std/assert";
import { mountTestDom } from "../_test/dom.ts";
import { renderStepper, type StepperStep } from "./mod.ts";

const STEPS: StepperStep[] = [
  { id: "metadata", label: "Metadata" },
  { id: "fund", label: "Fund" },
  { id: "create", label: "Create" },
];

Deno.test("renderStepper renders one step element per step and N-1 connectors", () => {
  mountTestDom();
  const el = renderStepper({ steps: STEPS, currentStepId: "fund" });
  const steps = el.querySelectorAll(".onboarding-step");
  const lines = el.querySelectorAll(".step-line");
  assertEquals(steps.length, 3);
  assertEquals(lines.length, 2);
});

Deno.test("renderStepper marks steps before current as done and the current as active", () => {
  mountTestDom();
  const el = renderStepper({ steps: STEPS, currentStepId: "fund" });
  const steps = el.querySelectorAll(".onboarding-step");
  assert((steps.item(0) as Element).classList.contains("done"));
  assert((steps.item(1) as Element).classList.contains("active"));
  assert(!(steps.item(2) as Element).classList.contains("done"));
  assert(!(steps.item(2) as Element).classList.contains("active"));
});

Deno.test("renderStepper shows the check glyph for done steps and the index for others", () => {
  mountTestDom();
  const el = renderStepper({ steps: STEPS, currentStepId: "fund" });
  const dots = el.querySelectorAll(".step-dot");
  assertEquals(dots.item(0).textContent, "✓");
  assertEquals(dots.item(1).textContent, "2");
  assertEquals(dots.item(2).textContent, "3");
});

Deno.test("renderStepper labels each step", () => {
  mountTestDom();
  const el = renderStepper({ steps: STEPS, currentStepId: "metadata" });
  const labels = el.querySelectorAll(".step-label");
  assertEquals(labels.item(0).textContent, "Metadata");
  assertEquals(labels.item(1).textContent, "Fund");
  assertEquals(labels.item(2).textContent, "Create");
});

Deno.test("renderStepper marks connector lines done when their left step is done", () => {
  mountTestDom();
  const el = renderStepper({ steps: STEPS, currentStepId: "create" });
  const lines = el.querySelectorAll(".step-line");
  assert((lines.item(0) as Element).classList.contains("done"));
  assert((lines.item(1) as Element).classList.contains("done"));
});

// ─── Generic signature: readonly path ───────────────────────────────

Deno.test("renderStepper accepts a readonly `as const` tuple of steps", () => {
  mountTestDom();
  const READONLY_STEPS = [
    { id: "account", label: "Account" },
    { id: "treasury", label: "Treasury" },
  ] as const;
  // `currentStepId` is narrowed to "account" | "treasury" by the generic.
  const el = renderStepper({
    steps: READONLY_STEPS,
    currentStepId: "treasury",
  });
  const steps = el.querySelectorAll(".onboarding-step");
  assertEquals(steps.length, 2);
  assert((steps.item(0) as Element).classList.contains("done"));
  assert((steps.item(1) as Element).classList.contains("active"));
});

// ─── Generic signature: mutable path (regression) ───────────────────

Deno.test("renderStepper still accepts a mutable StepperStep[]", () => {
  mountTestDom();
  const steps: StepperStep[] = [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ];
  const el = renderStepper({ steps, currentStepId: "b" });
  assertEquals(el.querySelectorAll(".onboarding-step").length, 2);
});

// ─── Generic signature: compile-time rejection of unknown id ────────
//
// The `@ts-expect-error` below is the assertion: if the generic ever
// regresses and starts accepting any string for currentStepId, the
// directive becomes a lint error and `deno task lint` fails. The test
// body itself doesn't run (the `if (false)` guards against runtime
// execution); the type-system check is the whole point.

Deno.test("renderStepper rejects a currentStepId that isn't in the steps array (compile-time)", () => {
  mountTestDom();
  const READONLY_STEPS = [
    { id: "account", label: "Account" },
    { id: "treasury", label: "Treasury" },
  ] as const;
  if (false as boolean) {
    renderStepper({
      steps: READONLY_STEPS,
      // @ts-expect-error currentStepId "unknown" is not assignable to "account" | "treasury"
      currentStepId: "unknown",
    });
  }
  assert(true);
});
