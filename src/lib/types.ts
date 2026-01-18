export enum Step {
  Plucking = 0,
  Withering,
  Rolling,
  WrappingHeaping,
  PartialOxidation,
  Oxidation,
  Fermentation,
  Drying,
  Roasting,
  Aging,
  Pressing,
  Packing,
}

export const stepLabels: Record<Step, string> = {
  [Step.Plucking]: "Plucking",
  [Step.Withering]: "Withering",
  [Step.Rolling]: "Rolling",
  [Step.WrappingHeaping]: "Wrapping / Heaping",
  [Step.PartialOxidation]: "Partial Oxidation",
  [Step.Oxidation]: "Oxidation",
  [Step.Fermentation]: "Fermentation",
  [Step.Drying]: "Drying",
  [Step.Roasting]: "Roasting",
  [Step.Aging]: "Aging",
  [Step.Pressing]: "Pressing",
  [Step.Packing]: "Packing",
};
