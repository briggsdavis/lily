// Inline version of public/CREST-MAROON.svg so the letter ring can rotate around a still flower.
const ringOrigin = "622px 603px"

const displayLetters = [
  ["translate(934.34 227.06) rotate(48.25)", "L"],
  ["translate(1011.5613 319.5654) rotate(58.992)", "I"],
  ["translate(1054.6765 392.5767) rotate(70.1329)", "L"],
  ["translate(1090.1111 492.8624) rotate(81.6977)", "Y"],
  ["translate(302.22 976.12) rotate(-130.68)", "L"],
  ["translate(226.73 882.19) rotate(-119.94)", "I"],
  ["translate(184.98 808.39) rotate(-108.8)", "L"],
  ["translate(151.42 707.46) rotate(-97.24)", "Y"],
] as const

const smallLetters = [
  ["translate(1146.6501 721.8914) rotate(104.9701)", "K"],
  ["translate(1129.9099 780.1802) rotate(110.052)", "I"],
  ["translate(1118.2146 812.0142) rotate(114.7756)", "T"],
  ["translate(1095.7761 859.7144) rotate(120.7433)", "C"],
  ["translate(1064.575 911.0132) rotate(127.2533)", "H"],
  ["translate(1026.2078 960.1465) rotate(133.5581)", "E"],
  ["translate(986.8806 1000.8242) rotate(139.8735)", "N"],
  ["translate(937.9919 1040.4028) rotate(144.5965)", " "],
  ["translate(916.8337 1055.6975) rotate(149.1866)", "&"],
  ["translate(864.6062 1085.4983) rotate(153.7921)", " "],
  ["translate(841.2625 1097.2268) rotate(158.4249)", "C"],
  ["translate(785.9724 1118.5596) rotate(165.02)", "O"],
  ["translate(723.6042 1134.4219) rotate(171.6767)", "C"],
  ["translate(664.0984 1142.48) rotate(178.0565)", "K"],
  ["translate(603.6248 1143.7568) rotate(-175.9448)", "T"],
  ["translate(553.8748 1139.9951) rotate(-170.3543)", "A"],
  ["translate(495.4734 1128.9844) rotate(-165.3544)", "I"],
  ["translate(462.655 1120.3098) rotate(-160.6899)", "L"],
  ["translate(413.0632 1102.4358) rotate(-154.7627)", "S"],
  ["translate(99.54 474.9) rotate(-73.96)", "K"],
  ["translate(117.35 416.96) rotate(-68.88)", "I"],
  ["translate(129.65 385.32) rotate(-64.16)", "T"],
  ["translate(152.97 338.05) rotate(-58.19)", "C"],
  ["translate(185.12 287.34) rotate(-51.68)", "H"],
  ["translate(224.4 238.93) rotate(-45.38)", "E"],
  ["translate(264.47 198.99) rotate(-39.06)", "N"],
  ["translate(314.09 160.33) rotate(-34.34)", " "],
  ["translate(335.53 145.43) rotate(-29.75)", "&"],
  ["translate(388.3 116.6) rotate(-25.14)", " "],
  ["translate(411.86 105.31) rotate(-20.51)", "C"],
  ["translate(467.54 85.01) rotate(-13.91)", "O"],
  ["translate(530.19 70.31) rotate(-7.26)", "C"],
  ["translate(589.84 63.36) rotate(-.88)", "K"],
  ["translate(650.33 63.21) rotate(5.12)", "T"],
  ["translate(700 67.89) rotate(10.71)", "A"],
  ["translate(758.18 79.99) rotate(15.71)", "I"],
  ["translate(790.83 89.27) rotate(20.38)", "L"],
  ["translate(840.08 108.07) rotate(26.3)", "S"],
] as const

export function RotatingCrest({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="#5f321d"
      viewBox="0 0 1234.87 1195.94"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M380.79,708.19c.88,20.03,7.27,39.36,21.64,52.03,7.77,6.85,45.12-7.54,57.86-22.78,17.09,24.9,37.74,39.93,66.96,35.56-1.26-5.95-3.8-9.69-6.02-13.98-17.27-33.32,9.33-54.78,18.68-87.75,13.05-45.99-3.62-86.79-46.56-110.33,24.73-20.01,59.08-16.12,80.36,6.15,26.16,27.37,38.86,73.9,39.98,111.85,1.18,40.15,3.84,80.31-3.19,120.49-5.59,31.98-10.51,63.67-14.48,95.39,3.34,0,6.67-.11,10.01-.35,4.15-.82,8.25-1.82,12.31-2.98,5.3-36.82,12.82-72.83,23.19-106.92,17.12-56.33,40.06-109.08,65.27-162.44,37.9,14.27,76.21-.1,98.11-32.25,10.02-14.7,16.05-30.63,21.57-47.79,4.21-13.95,9.39-26.9,18.12-38.24,13.6-17.68,33.9-23.78,56.4-14.31-7-35.57-36.26-50.72-72.96-43.96.07-26.98-2.6-52.32-11.78-76.82-.94-3.24-4.15-6.72-7.99-5.32-25.04,9.17-48.63,21.12-68.66,40.03-11.42-26.71-34.45-46.47-63.28-49.08-8.96-.81-17.35-.4-24.39,4.41,1.18,2.42,3.89,4.56,6.45,5.86,24.1,12.3,33.03,38.96,22.43,63.85l-25.6,49.21c-26.13,50.22-19.9,103.28,29.95,133.92l-18.59,41.07-36.43,86.95c-.27-33.4,1.44-64.67-4.56-97.05-7.35-39.66-26.04-88.89-63.16-104.94-29.26-12.65-61.51-4.74-83.89,18.56-29.46-11.2-60.55-4.05-83.82,17.65-16.83,15.7-26.51,36.58-32.44,59.03-9.02,34.13-21.25,43.61-57.3,47.02,14.21,27.98,46,33.07,75.79,28.24Z" />
      <g className="crest-ring" style={{ transformOrigin: ringOrigin }}>
        <g fontFamily="MasqualeroStencil-Regular, 'Masqualero Stencil'" fontSize="156.35">
          {displayLetters.map(([transform, letter]) => (
            <text key={transform} transform={transform}>
              {letter}
            </text>
          ))}
        </g>
        <g fontFamily="SweetSansPro-Bold, 'Sweet Sans Pro'" fontSize="63.3" fontWeight="700">
          {smallLetters.map(([transform, letter]) => (
            <text key={transform} transform={transform}>
              {letter}
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}
