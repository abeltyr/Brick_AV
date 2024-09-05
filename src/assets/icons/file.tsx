import * as React from "react";
import type { SVGProps } from "react";

const FileCSV = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        {...props}
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.67}
            d="M8.667 1.334H4a1.333 1.333 0 0 0-1.333 1.333v10.667A1.333 1.333 0 0 0 4 14.667h8a1.334 1.334 0 0 0 1.333-1.333V6.001M8.667 1.334l4.666 4.667M8.667 1.334v4.667h4.666"
        />
    </svg>
);
export default FileCSV;