<!DOCTYPE html>
<!--
    404 - Lost in Translation
    (c) 2025 - Ronan Le Meillat - SCTG Development
    
    MIT License
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
-->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<html lang="en">

<head>
    <title>404 - Not Found</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description"
        content="A creative 404 error page with 'lost' translated into 130+ languages. Interactive word cloud with randomized translations, GitHub integration, and MIT license. Perfect for demonstrating web development concepts.">
    <meta name="keywords"
        content="404 page, lost in translation, multilingual, interactive, creative error page, web development">
    <meta name="author" content="Ronan Le Meillat - SCTG Development">
    <meta name="license" content="https://raw.githubusercontent.com/TEA-ching/404/main/LICENSE.md">

    <!-- Open Graph Meta Tags for Social Sharing -->
    <meta property="og:title" content="404 - Lost in Translation">
    <meta property="og:description" content="A creative 404 error page with 'lost' translated into 130+ languages.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://tea-ching.github.io/404/">
    <meta property="og:site_name" content="Lost in Translation 404 Page">

    <!-- JSON-LD Structured Data for SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "404 - Lost in Translation",
      "description": "A creative 404 error page with 'lost' translated into 130+ languages. An interactive word cloud project showcasing web development concepts including JavaScript DOM manipulation, CSS animations, collision detection algorithms, and responsive design.",
      "url": "https://tea-ching.github.io/404/",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://tea-ching.github.io/404/"
      },
      "mainEntity": {
        "@type": "SoftwareApplication",
        "@id": "https://github.com/TEA-ching/404",
        "name": "404 - Lost in Translation",
        "description": "Creative 404 error page with multilingual word cloud and interactive features",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "license": "https://raw.githubusercontent.com/TEA-ching/404/main/LICENSE.md",
        "softwareVersion": "1.0.0",
        "author": {
          "@type": "Person",
          "name": "Ronan Le Meillat",
          "url": "https://github.com/TEA-ching"
        },
        "codeRepository": "https://github.com/TEA-ching/404",
        "downloadUrl": "https://github.com/TEA-ching/404/releases/download/last/404-page.zip",
        "image": {
          "@type": "ImageObject",
          "url": "https://github.com/TEA-ching/404/raw/main/index.html",
          "description": "404 - Lost in Translation interactive webpage"
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "SCTG Development",
        "url": "https://github.com/TEA-ching"
      },
      "copyrightYear": 2025,
      "copyrightHolder": {
        "@type": "Person",
        "name": "Ronan Le Meillat"
      },
      "inLanguage": ["en", "fr", "es", "de", "it", "pt", "ru", "ja", "zh", "ko", "ar", "he", "hi", "th", "and 120+ more"],
      "keywords": "404 page, lost in translation, multilingual, interactive, creative error page, web development, JavaScript, CSS, SVG, collision detection",
      "educationalLevel": "HighSchool/UniversityLevel",
      "teaches": [
        "DOM Manipulation",
        "CSS Animation",
        "JavaScript Algorithms",
        "Collision Detection",
        "Responsive Web Design",
        "GitHub Actions",
        "Multilingual Content"
      ],
      "datePublished": "2025-01-01",
      "dateModified": "2025-10-25"
    }
    </script>

    <!-- JSON-LD for Creative Work (Educational Content) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "404 - Lost in Translation",
      "description": "An educational creative coding project demonstrating web development fundamentals",
      "author": {
        "@type": "Person",
        "name": "Ronan Le Meillat"
      },
      "license": "https://raw.githubusercontent.com/TEA-ching/404/main/LICENSE.md",
      "url": "https://github.com/TEA-ching/404",
      "isBasedOn": {
        "@type": "CreativeWork",
        "name": "404 Error Page Concept",
        "description": "Interactive error page showcasing multilingual content and creative design"
      },
      "dateCreated": "2025-01-01",
      "dateModified": "2025-10-25",
      "inLanguage": "en",
      "spatialCoverage": {
        "@type": "Place",
        "name": "Global - 130+ Languages"
      }
    }
    </script>

    <style>
        /* 
         * Body Styling
         * Sets up a full-screen black background with flexbox centering
         */
        body {
            background-color: black;
            /* Black background for the page */
            margin: 0;
            /* Remove default browser margins */
            height: 100vh;
            /* 100% of viewport height */
            width: 100vw;
            /* 100% of viewport width */
            overflow: hidden;
            /* Hide scrollbars */
            display: flex;
            /* Use flexbox layout */
            align-items: center;
            /* Center vertically */
            justify-content: center;
            /* Center horizontally */
        }

        /* 
         * SVG 404 Positioning
         * Centers the SVG and makes it fill the entire viewport
         * while maintaining aspect ratio
         */
        #svg404 {
            position: absolute;
            /* Position relative to viewport */
            top: 50%;
            /* Start at 50% from top */
            left: 50%;
            /* Start at 50% from left */
            transform: translate(-50%, -50%);
            /* Shift back by 50% to center */
            min-width: 100vw;
            /* Minimum width = viewport width */
            min-height: 100vh;
            /* Minimum height = viewport height */
            width: auto;
            /* Auto width for aspect ratio */
            height: auto;
            /* Auto height for aspect ratio */
        }

        /* 
         * GitHub Corner Styles
         * Creates a clickable GitHub logo in the top-right corner
         */
        .github-corner {
            position: absolute;
            /* Position relative to viewport */
            top: 0;
            /* Align to top edge */
            border: 0;
            /* Remove border */
            right: 0;
            /* Align to right edge */
            z-index: 99;
            /* Ensure it stays on top */
        }

        /* SVG colors for the GitHub corner */
        .github-corner svg {
            fill: #5d5d59;
            /* Gray fill for background shape */
            color: #fff;
            /* White color for Octocat */
        }

        /* 
         * Octocat Arm Animation Setup
         * Sets the pivot point for the waving animation
         */
        .github-corner .octo-arm {
            transform-origin: 130px 106px;
            /* Rotation pivot point (shoulder) */
        }

        /* 
         * Hover Effect
         * Makes the Octocat wave when you hover over it
         */
        .github-corner:hover .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
            /* Apply wave animation */
        }

        /* 
         * Wave Animation Keyframes
         * Defines the waving motion of the Octocat's arm
         */
        @keyframes octocat-wave {

            0%,
            100% {
                transform: rotate(0);
                /* Start and end: no rotation */
            }

            20%,
            60% {
                transform: rotate(-25deg);
                /* Wave down: rotate -25 degrees */
            }

            40%,
            80% {
                transform: rotate(10deg);
                /* Wave up: rotate +10 degrees */
            }
        }

        /* 
         * Mobile Optimization
         * On small screens, animate automatically instead of on hover
         * (since mobile devices don't have hover states)
         */
        @media (max-width: 500px) {
            .github-corner:hover .octo-arm {
                animation: none;
                /* Disable hover animation */
            }

            .github-corner .octo-arm {
                animation: octocat-wave 560ms ease-in-out;
                /* Always animate */
            }
        }
    </style>
