export interface StepperStep {
  id: string;
  label: string;
}

export interface RenderStepperOptions {
  /** Ordered list of steps. */
  steps: StepperStep[];
  /** Id of the step that is currently active. Steps before it get a `done` modifier. */
  currentStepId: string;
}

/**
 * Renders a horizontal progress stepper. The step before `currentStepId`
 * gets `done` (checkmark glyph); the current step gets `active`. Lines
 * between done steps are also marked done.
 *
 * The step vocabulary (ids + labels) is fully consumer-supplied. This
 * component renders only the visual structure.
 */
export function renderStepper(opts: RenderStepperOptions): HTMLElement {
  const stepper = document.createElement("div");
  stepper.className = "onboarding-stepper";

  const currentIdx = opts.steps.findIndex((s) => s.id === opts.currentStepId);

  for (let i = 0; i < opts.steps.length; i++) {
    const step = opts.steps[i];
    const stepEl = document.createElement("div");
    stepEl.className = "onboarding-step";
    if (i < currentIdx) stepEl.classList.add("done");
    if (i === currentIdx) stepEl.classList.add("active");

    const dot = document.createElement("span");
    dot.className = "step-dot";
    dot.textContent = i < currentIdx ? "✓" : String(i + 1);

    const label = document.createElement("span");
    label.className = "step-label";
    label.textContent = step.label;

    stepEl.appendChild(dot);
    stepEl.appendChild(label);
    stepper.appendChild(stepEl);

    if (i < opts.steps.length - 1) {
      const line = document.createElement("div");
      line.className = "step-line";
      if (i < currentIdx) line.classList.add("done");
      stepper.appendChild(line);
    }
  }

  return stepper;
}
