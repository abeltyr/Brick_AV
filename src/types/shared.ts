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

export const loadLimit = 30;

export const filter: Filter = {
    limit: loadLimit,
}