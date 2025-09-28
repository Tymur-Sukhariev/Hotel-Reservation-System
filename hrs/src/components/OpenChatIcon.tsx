import { SVGProps } from "react";

export default function ChatIcon({
    size = 60,
    ...props
}: { size?: number } & SVGProps<SVGSVGElement>) {
    return (
        <svg
            className="cursor-pointer fixed bottom-[30px] right-[30px]"
            width={size}
            height={size}
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Happy help robot"
            {...props}
        >
            <defs>
                <radialGradient id="bg" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#F4F2FF" />
                    <stop offset="100%" stopColor="#E9E6FF" />
                </radialGradient>
            </defs>

            {/* circular badge background */}
            <circle cx="25" cy="25" r="24" fill="url(#bg)" stroke="#6B46C1" strokeWidth="2" />

            {/* robot */}
            <g transform="translate(25 26)">
                {/* antenna */}
                <rect x="-1" y="-18" width="2" height="6" fill="#7C3AED" />
                <circle cx="0" cy="-20" r="2.2" fill="#C4B5FD" />

                {/* head */}
                <rect x="-10.5" y="-12" width="21" height="14" rx="6" fill="#7C3AED" />
                {/* eyes */}
                <circle cx="-4.5" cy="-6" r="1.6" fill="#FFFFFF" />
                <circle cx="4.5" cy="-6" r="1.6" fill="#FFFFFF" />
                {/* happy smile (light purple) */}
                <path d="M -5 -2 Q 0 3 5 -2" stroke="#C4B5FD" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* body */}
                <rect x="-12" y="2" width="24" height="11" rx="5" fill="#7C3AED" />
                {/* chest highlight */}
                <rect x="-6.5" y="4.5" width="13" height="6" rx="3" fill="#C4B5FD" opacity="0.9" />

                {/* arms */}
                <rect x="-15.5" y="3.5" width="3.5" height="8" rx="1.75" fill="#7C3AED" />
                <rect x="12" y="3.5" width="3.5" height="8" rx="1.75" fill="#7C3AED" />
            </g>
        </svg>
    );
}
