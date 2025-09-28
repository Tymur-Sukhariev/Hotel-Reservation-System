import React, { SVGProps } from "react";

export default function CloseBotIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <div>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={60}
                height={60}
                viewBox="0 0 48 48"
                role="img"
                aria-label="Close"
                className="cursor-pointer fixed bottom-[30px] right-[30px]"
                {...props}
            >
                <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="#E6E3FC"
                    stroke="#6F45D3"
                    strokeWidth="2"
                />
                <path
                    d="M17 17 L31 31 M31 17 L17 31"
                    stroke="#6F45D3"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

