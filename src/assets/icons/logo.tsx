import * as React from "react";
import type { SVGProps } from "react";
const LogoSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={42}
        fill="none"
        {...props}
    >
        <g fill="#fff" opacity={0.84}>
            <path d="m15.802 20.083 14.747-8.508-14.747-8.512-14.747 8.512zM14.747 21.91 0 13.402v17.023l14.747 8.513z" />
            <path d="M16.859 21.909v17.027l14.747-8.512V13.4z" opacity={0.5} />
        </g>
    </svg>
);
export default LogoSVG;