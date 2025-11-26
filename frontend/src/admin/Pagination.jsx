import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="pager">
      <button className="btn btn-sm" onClick={onPrev} disabled={page<=1}>Prev</button>
      <span>{page} / {totalPages}</span>
      <button className="btn btn-sm" onClick={onNext} disabled={page>=totalPages}>Next</button>
    </div>
  );
}