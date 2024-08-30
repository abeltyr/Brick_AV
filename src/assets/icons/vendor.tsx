import * as React from "react";
import type { SVGProps } from "react";
const VendorSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={18}
        fill="none"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.67}
            d="M13.938 12.333V1.5h-12.5v10.833zm0 0h5.833V8.167l-2.5-2.5h-3.334zM7.27 14.417a2.083 2.083 0 1 1-4.167 0 2.083 2.083 0 0 1 4.167 0m10.833 0a2.083 2.083 0 1 1-4.167 0 2.083 2.083 0 0 1 4.167 0"
        />
    </svg>
);
export default VendorSVG;