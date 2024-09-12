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
};

export type RangeType = {
  min?: number;
  max?: number;
};
