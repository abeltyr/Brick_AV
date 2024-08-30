import * as React from "react";
import type { SVGProps } from "react";
const ProductSVG = (props: SVGProps<SVGSVGElement>) => (
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
            d="m14.354 7.833-7.5-4.325M3.33 5.8l7.275 4.208L17.88 5.8m-7.275 12.6V10m7.5 3.333V6.666a1.67 1.67 0 0 0-.833-1.441L11.437 1.89a1.67 1.67 0 0 0-1.666 0L3.938 5.225a1.67 1.67 0 0 0-.834 1.441v6.667a1.67 1.67 0 0 0 .834 1.442l5.833 3.333a1.67 1.67 0 0 0 1.666 0l5.834-3.333a1.67 1.67 0 0 0 .833-1.442"
        />
    </svg>
);
export default ProductSVG;