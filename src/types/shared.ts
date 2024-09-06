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

export const loadLimit = 100;

export const filter: Filter = {
  limit: loadLimit,
};
