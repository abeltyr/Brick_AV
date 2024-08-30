import * as React from "react";
import type { SVGProps } from "react";

const EmptyStateSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={64}
        height={64}
        fill="none"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={5.344}
            d="M32 21.332v10.667m0 10.666h.027M58.667 32c0 14.727-11.94 26.666-26.667 26.666S5.333 46.726 5.333 32 17.273 5.332 32 5.332s26.667 11.94 26.667 26.667"
        />
    </svg>
);
export default EmptyStateSVG;