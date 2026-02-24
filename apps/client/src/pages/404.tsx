/**
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 * Adapted from "404 - Lost in Translation" by Ronan LE MEILLAT https://github.com/TEA-ching/404
 */

import { useEffect, useRef } from "react";

export interface PageNotFoundProps {
  /** URL shown in the GitHub corner */
  githubUrl?: string;
}

export const PageNotFound = ({ githubUrl = "https://github.com/TEA-ching/404" }: PageNotFoundProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const allTexts = Array.from(svg.querySelectorAll('text')) as SVGTextElement[];
    const otherTexts = allTexts.filter((t) => (t.textContent || '').trim() !== 'lost');
    const words = otherTexts.map((t) => (t.textContent || '').trim());

    function shuffle<T>(array: T[]) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    function estimateTextWidth(text: string | null, fontSize: number) {
      const avgCharWidth = fontSize * 0.6;
      return (text ? text.length : 0) * avgCharWidth;
    }

    function checkOverlap(text1: SVGTextElement, text2: SVGTextElement) {
      const x1 = parseFloat(text1.getAttribute('x') || '0');
      const y1 = parseFloat(text1.getAttribute('y') || '0');
      const fontSize1 = parseFloat(text1.getAttribute('font-size') || '12');
      const width1 = estimateTextWidth(text1.textContent, fontSize1);

      const x2 = parseFloat(text2.getAttribute('x') || '0');
      const y2 = parseFloat(text2.getAttribute('y') || '0');
      const fontSize2 = parseFloat(text2.getAttribute('font-size') || '12');
      const width2 = estimateTextWidth(text2.textContent, fontSize2);

      const verticalMargin = Math.max(fontSize1, fontSize2) * 0.5;
      if (Math.abs(y1 - y2) > verticalMargin) return false;

      const horizontalMargin = 5;
      return !(x1 + width1 + horizontalMargin < x2 || x2 + width2 + horizontalMargin < x1);
    }

    function adjustPosition(textElement: SVGTextElement, otherElements: SVGTextElement[], maxAttempts = 10) {
      let attempts = 0;
      let hasOverlap = true;

      while (hasOverlap && attempts < maxAttempts) {
        hasOverlap = false;

        for (const other of otherElements) {
          if (other === textElement) continue;

          if (checkOverlap(textElement, other)) {
            hasOverlap = true;

            const currentX = parseFloat(textElement.getAttribute('x') || '0');
            const currentY = parseFloat(textElement.getAttribute('y') || '0');
            const fontSize = parseFloat(textElement.getAttribute('font-size') || '12');
            const width = estimateTextWidth(textElement.textContent, fontSize);
            const otherX = parseFloat(other.getAttribute('x') || '0');
            const otherY = parseFloat(other.getAttribute('y') || '0');

            const deltaX = Math.abs(currentX - otherX);
            const deltaY = Math.abs(currentY - otherY);

            if (deltaX < deltaY) {
              if (currentX < otherX) {
                const newX = Math.max(10, currentX - width * 0.3);
                textElement.setAttribute('x', String(newX));
              } else {
                const newX = Math.min(1910 - width, currentX + width * 0.3);
                textElement.setAttribute('x', String(newX));
              }
            } else {
              if (currentY < otherY) {
                const newY = Math.max(fontSize + 10, currentY - fontSize * 0.5);
                textElement.setAttribute('y', String(newY));
              } else {
                const newY = Math.min(1070, currentY + fontSize * 0.5);
                textElement.setAttribute('y', String(newY));
              }
            }

            break;
          }
        }

        attempts++;
      }
    }

    const shuffledWords = shuffle(words);
    otherTexts.forEach((text, index) => {
      text.textContent = shuffledWords[index] || text.textContent;
    });

    otherTexts.forEach((text, index) => {
      const others = otherTexts.filter((_, i) => i !== index);
      adjustPosition(text, others);
    });
  }, []);

  return (
    <div className="page-404" role="main" aria-label="404 - Lost in Translation">
      <a
        href={githubUrl}
        className="github-corner"
        title="View source on GitHub"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
      >
        <svg viewBox="0 0 250 250" width="80" height="80" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            className="octo-arm"
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          />
        </svg>
      </a>

      <svg
        id="svg404"
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        aria-hidden="true"
      >
        <style type="text/css">{`text { font-family: Arial, Helvetica, sans-serif; }`}</style>
        <rect width="100%" height="100%" style={{ fill: 'black' }} />

        <text x="925" y="550" fontFamily="Arial" fontSize="60" fill="rgb(255,255,255)">lost</text>
        <text x="625" y="380" fontFamily="Arial" fontSize="14" fill="rgb(211,211,211)">perdu</text>
        <text x="665" y="414" fontFamily="Arial" fontSize="18" fill="rgb(169,169,169)">kadonnut</text>
        <text x="635" y="720" fontFamily="Arial" fontSize="24" fill="rgb(192,192,192)">verloren</text>
        <text x="893" y="690" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">потерянный</text>
        <text x="825" y="420" fontFamily="Arial" fontSize="12" fill="rgb(105,105,105)">失われた</text>
        <text x="825" y="660" fontFamily="Arial" fontSize="8" fill="rgb(169,169,169)">สูญหาย</text>
        <text x="785" y="483" fontFamily="Arial" fontSize="22" fill="rgb(211,211,211)">丢失</text>
        <text x="865" y="610" fontFamily="Arial" fontSize="10" fill="rgb(105,105,105)">잃어버린</text>
        <text x="755" y="370" fontFamily="Arial" fontSize="16" fill="rgb(192,192,192)">فقد</text>
        <text x="635" y="570" fontFamily="Arial" fontSize="18" fill="rgb(169,169,169)">אבד</text>
        <text x="957" y="420" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">χαμένος</text>
        <text x="445" y="510" fontFamily="Arial" fontSize="24" fill="rgb(105,105,105)">förlorade</text>
        <text x="745" y="680" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">tapt</text>
        <text x="915" y="440" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">tabt</text>
        <text x="935" y="380" fontFamily="Arial" fontSize="18" fill="rgb(211,211,211)">galduta</text>
        <text x="645" y="430" fontFamily="Arial" fontSize="12" fill="rgb(169,169,169)">elveszett</text>
        <text x="585" y="650" fontFamily="Arial" fontSize="20" fill="rgb(192,192,192)">missed</text>
        <text x="845" y="710" fontFamily="Arial" fontSize="10" fill="rgb(128,128,128)">изгубен</text>
        <text x="735" y="450" fontFamily="Arial" fontSize="14" fill="rgb(105,105,105)">खो गया</text>
        <text x="845" y="590" fontFamily="Arial" fontSize="22" fill="rgb(169,169,169)">शेर हो गया</text>
        <text x="685" y="535" fontFamily="Arial" fontSize="18" fill="rgb(211,211,211)">stracony</text>
        <text x="875" y="560" fontFamily="Arial" fontSize="10" fill="rgb(105,105,105)">borta</text>
        <text x="735" y="390" fontFamily="Arial" fontSize="16" fill="rgb(192,192,192)">kayboldu</text>
        <text x="685" y="610" fontFamily="Arial" fontSize="24" fill="rgb(169,169,169)">tévedt</text>
        <text x="875" y="490" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">vermisst</text>
        <text x="685" y="470" fontFamily="Arial" fontSize="24" fill="rgb(105,105,105)">perdido</text>
        <text x="945" y="630" fontFamily="Arial" fontSize="10" fill="rgb(192,192,192)">felizg</text>
        <text x="845" y="470" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">verloren</text>
        <text x="1125" y="400" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">disperso</text>
        <text x="1185" y="435" fontFamily="Arial" fontSize="20" fill="rgb(192,192,192)">ztracený</text>
        <text x="1075" y="470" fontFamily="Arial" fontSize="12" fill="rgb(105,105,105)">kadonnud</text>
        <text x="1255" y="505" fontFamily="Arial" fontSize="18" fill="rgb(211,211,211)">perdut</text>
        <text x="1095" y="540" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">загублений</text>
        <text x="1185" y="580" fontFamily="Arial" fontSize="22" fill="rgb(169,169,169)">perdido</text>
        <text x="1245" y="620" fontFamily="Arial" fontSize="10" fill="rgb(192,192,192)">pierdut</text>
        <text x="1125" y="660" fontFamily="Arial" fontSize="16" fill="rgb(128,128,128)">tapita</text>
        <text x="1205" y="695" fontFamily="Arial" fontSize="18" fill="rgb(105,105,105)">zudis</text>
        <text x="1075" y="725" fontFamily="Arial" fontSize="14" fill="rgb(211,211,211)">paveldėti</text>
        <text x="1105" y="505" fontFamily="Arial" fontSize="24" fill="rgb(169,169,169)">사라진</text>
        <text x="1265" y="550" fontFamily="Arial" fontSize="12" fill="rgb(105,105,105)">失った</text>
        <text x="1150" y="715" fontFamily="Arial" fontSize="20" fill="rgb(192,192,192)">hilang</text>
        <text x="1235" y="460" fontFamily="Arial" fontSize="16" fill="rgb(128,128,128)">tappato</text>
        <text x="1275" y="680" fontFamily="Arial" fontSize="14" fill="rgb(169,169,169)">നഷ്ടപ്പെട്ടു</text>
        <text x="50" y="80" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">пропавший</text>
        <text x="1800" y="120" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">消失した</text>
        <text x="80" y="950" fontFamily="Arial" fontSize="20" fill="rgb(169,169,169)">desaparecido</text>
        <text x="1650" y="150" fontFamily="Arial" fontSize="16" fill="rgb(211,211,211)">消えた</text>
        <text x="120" y="1020" fontFamily="Arial" fontSize="12" fill="rgb(105,105,105)">spărit</text>
        <text x="1750" y="1000" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">пропащий</text>
        <text x="30" y="500" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">zagubiony</text>
        <text x="1850" y="520" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">zablúdený</text>
        <text x="450" y="1050" fontFamily="Arial" fontSize="20" fill="rgb(211,211,211)">extraviado</text>
        <text x="1600" y="1050" fontFamily="Arial" fontSize="14" fill="rgb(105,105,105)">kayıp</text>
        <text x="1100" y="1040" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">perduto</text>
        <text x="900" y="1060" fontFamily="Arial" fontSize="16" fill="rgb(128,128,128)">izmidzis</text>
        <text x="40" y="350" fontFamily="Arial" fontSize="22" fill="rgb(169,169,169)">пропаднал</text>
        <text x="1860" y="250" fontFamily="Arial" fontSize="12" fill="rgb(211,211,211)">დაკარგული</text>
        <text x="1550" y="80" fontFamily="Arial" fontSize="20" fill="rgb(105,105,105)">կորած</text>
        <text x="600" y="80" fontFamily="Arial" fontSize="14" fill="rgb(192,192,192)">жоғалған</text>
        <text x="150" y="180" fontFamily="Arial" fontSize="18" fill="rgb(128,128,128)">verlore</text>
        <text x="1830" y="780" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">caduto</text>
        <text x="250" y="1060" fontFamily="Arial" fontSize="14" fill="rgb(211,211,211)">difuminat</text>
        <text x="1350" y="1060" fontFamily="Arial" fontSize="18" fill="rgb(105,105,105)">faillí</text>
        <text x="750" y="1060" fontFamily="Arial" fontSize="12" fill="rgb(192,192,192)">hävinnyt</text>
        <text x="1700" y="60" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">perdida</text>
        <text x="400" y="100" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">izgubljen</text>
        <text x="60" y="700" fontFamily="Arial" fontSize="14" fill="rgb(211,211,211)">απολεσθέν</text>
        <text x="1840" y="650" fontFamily="Arial" fontSize="18" fill="rgb(105,105,105)">তলাশা</text>
        <text x="200" y="60" fontFamily="Arial" fontSize="16" fill="rgb(192,192,192)">elveszett</text>
        <text x="300" y="200" fontFamily="Arial" fontSize="16" fill="rgb(192,192,192)">perso</text>
        <text x="1520" y="250" fontFamily="Arial" fontSize="18" fill="rgb(169,169,169)">χαμένο</text>
        <text x="250" y="450" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">ضاع</text>
        <text x="1600" y="480" fontFamily="Arial" fontSize="20" fill="rgb(211,211,211)">kaybolmuş</text>
        <text x="350" y="850" fontFamily="Arial" fontSize="16" fill="rgb(105,105,105)">失われる</text>
        <text x="1450" y="820" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">שאבד</text>
        <text x="200" y="650" fontFamily="Arial" fontSize="12" fill="rgb(128,128,128)">perdu</text>
        <text x="1550" y="650" fontFamily="Arial" fontSize="14" fill="rgb(169,169,169)">förlust</text>
        <text x="380" y="300" fontFamily="Arial" fontSize="20" fill="rgb(211,211,211)">kaybetti</text>
        <text x="1420" y="350" fontFamily="Arial" fontSize="16" fill="rgb(105,105,105)">caillte</text>
        <text x="280" y="750" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">smarrito</text>
        <text x="1500" y="720" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">kadonneena</text>
        <text x="450" y="250" fontFamily="Arial" fontSize="12" fill="rgb(169,169,169)">rătăcit</text>
        <text x="1380" y="280" fontFamily="Arial" fontSize="16" fill="rgb(211,211,211)">desaparegut</text>
        <text x="320" y="550" fontFamily="Arial" fontSize="20" fill="rgb(105,105,105)">загубљен</text>
        <text x="1480" y="580" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">жоғалды</text>
        <text x="420" y="750" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">անհետացել</text>
        <text x="1400" y="750" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">হারিয়ে</text>
        <text x="250" y="280" fontFamily="Arial" fontSize="18" fill="rgb(211,211,211)">утерянный</text>
        <text x="1580" y="200" fontFamily="Arial" fontSize="14" fill="rgb(105,105,105)">行方不明</text>
        <text x="180" y="550" fontFamily="Arial" fontSize="16" fill="rgb(192,192,192)">stratený</text>
        <text x="1650" y="550" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">ausente</text>
        <text x="400" y="180" fontFamily="Arial" fontSize="12" fill="rgb(169,169,169)">исчезнувший</text>
        <text x="1450" y="180" fontFamily="Arial" fontSize="18" fill="rgb(211,211,211)">elhagyott</text>
        <text x="220" y="850" fontFamily="Arial" fontSize="14" fill="rgb(105,105,105)">rozptýlený</text>
        <text x="1620" y="880" fontFamily="Arial" fontSize="16" fill="rgb(192,192,192)">ztratil</text>
        <text x="480" y="880" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">katonut</text>
        <text x="1350" y="150" fontFamily="Arial" fontSize="14" fill="rgb(169,169,169)">desapareguda</text>
        <text x="150" y="380" fontFamily="Arial" fontSize="18" fill="rgb(211,211,211)">втрачений</text>
        <text x="1700" y="400" fontFamily="Arial" fontSize="16" fill="rgb(105,105,105)">dispărut</text>
        <text x="350" y="950" fontFamily="Arial" fontSize="12" fill="rgb(192,192,192)">umepotea</text>
        <text x="1480" y="920" fontFamily="Arial" fontSize="18" fill="rgb(128,128,128)">pazudis</text>
        <text x="520" y="200" fontFamily="Arial" fontSize="20" fill="rgb(169,169,169)">dingo</text>
        <text x="1320" y="900" fontFamily="Arial" fontSize="14" fill="rgb(211,211,211)">길잃은</text>
        <text x="180" y="240" fontFamily="Arial" fontSize="16" fill="rgb(105,105,105)">紛失</text>
        <text x="1680" y="320" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">kehilangan</text>
        <text x="280" y="950" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">mitiet</text>
        <text x="1580" y="780" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">extraño</text>
        <text x="420" y="350" fontFamily="Arial" fontSize="20" fill="rgb(211,211,211)">χαμένο</text>
        <text x="1450" y="450" fontFamily="Arial" fontSize="12" fill="rgb(105,105,105)">נעלם</text>
        <text x="700" y="250" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">затерянный</text>
        <text x="950" y="280" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">desvanecido</text>
        <text x="1150" y="260" fontFamily="Arial" fontSize="14" fill="rgb(128,128,128)">kaybolan</text>
        <text x="600" y="820" fontFamily="Arial" fontSize="20" fill="rgb(211,211,211)">verschwunden</text>
        <text x="850" y="850" fontFamily="Arial" fontSize="16" fill="rgb(105,105,105)">sparito</text>
        <text x="1100" y="830" fontFamily="Arial" fontSize="18" fill="rgb(192,192,192)">消逝</text>
        <text x="750" y="210" fontFamily="Arial" fontSize="12" fill="rgb(128,128,128)">norimet</text>
        <text x="1050" y="220" fontFamily="Arial" fontSize="14" fill="rgb(169,169,169)">égaré</text>
        <text x="650" y="880" fontFamily="Arial" fontSize="16" fill="rgb(211,211,211)">eltűnt</text>
        <text x="1000" y="900" fontFamily="Arial" fontSize="18" fill="rgb(105,105,105)">消える</text>
        <text x="1200" y="870" fontFamily="Arial" fontSize="14" fill="rgb(192,192,192)">zaginiony</text>
        <text x="800" y="240" fontFamily="Arial" fontSize="20" fill="rgb(128,128,128)">пропал</text>
        <text x="900" y="110" fontFamily="Arial" fontSize="16" fill="rgb(169,169,169)">absens</text>
        <text x="1100" y="240" fontFamily="Arial" fontSize="12" fill="rgb(211,211,211)">ضائع</text>
        <text x="700" y="890" fontFamily="Arial" fontSize="18" fill="rgb(105,105,105)">zâmbit</text>
        <text x="950" y="920" fontFamily="Arial" fontSize="14" fill="rgb(192,192,192)">пропало</text>
        <text x="1150" y="900" fontFamily="Arial" fontSize="16" fill="rgb(128,128,128)">കളഞ്ഞു</text>
        <text x="650" y="230" fontFamily="Arial" fontSize="14" fill="rgb(169,169,169)">dingęs</text>
        <text x="1000" y="260" fontFamily="Arial" fontSize="20" fill="rgb(211,211,211)">försvunnen</text>
        <text x="750" y="870" fontFamily="Arial" fontSize="16" fill="rgb(105,105,105)">егарь</text>
        <text x="850" y="220" fontFamily="Arial" fontSize="12" fill="rgb(192,192,192)">изчезнал</text>
        <text x="1050" y="890" fontFamily="Arial" fontSize="18" fill="rgb(128,128,128)">સ્વાહા</text>
      </svg>

      <style>{`
        .page-404 {
          background-color: black;
          margin: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        #svg404 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 100vw;
          min-height: 100vh;
          width: auto;
          height: auto;
        }

        .github-corner {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 99;
          border: 0;
        }

        .github-corner svg { fill: #5d5d59; color: #fff; }
        .github-corner .octo-arm { transform-origin: 130px 106px; }
        .github-corner:hover .octo-arm { animation: octocat-wave 560ms ease-in-out; }
        @keyframes octocat-wave { 0%,100%{transform:rotate(0);}20%,60%{transform:rotate(-25deg);}40%,80%{transform:rotate(10deg);} }
        @media (max-width:500px){ .github-corner:hover .octo-arm{ animation:none;} .github-corner .octo-arm{ animation: octocat-wave 560ms ease-in-out;} }
      `}</style>
    </div>
  );
};

