import React from 'react';

export const ReturnIcon = function (props: any) {
  return (
    <svg
      {...props}
      width="6"
      height="12"
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.31201 1L1.00012 5.85088L5.31201 10.7018"
        stroke="white"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const AddIcon = function (props: any) {
  return (
    <svg
      {...props}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11"
        cy="11"
        r="10"
        transform="rotate(-90 11 11)"
        stroke="#91A2AE"
        strokeOpacity="0.2"
        strokeWidth="1.2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9749 6.77447C11.9749 6.34674 11.6282 6 11.2004 6C10.7727 6 10.426 6.34674 10.426 6.77447V10.4255H6.77447C6.34674 10.4255 6 10.7723 6 11.2C6 11.6277 6.34674 11.9745 6.77447 11.9745H10.426V15.6255C10.426 16.0533 10.7727 16.4 11.2004 16.4C11.6282 16.4 11.9749 16.0533 11.9749 15.6255V11.9745H15.6255C16.0533 11.9745 16.4 11.6277 16.4 11.2C16.4 10.7723 16.0533 10.4255 15.6255 10.4255H11.9749V6.77447Z"
        fill="#586F80"
      />
    </svg>
  );
};

export const SelectIcon = function (props: any) {
  return (
    <svg
      {...props}
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L5.85088 5.31189L10.7018 1"
        stroke="white"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const BgIcon = function (props: any) {
  return (
    <svg
      {...props}
      width="392"
      height="397"
      viewBox="0 0 392 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_124_4873"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="392"
        height="397"
      >
        <rect width="392" height="397" rx="12" fill="black" />
      </mask>
      <g mask="url(#mask0_124_4873)">
        <circle
          opacity="0.1"
          cx="375"
          cy="22.8345"
          r="40.8952"
          transform="rotate(45 375 22.8345)"
          fill="url(#paint0_linear_124_4873)"
          stroke="url(#paint1_linear_124_4873)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          opacity="0.1"
          d="M-28 216.348C-23.6273 225.034 -8.32298 242.406 17.913 242.406C50.7081 242.406 63.8261 184 109.739 184C155.652 184 158.932 246 201.565 246C244.199 246 247.478 184 290.112 184C332.745 184 333.565 242.406 368 242.406"
          stroke="url(#paint2_linear_124_4873)"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_124_4873"
          x1="375"
          y1="-18.0607"
          x2="375"
          y2="63.7297"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#26343E" />
          <stop offset="1" stopColor="#1D2932" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_124_4873"
          x1="331.902"
          y1="63.7297"
          x2="390.492"
          y2="63.7297"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFD1" />
          <stop offset="1" stopColor="#5B40FF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_124_4873"
          x1="378.664"
          y1="246"
          x2="94.9946"
          y2="246"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFD1" stopOpacity="0" />
          <stop offset="1" stopColor="#5B40FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const SwitchButton = function (props: any) {
  return (
    <svg
      {...props}
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 4.11538H9.65385L6.53846 1"
        stroke="#00C6A2"
        strokeLinecap="round"
      />
      <path
        d="M10 6.88462L1.34615 6.88461L4.46154 10"
        stroke="#00C6A2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const AddButton = function (props: any) {
  return (
    <svg
      {...props}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.40039 0.7C5.40039 0.313401 5.08699 0 4.70039 0C4.31379 0 4.00039 0.313401 4.00039 0.7V4H0.7C0.313401 4 0 4.3134 0 4.7C0 5.0866 0.313401 5.4 0.7 5.4H4.00039V8.7C4.00039 9.0866 4.31379 9.4 4.70039 9.4C5.08699 9.4 5.40039 9.0866 5.40039 8.7V5.4H8.7C9.0866 5.4 9.4 5.0866 9.4 4.7C9.4 4.3134 9.0866 4 8.7 4H5.40039V0.7Z"
        fill="#7E8A93"
      />
    </svg>
  );
};

export const ReduceButton = function (props: any) {
  return (
    <svg
      {...props}
      width="10"
      height="2"
      viewBox="0 0 10 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0.7C0 0.313401 0.313401 0 0.7 0H8.7C9.0866 0 9.4 0.313401 9.4 0.7C9.4 1.0866 9.0866 1.4 8.7 1.4H0.7C0.313401 1.4 0 1.0866 0 0.7Z"
        fill="#7E8A93"
      />
    </svg>
  );
};

export const SwitchIcon = function (props: any) {
  return (
    <svg
      {...props}
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.73335 10.0165C9.73335 10.8358 9.06924 11.4999 8.25002 11.4999C7.4308 11.4999 6.76669 10.8358 6.76669 10.0165C6.76669 9.19733 7.4308 8.53322 8.25002 8.53322C9.06924 8.53322 9.73335 9.19733 9.73335 10.0165ZM11.1741 9.27205C11.2045 9.2684 11.2353 9.26652 11.2667 9.26652L12.2333 9.26652C12.6568 9.26652 13 9.60976 13 10.0332C13 10.4566 12.6568 10.7998 12.2333 10.7998L11.2667 10.7998C11.2325 10.7998 11.1988 10.7976 11.1657 10.7933C10.8231 12.0829 9.64753 13.0332 8.25002 13.0332C6.85251 13.0332 5.67696 12.0829 5.3343 10.7933C5.30128 10.7976 5.26761 10.7998 5.23341 10.7998L0.766754 10.7998C0.343337 10.7998 8.98706e-05 10.4566 8.99077e-05 10.0332C8.99447e-05 9.60976 0.343337 9.26651 0.766754 9.26651L5.23341 9.26652C5.26472 9.26652 5.2956 9.26839 5.32593 9.27204C5.65744 7.96604 6.8409 6.99989 8.25002 6.99989C9.65914 6.99989 10.8426 7.96604 11.1741 9.27205ZM3.26668 3.01657C3.26668 2.19735 3.93079 1.53324 4.75 1.53324C5.56922 1.53324 6.23333 2.19735 6.23333 3.01657C6.23333 3.83579 5.56922 4.49989 4.75001 4.49989C3.93079 4.49989 3.26668 3.83579 3.26668 3.01657ZM4.75 -9.03666e-05C3.3525 -9.04888e-05 2.17694 0.950207 1.83428 2.23986C1.80125 2.23551 1.76757 2.23327 1.73335 2.23327L0.766688 2.23327C0.343271 2.23327 2.38023e-05 2.57652 2.37653e-05 2.99993C2.37283e-05 3.42335 0.343271 3.7666 0.766688 3.7666L1.73335 3.7666C1.76468 3.7666 1.79557 3.76472 1.82592 3.76107C2.15742 5.06707 3.34089 6.03322 4.75001 6.03322C6.15912 6.03322 7.34258 5.06707 7.67409 3.76107C7.70443 3.76472 7.7353 3.7666 7.76662 3.7666L12.2333 3.7666C12.6567 3.7666 12.9999 3.42335 12.9999 2.99993C12.9999 2.57652 12.6567 2.23327 12.2333 2.23327L7.76662 2.23327C7.73242 2.23327 7.69874 2.23551 7.66573 2.23985C7.32307 0.950204 6.14751 -9.02444e-05 4.75 -9.03666e-05Z"
        fill="currentColor"
      />
    </svg>
  );
};
