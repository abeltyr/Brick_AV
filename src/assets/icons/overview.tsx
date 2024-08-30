import * as React from "react";
import type { SVGProps } from "react";
const OverViewSVG = (props: SVGProps<SVGSVGElement>) => (
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
            d="M13.938 3.333h1.666a1.667 1.667 0 0 1 1.667 1.666v11.667a1.667 1.667 0 0 1-1.667 1.667h-10a1.667 1.667 0 0 1-1.666-1.667V4.999a1.667 1.667 0 0 1 1.666-1.666h1.667m.833-1.667h5c.46 0 .834.373.834.833v1.667c0 .46-.374.833-.834.833h-5a.833.833 0 0 1-.833-.833V2.499c0-.46.373-.833.833-.833"
        />
    </svg>
);
export default OverViewSVG;