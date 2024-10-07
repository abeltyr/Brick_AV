import * as React from "react";
import type { SVGProps } from "react";
const ArrowRightSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        {...props}
    >
        <path
            fill="currentColor"
            d="m17.317 10.443-5.625 5.624a.625.625 0 1 1-.884-.884l4.558-4.558H3.125a.625.625 0 1 1 0-1.25h12.241l-4.558-4.557a.625.625 0 1 1 .884-.885l5.625 5.625a.626.626 0 0 1 0 .885"
        />
    </svg>
);
export default ArrowRightSVG;