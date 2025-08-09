/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
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
 */
import { useEffect } from "react";

export const SiteLoading = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");

    styleElement.innerHTML = `
      @keyframes spinner-rotate {
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="absolute flex items-center justify-center h-screen w-screen dark:bg-black">
      <div
        aria-label="Loading"
        aria-live="polite"
        className="
          block
          w-48 h-48
          rounded-full
          bg-[conic-gradient(red,orange,yellow,green,blue,indigo,violet,red)]
          [mask-image:radial-gradient(circle_closest-side,transparent_75%,#000_75%,#000_100%)]
          [animation:spinner-rotate_800ms_linear_infinite]
        "
        role="status"
      />
    </div>
  );
};
