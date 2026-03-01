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

export const PageNotFound = ({
  githubUrl = "https://github.com/TEA-ching/404",
}: PageNotFoundProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    const allTexts = Array.from(
      svg.querySelectorAll("text"),
    ) as SVGTextElement[];
    const otherTexts = allTexts.filter(
      (t) => (t.textContent || "").trim() !== "lost",
    );
    const words = otherTexts.map((t) => (t.textContent || "").trim());

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
      const x1 = parseFloat(text1.getAttribute("x") || "0");
      const y1 = parseFloat(text1.getAttribute("y") || "0");
      const fontSize1 = parseFloat(text1.getAttribute("font-size") || "12");
      const width1 = estimateTextWidth(text1.textContent, fontSize1);

      const x2 = parseFloat(text2.getAttribute("x") || "0");
      const y2 = parseFloat(text2.getAttribute("y") || "0");
      const fontSize2 = parseFloat(text2.getAttribute("font-size") || "12");
      const width2 = estimateTextWidth(text2.textContent, fontSize2);

      const verticalMargin = Math.max(fontSize1, fontSize2) * 0.5;

      if (Math.abs(y1 - y2) > verticalMargin) return false;

      const horizontalMargin = 5;

      return !(
        x1 + width1 + horizontalMargin < x2 ||
        x2 + width2 + horizontalMargin < x1
      );
    }

    function adjustPosition(
      textElement: SVGTextElement,
      otherElements: SVGTextElement[],
      maxAttempts = 10,
    ) {
      let attempts = 0;
      let hasOverlap = true;

      while (hasOverlap && attempts < maxAttempts) {
        hasOverlap = false;

        for (const other of otherElements) {
          if (other === textElement) continue;

          if (checkOverlap(textElement, other)) {
            hasOverlap = true;

            const currentX = parseFloat(textElement.getAttribute("x") || "0");
            const currentY = parseFloat(textElement.getAttribute("y") || "0");
            const fontSize = parseFloat(
              textElement.getAttribute("font-size") || "12",
            );
            const width = estimateTextWidth(textElement.textContent, fontSize);
            const otherX = parseFloat(other.getAttribute("x") || "0");
            const otherY = parseFloat(other.getAttribute("y") || "0");

            const deltaX = Math.abs(currentX - otherX);
            const deltaY = Math.abs(currentY - otherY);

            if (deltaX < deltaY) {
              if (currentX < otherX) {
                const newX = Math.max(10, currentX - width * 0.3);

                textElement.setAttribute("x", String(newX));
              } else {
                const newX = Math.min(1910 - width, currentX + width * 0.3);

                textElement.setAttribute("x", String(newX));
              }
            } else {
              if (currentY < otherY) {
                const newY = Math.max(fontSize + 10, currentY - fontSize * 0.5);

                textElement.setAttribute("y", String(newY));
              } else {
                const newY = Math.min(1070, currentY + fontSize * 0.5);

                textElement.setAttribute("y", String(newY));
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
    <div
      aria-label="404 - Lost in Translation"
      className="page-404"
      role="main"
    >
      <a
        aria-label="View source on GitHub"
        className="github-corner"
        href={githubUrl}
        rel="noopener noreferrer"
        target="_blank"
        title="View source on GitHub"
      >
        <svg aria-hidden="true" height="80" viewBox="0 0 250 250" width="80">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            className="octo-arm"
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
          />
          <path
            className="octo-body"
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <svg
        ref={svgRef}
        aria-hidden="true"
        id="svg404"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style type="text/css">{`text { font-family: Arial, Helvetica, sans-serif; }`}</style>
        <rect height="100%" style={{ fill: "black" }} width="100%" />

        <text
          fill="rgb(255,255,255)"
          fontFamily="Arial"
          fontSize="60"
          x="925"
          y="550"
        >
          lost
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="14"
          x="625"
          y="380"
        >
          perdu
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="18"
          x="665"
          y="414"
        >
          kadonnut
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="24"
          x="635"
          y="720"
        >
          verloren
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="893"
          y="690"
        >
          потерянный
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="12"
          x="825"
          y="420"
        >
          失われた
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="8"
          x="825"
          y="660"
        >
          สูญหาย
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="22"
          x="785"
          y="483"
        >
          丢失
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="10"
          x="865"
          y="610"
        >
          잃어버린
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="16"
          x="755"
          y="370"
        >
          فقد
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="18"
          x="635"
          y="570"
        >
          אבד
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="957"
          y="420"
        >
          χαμένος
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="24"
          x="445"
          y="510"
        >
          förlorade
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="745"
          y="680"
        >
          tapt
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="915"
          y="440"
        >
          tabt
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="18"
          x="935"
          y="380"
        >
          galduta
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="12"
          x="645"
          y="430"
        >
          elveszett
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="20"
          x="585"
          y="650"
        >
          missed
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="10"
          x="845"
          y="710"
        >
          изгубен
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="14"
          x="735"
          y="450"
        >
          खो गया
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="22"
          x="845"
          y="590"
        >
          शेर हो गया
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="18"
          x="685"
          y="535"
        >
          stracony
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="10"
          x="875"
          y="560"
        >
          borta
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="16"
          x="735"
          y="390"
        >
          kayboldu
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="24"
          x="685"
          y="610"
        >
          tévedt
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="875"
          y="490"
        >
          vermisst
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="24"
          x="685"
          y="470"
        >
          perdido
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="10"
          x="945"
          y="630"
        >
          felizg
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="845"
          y="470"
        >
          verloren
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="1125"
          y="400"
        >
          disperso
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="20"
          x="1185"
          y="435"
        >
          ztracený
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="12"
          x="1075"
          y="470"
        >
          kadonnud
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="18"
          x="1255"
          y="505"
        >
          perdut
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="1095"
          y="540"
        >
          загублений
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="22"
          x="1185"
          y="580"
        >
          perdido
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="10"
          x="1245"
          y="620"
        >
          pierdut
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="16"
          x="1125"
          y="660"
        >
          tapita
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="18"
          x="1205"
          y="695"
        >
          zudis
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="14"
          x="1075"
          y="725"
        >
          paveldėti
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="24"
          x="1105"
          y="505"
        >
          사라진
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="12"
          x="1265"
          y="550"
        >
          失った
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="20"
          x="1150"
          y="715"
        >
          hilang
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="16"
          x="1235"
          y="460"
        >
          tappato
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="14"
          x="1275"
          y="680"
        >
          നഷ്ടപ്പെട്ടു
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="50"
          y="80"
        >
          пропавший
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="1800"
          y="120"
        >
          消失した
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="20"
          x="80"
          y="950"
        >
          desaparecido
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="16"
          x="1650"
          y="150"
        >
          消えた
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="12"
          x="120"
          y="1020"
        >
          spărit
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="1750"
          y="1000"
        >
          пропащий
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="30"
          y="500"
        >
          zagubiony
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="1850"
          y="520"
        >
          zablúdený
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="20"
          x="450"
          y="1050"
        >
          extraviado
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="14"
          x="1600"
          y="1050"
        >
          kayıp
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="1100"
          y="1040"
        >
          perduto
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="16"
          x="900"
          y="1060"
        >
          izmidzis
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="22"
          x="40"
          y="350"
        >
          пропаднал
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="12"
          x="1860"
          y="250"
        >
          დაკარგული
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="20"
          x="1550"
          y="80"
        >
          կորած
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="14"
          x="600"
          y="80"
        >
          жоғалған
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="18"
          x="150"
          y="180"
        >
          verlore
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="1830"
          y="780"
        >
          caduto
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="14"
          x="250"
          y="1060"
        >
          difuminat
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="18"
          x="1350"
          y="1060"
        >
          faillí
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="12"
          x="750"
          y="1060"
        >
          hävinnyt
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="1700"
          y="60"
        >
          perdida
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="400"
          y="100"
        >
          izgubljen
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="14"
          x="60"
          y="700"
        >
          απολεσθέν
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="18"
          x="1840"
          y="650"
        >
          তলাশা
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="16"
          x="200"
          y="60"
        >
          elveszett
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="16"
          x="300"
          y="200"
        >
          perso
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="18"
          x="1520"
          y="250"
        >
          χαμένο
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="250"
          y="450"
        >
          ضاع
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="20"
          x="1600"
          y="480"
        >
          kaybolmuş
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="16"
          x="350"
          y="850"
        >
          失われる
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="1450"
          y="820"
        >
          שאבד
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="12"
          x="200"
          y="650"
        >
          perdu
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="14"
          x="1550"
          y="650"
        >
          förlust
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="20"
          x="380"
          y="300"
        >
          kaybetti
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="16"
          x="1420"
          y="350"
        >
          caillte
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="280"
          y="750"
        >
          smarrito
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="1500"
          y="720"
        >
          kadonneena
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="12"
          x="450"
          y="250"
        >
          rătăcit
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="16"
          x="1380"
          y="280"
        >
          desaparegut
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="20"
          x="320"
          y="550"
        >
          загубљен
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="1480"
          y="580"
        >
          жоғалды
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="420"
          y="750"
        >
          անհետացել
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="1400"
          y="750"
        >
          হারিয়ে
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="18"
          x="250"
          y="280"
        >
          утерянный
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="14"
          x="1580"
          y="200"
        >
          行方不明
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="16"
          x="180"
          y="550"
        >
          stratený
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="1650"
          y="550"
        >
          ausente
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="12"
          x="400"
          y="180"
        >
          исчезнувший
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="18"
          x="1450"
          y="180"
        >
          elhagyott
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="14"
          x="220"
          y="850"
        >
          rozptýlený
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="16"
          x="1620"
          y="880"
        >
          ztratil
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="480"
          y="880"
        >
          katonut
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="14"
          x="1350"
          y="150"
        >
          desapareguda
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="18"
          x="150"
          y="380"
        >
          втрачений
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="16"
          x="1700"
          y="400"
        >
          dispărut
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="12"
          x="350"
          y="950"
        >
          umepotea
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="18"
          x="1480"
          y="920"
        >
          pazudis
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="20"
          x="520"
          y="200"
        >
          dingo
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="14"
          x="1320"
          y="900"
        >
          길잃은
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="16"
          x="180"
          y="240"
        >
          紛失
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="1680"
          y="320"
        >
          kehilangan
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="280"
          y="950"
        >
          mitiet
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="1580"
          y="780"
        >
          extraño
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="20"
          x="420"
          y="350"
        >
          χαμένο
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="12"
          x="1450"
          y="450"
        >
          נעלם
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="700"
          y="250"
        >
          затерянный
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="950"
          y="280"
        >
          desvanecido
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="14"
          x="1150"
          y="260"
        >
          kaybolan
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="20"
          x="600"
          y="820"
        >
          verschwunden
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="16"
          x="850"
          y="850"
        >
          sparito
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="18"
          x="1100"
          y="830"
        >
          消逝
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="12"
          x="750"
          y="210"
        >
          norimet
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="14"
          x="1050"
          y="220"
        >
          égaré
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="16"
          x="650"
          y="880"
        >
          eltűnt
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="18"
          x="1000"
          y="900"
        >
          消える
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="14"
          x="1200"
          y="870"
        >
          zaginiony
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="20"
          x="800"
          y="240"
        >
          пропал
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="16"
          x="900"
          y="110"
        >
          absens
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="12"
          x="1100"
          y="240"
        >
          ضائع
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="18"
          x="700"
          y="890"
        >
          zâmbit
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="14"
          x="950"
          y="920"
        >
          пропало
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="16"
          x="1150"
          y="900"
        >
          കളഞ്ഞു
        </text>
        <text
          fill="rgb(169,169,169)"
          fontFamily="Arial"
          fontSize="14"
          x="650"
          y="230"
        >
          dingęs
        </text>
        <text
          fill="rgb(211,211,211)"
          fontFamily="Arial"
          fontSize="20"
          x="1000"
          y="260"
        >
          försvunnen
        </text>
        <text
          fill="rgb(105,105,105)"
          fontFamily="Arial"
          fontSize="16"
          x="750"
          y="870"
        >
          егарь
        </text>
        <text
          fill="rgb(192,192,192)"
          fontFamily="Arial"
          fontSize="12"
          x="850"
          y="220"
        >
          изчезнал
        </text>
        <text
          fill="rgb(128,128,128)"
          fontFamily="Arial"
          fontSize="18"
          x="1050"
          y="890"
        >
          સ્વાહા
        </text>
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
