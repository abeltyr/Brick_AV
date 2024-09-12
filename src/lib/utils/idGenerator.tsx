import { v4 } from "uuid";

export function generate8CharUUID() {
    return v4().replace(/-/g, "").slice(0, 8); // Remove dashes and take the first 8 characters
}

