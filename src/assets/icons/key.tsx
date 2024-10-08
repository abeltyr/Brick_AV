import * as React from "react";
import type { SVGProps } from "react";
const KeySVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
        fill="none"
        {...props}
    >
        <path
            fill="currentColor"
            d="M27.071 4.928A10 10 0 0 0 10.49 15.097l-6.903 6.902A1.98 1.98 0 0 0 3 23.413v3.586a2 2 0 0 0 2 2h4a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 1-1v-2h2a1 1 0 0 0 .707-.292l1.195-1.197c1 .326 2.046.49 3.098.49h.012a10 10 0 0 0 7.06-17.072M28 12.262c-.136 4.261-3.719 7.732-7.986 7.737H20a8 8 0 0 1-2.956-.563 1 1 0 0 0-1.105.21l-1.353 1.353H12a1 1 0 0 0-1 1v2H9a1 1 0 0 0-1 1v2H5v-3.586l7.354-7.352a1 1 0 0 0 .21-1.105A8 8 0 0 1 12 11.989c0-4.267 3.476-7.85 7.738-7.986A8 8 0 0 1 28 12.262m-4-2.763a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
        />
    </svg>
);
export default KeySVG;