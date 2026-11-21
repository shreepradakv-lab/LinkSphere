
import { useCallback, useEffect, useState } from "react";

import {
  Link2,
  Copy,
  ExternalLink,
  Search,
  RefreshCw,
  Trash2,
  Check
} from "lucide-react";

import { supabase } from "../lib/supabase";
import QRCodeGenerator from "./QRCodeGenerator";

function LinkManager() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "list-links",
        { body: {} }
      );

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.message || "Unable to load links.");
      }

      setLinks(data.data || []);
    } catch (err) {
      setError(err.message || "Unable to load links.");
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopiedId(link.id);

      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Unable to copy this link.");
    }
  };

  const deleteLink = async (link) => {
    const confirmed = window.confirm(
      `Delete "${link.shortCode}"?\n\nThis will permanently delete the shortened link and its click history.`
    );

    if (!confirmed) return;

    setDeletingId(link.id);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "delete-short-link",
        {
          body: {
            linkId: link.id
          }
        }
      );

      if (error) {
        let message = error.message || "Unable to delete link.";

        try {
          const response = error.context;

          if (response && typeof response.json === "function") {
            const errorData = await response.json();
            message = errorData?.message || message;
          }
        } catch {
          // Keep original error message.
        }

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(data?.message || "Unable to delete link.");
      }

      setLinks((previous) =>
        previous.filter((item) => item.id !== link.id)
      );
    } catch (err) {
      console.error("Delete link error:", err);
      setError(err.message || "Unable to delete link.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLinks = links.filter((link) =>
    `${link.originalUrl} ${link.shortCode}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="link-manager">
      <div className="link-manager-heading">
        <div>
          <span className="section-number">03 / YOUR COLLECTION</span>
          <h2>My links</h2>
          <p>Manage and revisit your shortened URLs.</p>
        </div>

        <button
          className="refresh-links"
          onClick={fetchLinks}
          disabled={loading || deletingId !== null}
          title="Refresh links"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="link-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search your links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="links-message links-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="links-message">Loading your links...</div>
      ) : filteredLinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Link2 size={25} />
          </div>

          <h3>
            {search ? "No matching links found." : "No links yet."}
          </h3>

          <p>
            {search
              ? "Try searching with another URL or short code."
              : "Your shortened URLs will appear here."}
          </p>
        </div>
      ) : (
        <div className="links-list">
          {filteredLinks.map((link) => (
            <article className="link-card" key={link.id}>
              <div className="link-card-main">
                <div className="link-card-icon">
                  <Link2 size={19} />
                </div>

                <div className="link-card-details">
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="short-link"
                  >
                    {link.shortCode}
                    <ExternalLink size={13} />
                  </a>

                  <p className="original-link">
                    {link.originalUrl}
                  </p>

                  <span className="link-date">
                    Created:{" "}
                    {new Date(link.createdAt).toLocaleDateString()}
                    {" · "}
                    {link.clicks} clicks
                  </span>
                </div>
              </div>

              <div className="link-card-actions">
                <button
                  className="copy-link-button"
                  onClick={() => copyLink(link)}
                  title="Copy short link"
                  disabled={deletingId === link.id}
                >
                  {copiedId === link.id ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} />
                  )}

                  {copiedId === link.id ? "Copied!" : "Copy"}
                </button>

                <QRCodeGenerator shortUrl={link.shortUrl} />

                <button
                  type="button"
                  className="delete-link-button"
                  onClick={() => deleteLink(link)}
                  disabled={deletingId === link.id}
                  title="Delete link"
                >
                  <Trash2 size={15} />
                  {deletingId === link.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LinkManager;
