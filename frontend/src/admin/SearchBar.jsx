import React from "react";

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar">
      <input
        placeholder="Search email or name"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        onKeyDown={(e)=>{ if (e.key === "Enter") onSearch(); }}
      />
      <button className="btn" onClick={onSearch}>Search</button>
    </div>
  );
}