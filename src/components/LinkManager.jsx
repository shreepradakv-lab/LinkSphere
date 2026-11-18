
import { useCallback, useEffect, useState } from "react";
import {
  Link2,
  Copy,
  ExternalLink,
  Search,
  RefreshCw
} from "lucide-react";
import { supabase } from "../lib/supabase";
import QRCodeGenerator from "./QRCodeGenerator";

function LinkManager() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.functions.invoke(
      "list-links",
      { body: {} }
    );

    if (error) {
      setError(error.message || "Unable to load links.");
      setLinks([]);
    } else if (data?.success) {
      setLinks(data.data || []);
    } else {
      setError(data?.message || "Unable to load links.");
    }

    setLoading(false);
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
          disabled={loading}
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

      {loading ? (
        <div className="links-message">Loading your links...</div>
      ) : error ? (
        <div className="links-message links-error">
          {error}
        </div>
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
                >
                  <Copy size={15} />
                  {copiedId === link.id ? "Copied!" : "Copy"}
                </button>

                <QRCodeGenerator shortUrl={link.shortUrl} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LinkManager;
