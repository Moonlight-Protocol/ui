import { assert, assertEquals } from "@std/assert";
import { mountTestDom } from "../_test/dom.ts";
import { renderStepper } from "./mod.ts";

const STEPS = [
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
