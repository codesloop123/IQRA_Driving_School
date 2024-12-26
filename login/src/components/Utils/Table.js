import React from "react";
export default function Table({ headings, color, children }) {
  return (
    <table className="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          {headings.map((heading, idx) => (
            <th
              key={idx}
              className={
                "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                (color === "light"
                  ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                  : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
              }
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
