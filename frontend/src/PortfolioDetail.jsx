// src/PortfolioDetail.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./PortfolioDetail.css";

export default function PortfolioDetail() {
  const { id } = useParams();        // รับ id จาก URL /portfolio/:id
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("portfolios")
          .select(`
            *,
            portfolio_images ( image_url ),
            profiles!inner (
              username,
              avatar_url
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "ไม่สามารถโหลดผลงานได้");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pd-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ⟵ Back
        </button>
        <p style={{ marginTop: "16px", color: "#ef4444" }}>
          {error || "ไม่พบผลงานนี้"}
        </p>
      </div>
    );
  }

  const imageSrc =
    item.file_url || item.portfolio_images?.[0]?.image_url || null;
  const isPdf = item.file_type === "application/pdf";

  const ownerName = item.profiles?.username || "Unknown";

  return (
    <div className="pd-container">
      <button className="pd-back" onClick={() => navigate(-1)}>
        ⟵ Back
      </button>

      <div className="pd-main">
        {/* ซีกซ้าย: รูป / PDF preview */}
        <div className="pd-media">
          {imageSrc ? (
            !isPdf ? (
              <img src={imageSrc} alt={item.title} className="pd-image" />
            ) : (
              <div className="pd-pdf-box">
                <div>PDF file</div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  กดปุ่ม "Open file" ด้านขวาเพื่อเปิดดู
                </div>
              </div>
            )
          ) : (
            <div className="pd-noimage">No preview</div>
          )}
        </div>

        {/* ซีกขวา: รายละเอียด */}
        <div className="pd-info">
          <h1 className="pd-title">{item.title}</h1>

          <div className="pd-owner">
            <div className="pd-owner-avatar">
              <img
                src={
                  item.profiles?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${ownerName}`
                }
                alt={ownerName}
              />
            </div>
            <div>
              <div className="pd-owner-label">Created by</div>
              <div className="pd-owner-name">{ownerName}</div>
            </div>
          </div>

          {item.description && (
            <p className="pd-desc">{item.description}</p>
          )}

          {imageSrc && (
            <a
              href={imageSrc}
              target="_blank"
              rel="noreferrer"
              className="pd-open-btn"
            >
              Open file
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