</head>

<body>
    <!-- GitHub Corner -->
    <a href="https://github.com/TEA-ching/404" class="github-corner" title="View source on GitHub" target="_blank"
        rel="noopener noreferrer" aria-label="View source on GitHub">
        <svg viewBox="0 0 250 250" width="80" height="80" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
            <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor" class="octo-arm" />
            <path
                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                fill="currentColor" class="octo-body" />
        </svg>
    </a>

    <svg id="svg404" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
        <style type="text/css">
            text {
                font-family: Arial, Helvetica, sans-serif;
            }
        </style>
        <rect width="100%" height="100%" style="fill:black" />

        <text x="925" y="550" font-family="Arial" font-size="60" fill="rgb(255,255,255)">lost</text>
        <text x="625" y="380" font-family="Arial" font-size="14" fill="rgb(211,211,211)">perdu</text>
        <text x="665" y="414" font-family="Arial" font-size="18" fill="rgb(169,169,169)">kadonnut</text>
        <text x="635" y="720" font-family="Arial" font-size="24" fill="rgb(192,192,192)">verloren</text>
        <text x="893" y="690" font-family="Arial" font-size="20" fill="rgb(128,128,128)">потерянный</text>
        <text x="825" y="420" font-family="Arial" font-size="12" fill="rgb(105,105,105)">失われた</text>
        <text x="825" y="660" font-family="Arial" font-size="8" fill="rgb(169,169,169)">สูญหาย</text>
        <text x="785" y="483" font-family="Arial" font-size="22" fill="rgb(211,211,211)">丢失</text>
        <text x="865" y="610" font-family="Arial" font-size="10" fill="rgb(105,105,105)">잃어버린</text>
        <text x="755" y="370" font-family="Arial" font-size="16" fill="rgb(192,192,192)">فقد</text>
        <text x="635" y="570" font-family="Arial" font-size="18" fill="rgb(169,169,169)">אבד</text>
        <text x="957" y="420" font-family="Arial" font-size="20" fill="rgb(128,128,128)">χαμένος</text>
        <text x="445" y="510" font-family="Arial" font-size="24" fill="rgb(105,105,105)">förlorade</text>
        <text x="745" y="680" font-family="Arial" font-size="18" fill="rgb(192,192,192)">tapt</text>
        <text x="915" y="440" font-family="Arial" font-size="14" fill="rgb(128,128,128)">tabt</text>
        <text x="935" y="380" font-family="Arial" font-size="18" fill="rgb(211,211,211)">galduta</text>
        <text x="645" y="430" font-family="Arial" font-size="12" fill="rgb(169,169,169)">elveszett</text>
        <text x="585" y="650" font-family="Arial" font-size="20" fill="rgb(192,192,192)">missed</text>
        <text x="845" y="710" font-family="Arial" font-size="10" fill="rgb(128,128,128)">изгубен</text>
        <text x="735" y="450" font-family="Arial" font-size="14" fill="rgb(105,105,105)">खो गया</text>
        <text x="845" y="590" font-family="Arial" font-size="22" fill="rgb(169,169,169)">शेर हो गया</text>
        <text x="685" y="535" font-family="Arial" font-size="18" fill="rgb(211,211,211)">stracony</text>
        <text x="875" y="560" font-family="Arial" font-size="10" fill="rgb(105,105,105)">borta</text>
        <text x="735" y="390" font-family="Arial" font-size="16" fill="rgb(192,192,192)">kayboldu</text>
        <text x="685" y="610" font-family="Arial" font-size="24" fill="rgb(169,169,169)">tévedt</text>
        <text x="875" y="490" font-family="Arial" font-size="20" fill="rgb(128,128,128)">vermisst</text>
        <text x="685" y="470" font-family="Arial" font-size="24" fill="rgb(105,105,105)">perdido</text>
        <text x="945" y="630" font-family="Arial" font-size="10" fill="rgb(192,192,192)">felizg</text>
        <text x="845" y="470" font-family="Arial" font-size="14" fill="rgb(128,128,128)">verloren</text>
        <text x="1125" y="400" font-family="Arial" font-size="16" fill="rgb(169,169,169)">disperso</text>
        <text x="1185" y="435" font-family="Arial" font-size="20" fill="rgb(192,192,192)">ztracený</text>
        <text x="1075" y="470" font-family="Arial" font-size="12" fill="rgb(105,105,105)">kadonnud</text>
        <text x="1255" y="505" font-family="Arial" font-size="18" fill="rgb(211,211,211)">perdut</text>
        <text x="1095" y="540" font-family="Arial" font-size="14" fill="rgb(128,128,128)">загублений</text>
        <text x="1185" y="580" font-family="Arial" font-size="22" fill="rgb(169,169,169)">perdido</text>
        <text x="1245" y="620" font-family="Arial" font-size="10" fill="rgb(192,192,192)">pierdut</text>
        <text x="1125" y="660" font-family="Arial" font-size="16" fill="rgb(128,128,128)">tapita</text>
        <text x="1205" y="695" font-family="Arial" font-size="18" fill="rgb(105,105,105)">zudis</text>
        <text x="1075" y="725" font-family="Arial" font-size="14" fill="rgb(211,211,211)">paveldėti</text>
        <text x="1105" y="505" font-family="Arial" font-size="24" fill="rgb(169,169,169)">사라진</text>
        <text x="1265" y="550" font-family="Arial" font-size="12" fill="rgb(105,105,105)">失った</text>
        <text x="1150" y="715" font-family="Arial" font-size="20" fill="rgb(192,192,192)">hilang</text>
        <text x="1235" y="460" font-family="Arial" font-size="16" fill="rgb(128,128,128)">tappato</text>
        <text x="1275" y="680" font-family="Arial" font-size="14" fill="rgb(169,169,169)">നഷ്ടപ്പെട്ടു</text>
        <text x="50" y="80" font-family="Arial" font-size="18" fill="rgb(192,192,192)">пропавший</text>
        <text x="1800" y="120" font-family="Arial" font-size="14" fill="rgb(128,128,128)">消失した</text>
        <text x="80" y="950" font-family="Arial" font-size="20" fill="rgb(169,169,169)">desaparecido</text>
        <text x="1650" y="150" font-family="Arial" font-size="16" fill="rgb(211,211,211)">消えた</text>
        <text x="120" y="1020" font-family="Arial" font-size="12" fill="rgb(105,105,105)">spărit</text>
        <text x="1750" y="1000" font-family="Arial" font-size="18" fill="rgb(192,192,192)">пропащий</text>
        <text x="30" y="500" font-family="Arial" font-size="14" fill="rgb(128,128,128)">zagubiony</text>
        <text x="1850" y="520" font-family="Arial" font-size="16" fill="rgb(169,169,169)">zablúdený</text>
        <text x="450" y="1050" font-family="Arial" font-size="20" fill="rgb(211,211,211)">extraviado</text>
        <text x="1600" y="1050" font-family="Arial" font-size="14" fill="rgb(105,105,105)">kayıp</text>
        <text x="1100" y="1040" font-family="Arial" font-size="18" fill="rgb(192,192,192)">perduto</text>
        <text x="900" y="1060" font-family="Arial" font-size="16" fill="rgb(128,128,128)">izmidzis</text>
        <text x="40" y="350" font-family="Arial" font-size="22" fill="rgb(169,169,169)">пропаднал</text>
        <text x="1860" y="250" font-family="Arial" font-size="12" fill="rgb(211,211,211)">დაკარგული</text>
        <text x="1550" y="80" font-family="Arial" font-size="20" fill="rgb(105,105,105)">կորած</text>
        <text x="600" y="80" font-family="Arial" font-size="14" fill="rgb(192,192,192)">жоғалған</text>
        <text x="150" y="180" font-family="Arial" font-size="18" fill="rgb(128,128,128)">verlore</text>
        <text x="1830" y="780" font-family="Arial" font-size="16" fill="rgb(169,169,169)">caduto</text>
        <text x="250" y="1060" font-family="Arial" font-size="14" fill="rgb(211,211,211)">difuminat</text>
        <text x="1350" y="1060" font-family="Arial" font-size="18" fill="rgb(105,105,105)">faillí</text>
        <text x="750" y="1060" font-family="Arial" font-size="12" fill="rgb(192,192,192)">hävinnyt</text>
        <text x="1700" y="60" font-family="Arial" font-size="20" fill="rgb(128,128,128)">perdida</text>
        <text x="400" y="100" font-family="Arial" font-size="16" fill="rgb(169,169,169)">izgubljen</text>
        <text x="60" y="700" font-family="Arial" font-size="14" fill="rgb(211,211,211)">απολεσθέν</text>
        <text x="1840" y="650" font-family="Arial" font-size="18" fill="rgb(105,105,105)">তলাশা</text>
        <text x="200" y="60" font-family="Arial" font-size="16" fill="rgb(192,192,192)">elveszett</text>
        <text x="300" y="200" font-family="Arial" font-size="16" fill="rgb(192,192,192)">perso</text>
        <text x="1520" y="250" font-family="Arial" font-size="18" fill="rgb(169,169,169)">χαμένο</text>
        <text x="250" y="450" font-family="Arial" font-size="14" fill="rgb(128,128,128)">ضاع</text>
        <text x="1600" y="480" font-family="Arial" font-size="20" fill="rgb(211,211,211)">kaybolmuş</text>
        <text x="350" y="850" font-family="Arial" font-size="16" fill="rgb(105,105,105)">失われる</text>
        <text x="1450" y="820" font-family="Arial" font-size="18" fill="rgb(192,192,192)">שאבד</text>
        <text x="200" y="650" font-family="Arial" font-size="12" fill="rgb(128,128,128)">perdu</text>
        <text x="1550" y="650" font-family="Arial" font-size="14" fill="rgb(169,169,169)">förlust</text>
        <text x="380" y="300" font-family="Arial" font-size="20" fill="rgb(211,211,211)">kaybetti</text>
        <text x="1420" y="350" font-family="Arial" font-size="16" fill="rgb(105,105,105)">caillte</text>
        <text x="280" y="750" font-family="Arial" font-size="18" fill="rgb(192,192,192)">smarrito</text>
        <text x="1500" y="720" font-family="Arial" font-size="14" fill="rgb(128,128,128)">kadonneena</text>
        <text x="450" y="250" font-family="Arial" font-size="12" fill="rgb(169,169,169)">rătăcit</text>
        <text x="1380" y="280" font-family="Arial" font-size="16" fill="rgb(211,211,211)">desaparegut</text>
        <text x="320" y="550" font-family="Arial" font-size="20" fill="rgb(105,105,105)">загубљен</text>
        <text x="1480" y="580" font-family="Arial" font-size="18" fill="rgb(192,192,192)">жоғалды</text>
        <text x="420" y="750" font-family="Arial" font-size="14" fill="rgb(128,128,128)">անհետացել</text>
        <text x="1400" y="750" font-family="Arial" font-size="16" fill="rgb(169,169,169)">হারিয়ে</text>
        <text x="250" y="280" font-family="Arial" font-size="18" fill="rgb(211,211,211)">утерянный</text>
        <text x="1580" y="200" font-family="Arial" font-size="14" fill="rgb(105,105,105)">行方不明</text>
        <text x="180" y="550" font-family="Arial" font-size="16" fill="rgb(192,192,192)">stratený</text>
        <text x="1650" y="550" font-family="Arial" font-size="20" fill="rgb(128,128,128)">ausente</text>
        <text x="400" y="180" font-family="Arial" font-size="12" fill="rgb(169,169,169)">исчезнувший</text>
        <text x="1450" y="180" font-family="Arial" font-size="18" fill="rgb(211,211,211)">elhagyott</text>
        <text x="220" y="850" font-family="Arial" font-size="14" fill="rgb(105,105,105)">rozptýlený</text>
        <text x="1620" y="880" font-family="Arial" font-size="16" fill="rgb(192,192,192)">ztratil</text>
        <text x="480" y="880" font-family="Arial" font-size="20" fill="rgb(128,128,128)">katonut</text>
        <text x="1350" y="150" font-family="Arial" font-size="14" fill="rgb(169,169,169)">desapareguda</text>
        <text x="150" y="380" font-family="Arial" font-size="18" fill="rgb(211,211,211)">втрачений</text>
        <text x="1700" y="400" font-family="Arial" font-size="16" fill="rgb(105,105,105)">dispărut</text>
        <text x="350" y="950" font-family="Arial" font-size="12" fill="rgb(192,192,192)">umepotea</text>
        <text x="1480" y="920" font-family="Arial" font-size="18" fill="rgb(128,128,128)">pazudis</text>
        <text x="520" y="200" font-family="Arial" font-size="20" fill="rgb(169,169,169)">dingo</text>
        <text x="1320" y="900" font-family="Arial" font-size="14" fill="rgb(211,211,211)">길잃은</text>
        <text x="180" y="240" font-family="Arial" font-size="16" fill="rgb(105,105,105)">紛失</text>
        <text x="1680" y="320" font-family="Arial" font-size="18" fill="rgb(192,192,192)">kehilangan</text>
        <text x="280" y="950" font-family="Arial" font-size="14" fill="rgb(128,128,128)">mitiet</text>
        <text x="1580" y="780" font-family="Arial" font-size="16" fill="rgb(169,169,169)">extraño</text>
        <text x="420" y="350" font-family="Arial" font-size="20" fill="rgb(211,211,211)">χαμένο</text>
        <text x="1450" y="450" font-family="Arial" font-size="12" fill="rgb(105,105,105)">נעלם</text>
        <text x="700" y="250" font-family="Arial" font-size="16" fill="rgb(169,169,169)">затерянный</text>
        <text x="950" y="280" font-family="Arial" font-size="18" fill="rgb(192,192,192)">desvanecido</text>
        <text x="1150" y="260" font-family="Arial" font-size="14" fill="rgb(128,128,128)">kaybolan</text>
        <text x="600" y="820" font-family="Arial" font-size="20" fill="rgb(211,211,211)">verschwunden</text>
        <text x="850" y="850" font-family="Arial" font-size="16" fill="rgb(105,105,105)">sparito</text>
        <text x="1100" y="830" font-family="Arial" font-size="18" fill="rgb(192,192,192)">消逝</text>
        <text x="750" y="210" font-family="Arial" font-size="12" fill="rgb(128,128,128)">norimet</text>
        <text x="1050" y="220" font-family="Arial" font-size="14" fill="rgb(169,169,169)">égaré</text>
        <text x="650" y="880" font-family="Arial" font-size="16" fill="rgb(211,211,211)">eltűnt</text>
        <text x="1000" y="900" font-family="Arial" font-size="18" fill="rgb(105,105,105)">消える</text>
        <text x="1200" y="870" font-family="Arial" font-size="14" fill="rgb(192,192,192)">zaginiony</text>
        <text x="800" y="240" font-family="Arial" font-size="20" fill="rgb(128,128,128)">пропал</text>
        <text x="900" y="110" font-family="Arial" font-size="16" fill="rgb(169,169,169)">absens</text>
        <text x="1100" y="240" font-family="Arial" font-size="12" fill="rgb(211,211,211)">ضائع</text>
        <text x="700" y="890" font-family="Arial" font-size="18" fill="rgb(105,105,105)">zâmbit</text>
        <text x="950" y="920" font-family="Arial" font-size="14" fill="rgb(192,192,192)">пропало</text>
        <text x="1150" y="900" font-family="Arial" font-size="16" fill="rgb(128,128,128)">കളഞ്ഞു</text>
        <text x="650" y="230" font-family="Arial" font-size="14" fill="rgb(169,169,169)">dingęs</text>
        <text x="1000" y="260" font-family="Arial" font-size="20" fill="rgb(211,211,211)">försvunnen</text>
        <text x="750" y="870" font-family="Arial" font-size="16" fill="rgb(105,105,105)">егарь</text>
        <text x="850" y="220" font-family="Arial" font-size="12" fill="rgb(192,192,192)">изчезнал</text>
        <text x="1050" y="890" font-family="Arial" font-size="18" fill="rgb(128,128,128)">સ્વાહા</text>
    </svg>
    <script>
        // ============================================================
        // STEP 1: SELECT AND SEPARATE TEXT ELEMENTS
        // ============================================================

        // Get the SVG element by its ID
        const svg = document.getElementById('svg404');

        // Get all <text> elements inside the SVG and convert to an array
        const allTexts = Array.from(svg.querySelectorAll('text'));

        // Find the main "lost" text element (this one stays in the center)
        const lostElement = allTexts.find(text => text.textContent.trim() === 'lost');

        // Get all other text elements (the translations we want to shuffle)
        const otherTexts = allTexts.filter(text => text.textContent.trim() !== 'lost');

        // Extract just the text content from each element (the words themselves)
        const words = otherTexts.map(text => text.textContent.trim());

        // ============================================================
        // STEP 2: SHUFFLE FUNCTION (Fisher-Yates Algorithm)
        // ============================================================

        /**
         * Randomly shuffles an array using the Fisher-Yates algorithm
         * This is a proven method that gives each permutation equal probability
         * 
         * How it works:
         * - Start from the end of the array
         * - Pick a random element from the remaining unshuffled portion
         * - Swap it with the current position
         * - Move to the next position and repeat
         * 
         * @param {Array} array - The array to shuffle
         * @returns {Array} A new shuffled array (original is not modified)
         */
        function shuffle(array) {
            const shuffled = [...array];  // Create a copy using spread operator

            // Loop backwards through the array
            for (let i = shuffled.length - 1; i > 0; i--) {
                // Pick a random index from 0 to i (inclusive)
                const j = Math.floor(Math.random() * (i + 1));

                // Swap elements at positions i and j
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            return shuffled;
        }

        // ============================================================
        // STEP 3: TEXT WIDTH ESTIMATION
        // ============================================================

        /**
         * Estimates the width of a text element in pixels
         * This is needed to detect if two words overlap horizontally
         * 
         * Note: We can't measure the exact width without rendering,
         * so we use an approximation based on character count and font size
         * 
         * @param {string} text - The text content
         * @param {number} fontSize - The font size in pixels
         * @returns {number} Estimated width in pixels
         */
        function estimateTextWidth(text, fontSize) {
            // Average character width is approximately 0.6 times the font size
            // This ratio works well for Arial/Helvetica fonts
            const avgCharWidth = fontSize * 0.6;

            // Total width = number of characters × average character width
            return text.length * avgCharWidth;
        }

        // ============================================================
        // STEP 4: OVERLAP DETECTION
        // ============================================================

        /**
         * Checks if two text elements overlap (collide)
         * 
         * Two rectangles overlap if they intersect both horizontally AND vertically
         * We check each axis separately, then combine the results
         * 
         * @param {Element} text1 - First text element
         * @param {Element} text2 - Second text element
         * @returns {boolean} True if the elements overlap, false otherwise
         */
        function checkOverlap(text1, text2) {
            // Get position and size information for text1
            const x1 = parseFloat(text1.getAttribute('x'));           // Left edge X coordinate
            const y1 = parseFloat(text1.getAttribute('y'));           // Baseline Y coordinate
            const fontSize1 = parseFloat(text1.getAttribute('font-size'));
            const width1 = estimateTextWidth(text1.textContent, fontSize1);

            // Get position and size information for text2
            const x2 = parseFloat(text2.getAttribute('x'));
            const y2 = parseFloat(text2.getAttribute('y'));
            const fontSize2 = parseFloat(text2.getAttribute('font-size'));
            const width2 = estimateTextWidth(text2.textContent, fontSize2);

            // Check VERTICAL overlap first (are they on the same line?)
            // We add a margin equal to half the larger font size
            const verticalMargin = Math.max(fontSize1, fontSize2) * 0.5;

            // If the Y coordinates are too far apart, they can't overlap
            if (Math.abs(y1 - y2) > verticalMargin) {
                return false;  // Not on the same line, so no overlap
            }

            // Check HORIZONTAL overlap (do they collide left-to-right?)
            const horizontalMargin = 5; // Small margin between words (5 pixels)

            // Two rectangles DON'T overlap horizontally if:
            // - text1 ends before text2 starts (x1 + width1 < x2), OR
            // - text2 ends before text1 starts (x2 + width2 < x1)
            // We return the OPPOSITE (they DO overlap)
            return !(x1 + width1 + horizontalMargin < x2 || x2 + width2 + horizontalMargin < x1);
        }

        // ============================================================
        // STEP 5: POSITION ADJUSTMENT (COLLISION RESOLUTION)
        // ============================================================

        /**
         * Adjusts the position of a text element to avoid overlapping with others
         * 
         * Strategy:
         * 1. Check if this element overlaps with any other element
         * 2. If it does, move it away on either the X or Y axis
         * 3. Choose the axis where there's less overlap (easier to fix)
         * 4. Repeat up to maxAttempts times
         * 
         * @param {Element} textElement - The text element to adjust
         * @param {Array} otherElements - All other text elements to check against
         * @param {number} maxAttempts - Maximum number of adjustment attempts (default: 10)
         */
        function adjustPosition(textElement, otherElements, maxAttempts = 10) {
            let attempts = 0;           // Counter for adjustment attempts
            let hasOverlap = true;      // Flag to track if overlaps still exist

            // Keep trying to fix overlaps until we succeed or run out of attempts
            while (hasOverlap && attempts < maxAttempts) {
                hasOverlap = false;  // Assume no overlap (will be set to true if found)

                // Check against each other element
                for (const other of otherElements) {
                    // Skip comparing the element to itself
                    if (other === textElement) continue;

                    // Check if there's an overlap
                    if (checkOverlap(textElement, other)) {
                        hasOverlap = true;  // Found an overlap!

                        // Get current position and size information
                        const currentX = parseFloat(textElement.getAttribute('x'));
                        const currentY = parseFloat(textElement.getAttribute('y'));
                        const fontSize = parseFloat(textElement.getAttribute('font-size'));
                        const width = estimateTextWidth(textElement.textContent, fontSize);
                        const otherX = parseFloat(other.getAttribute('x'));
                        const otherY = parseFloat(other.getAttribute('y'));

                        // Calculate how much overlap there is on each axis
                        const deltaX = Math.abs(currentX - otherX);  // Horizontal distance
                        const deltaY = Math.abs(currentY - otherY);  // Vertical distance

                        // DECISION: Move on the axis with LESS overlap (easier to resolve)
                        if (deltaX < deltaY) {
                            // ===== MOVE HORIZONTALLY =====
                            if (currentX < otherX) {
                                // Current element is to the left, so move it further left
                                const newX = Math.max(10, currentX - width * 0.3);
                                textElement.setAttribute('x', newX);
                            } else {
                                // Current element is to the right, so move it further right
                                // Make sure we don't go beyond the right edge (1920 - width)
                                const newX = Math.min(1910 - width, currentX + width * 0.3);
                                textElement.setAttribute('x', newX);
                            }
                        } else {
                            // ===== MOVE VERTICALLY =====
                            if (currentY < otherY) {
                                // Current element is above, so move it further up
                                // Make sure we don't go above the top edge
                                const newY = Math.max(fontSize + 10, currentY - fontSize * 0.5);
                                textElement.setAttribute('y', newY);
                            } else {
                                // Current element is below, so move it further down
                                // Make sure we don't go below the bottom edge (1080)
                                const newY = Math.min(1070, currentY + fontSize * 0.5);
                                textElement.setAttribute('y', newY);
                            }
                        }

                        // We found and fixed an overlap, so exit the inner loop
                        // and start checking all elements again from the beginning
                        break;
                    }
                }

                attempts++;  // Increment attempt counter
            }
        }

        // ============================================================
        // STEP 6: EXECUTE THE SHUFFLE AND FIX OVERLAPS
        // ============================================================

        // Shuffle all the words (creates a new random arrangement)
        const shuffledWords = shuffle(words);

        // Assign the shuffled words back to the text elements
        // This changes what each <text> element displays
        otherTexts.forEach((text, index) => {
            text.textContent = shuffledWords[index];
        });

        // Detect and fix any overlaps that were created by the shuffle
        // We process each text element one by one
        otherTexts.forEach((text, index) => {
            // Get all OTHER elements (excluding the current one)
            const otherElements = otherTexts.filter((_, i) => i !== index);

            // Try to adjust this element's position to avoid overlaps
            adjustPosition(text, otherElements);
        });
    </script>
</body>

</html>
