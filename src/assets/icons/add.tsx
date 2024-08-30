import * as React from "react";
import type { SVGProps } from "react";

const AddSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        {...props}
    >
        <g clipPath="url(#a)">
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.67}
                d="M8 5.333v5.333M5.333 8h5.334m4 0A6.667 6.667 0 1 1 1.333 8a6.667 6.667 0 0 1 13.334 0"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);
export default AddSVG;