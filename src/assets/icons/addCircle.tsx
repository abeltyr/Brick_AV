import * as React from "react";
import type { SVGProps } from "react";
const AddCircleSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        {...props}
    >
        <path
            fill="currentColor"
            d="M10 1.875A8.125 8.125 0 1 0 18.125 10 8.133 8.133 0 0 0 10 1.875m0 15A6.875 6.875 0 1 1 16.875 10 6.883 6.883 0 0 1 10 16.875M13.75 10a.624.624 0 0 1-.625.625h-2.5v2.5a.624.624 0 1 1-1.25 0v-2.5h-2.5a.625.625 0 1 1 0-1.25h2.5v-2.5a.625.625 0 0 1 1.25 0v2.5h2.5a.625.625 0 0 1 .625.625"
        />
    </svg>
);
export default AddCircleSVG;