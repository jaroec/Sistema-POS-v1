import React from "react";

/**
 * Props:
 * - page: número actual (1-based)
 * - totalPages: total de páginas
 * - onChange: función (newPage) => void
 */
export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        «
      </button>

      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 border rounded ${p === page ? "bg-slate-800 text-white" : ""}`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        ›
      </button>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(totalPages)}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        »
      </button>
    </div>
  );
}
