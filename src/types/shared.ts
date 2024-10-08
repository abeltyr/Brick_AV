import Decimal from "decimal.js";

export type Filter = {
  after?: string;
  before?: string;
  limit?: number;
};

export type PageListIndexType = {
  start: number;
  end: number;
  name: string;
};

export const loadLimit = 75;

export const filter: Filter = {
  limit: loadLimit,
};

export type DateRangeType = {
  startDate: Date;
  endDate: Date;
  name:
    | "Weekly"
    | "Bi-Weekly"
    | "Monthly"
    | "Quarterly"
    | "Yearly"
    | "Custom Range";
};

export type RangeType = {
  min?: number;
  max?: number;
};

export const dateNameValue = [
  "Weekly",
  "Bi-Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
  "Custom Range",
];

export const VAT_RATE = 0.15;

export const TOT_RATE = {
  good: 0.02,
  service: 0.1,
};

export const WITHHOLDING_RATE = {
  local: 0.02,
  imported: 0.03,
  unregistered: 0.3,
};
