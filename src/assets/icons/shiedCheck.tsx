import * as React from "react";
import type { SVGProps } from "react";
const ShiedCheckSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M26 5H6a2 2 0 0 0-2 2v7c0 6.59 3.19 10.584 5.866 12.774 2.883 2.357 5.75 3.157 5.875 3.191a1 1 0 0 0 .525 0c.125-.034 2.989-.834 5.875-3.191C24.81 24.584 28 20.59 28 14V7a2 2 0 0 0-2-2m0 9c0 4.634-1.707 8.395-5.075 11.177A16.2 16.2 0 0 1 16 27.954a16 16 0 0 1-4.865-2.727C7.728 22.44 6 18.663 6 14V7h20zm-15.707 3.707a1 1 0 0 1 1.415-1.415L14 18.587l6.293-6.293a1 1 0 0 1 1.415 1.415l-7 7a1 1 0 0 1-1.415 0z"
    />
  </svg>
);
export default ShiedCheckSVG;