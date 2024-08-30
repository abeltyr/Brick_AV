import * as React from "react";
import type { SVGProps } from "react";
const PurchaseSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        fill="none"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.67}
            d="m3.104 5 2.5-3.334h10l2.5 3.333m-15 0v11.667a1.667 1.667 0 0 0 1.667 1.667h11.667a1.666 1.666 0 0 0 1.666-1.667V4.999m-15 0h15m-4.166 3.334a3.333 3.333 0 0 1-6.667 0"
        />
    </svg>
);
export default PurchaseSVG;