
import { useState } from "react";
import {
  ArrowUpRight,
  Link2,
  Copy,
  Check,
  LoaderCircle,
  ExternalLink,
  AtSign
} from "lucide-react";

import { supabase } from "../lib/supabase";
import QRCodeGenerator from "./QRCodeGenerator";

function UrlShortener() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);
    setCopied(false);

    const trimmedUrl = url.trim();
    const alias = customAlias.trim().toLowerCase();

    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      setError("Please enter a valid URL, including https://");
      return;
    }

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      setError("Only valid HTTP and HTTPS links are supported.");
      return;
    }

    if (trimmedUrl.length > 2048) {
      setError("The URL is too long. Maximum length is 2048 characters.");
      return;
    }

    if (
      alias &&
      !/^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])$/.test(alias)
    ) {
      setError(
        "Alias must be 3-30 characters. Use letters, numbers and internal hyphens."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke("create-short-link", {
          body: {
            url: parsedUrl.toString(),
            customAlias: alias
          }
        });

      if (functionError) {
        let message =
          functionError.message ||
          "Unable to create your short link.";

        try {
          const response = functionError.context;

          if (response && typeof response.json === "function") {
            const errorData = await response.json();

            if (errorData?.error) {
              message = errorData.error;
            }
          }
        } catch {
          // Keep original error message.
        }

        throw new Error(message);
      }

      if (!data?.success || !data?.data?.shortUrl) {
        throw new Error(
          data?.error || "The server returned an unexpected response."
        );
      }

      setResult(data.data);
      setUrl("");
      setCustomAlias("");
    } catch (err) {
      console.error("Short link creation error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy error:", err);
      setError("Could not copy the link. Please copy it manually.");
    }
  };

  return (
    <>
      <form className="url-input-card" onSubmit={handleShorten}>
        <div className="url-input-heading">
          <Link2 size={19} />
          <span>YOUR DESTINATION URL</span>
        </div>

        <div className="url-input-row">
          <input
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError("");
            }}
            placeholder="Paste your long URL here..."
            aria-label="Destination URL"
            autoComplete="url"
            maxLength={2048}
            required
          />

          <button
            type="submit"
            className="shorten-button"
            disabled={loading}
          >
            {loading ? (
              <>
                Creating
                <LoaderCircle size={17} className="loading-icon" />
              </>
            ) : (
              <>
                Shorten link
                <ArrowUpRight size={17} />
              </>
            )}
          </button>
        </div>

        {/* Custom Alias */}
        <div className="alias-section">
          <div className="alias-heading">
            <AtSign size={16} />
            <span>CUSTOMIZE YOUR SHORT LINK</span>
            <span className="optional-label">OPTIONAL</span>
          </div>

          <div className="alias-input-wrapper">
            <span className="alias-prefix">/</span>

            <input
              type="text"
              value={customAlias}
              onChange={(event) => {
                setCustomAlias(
                  event.target.value
                    .toLowerCase()
                    .replace(/\s/g, "")
                );
                setError("");
              }}
              placeholder="e.g. myportfolio"
              aria-label="Custom short link alias"
              maxLength={30}
              autoComplete="off"
            />
          </div>

          <p className="alias-hint">
            Choose a memorable name or leave it empty for an
            automatically generated code.
          </p>
        </div>

        <div className="input-footer">
          <span>
            <span className="live-dot" />
            {loading ? "Creating your link..." : "Ready when you are"}
          </span>

          <span>HTTPS links supported</span>
        </div>

        {error && (
          <div className="url-message error-message" role="alert">
            {error}
          </div>
        )}
      </form>

      {result && (
        <div className="url-result">
          <div className="result-heading">
            <div>
              <span className="result-success-dot" />
              <strong>Your short link is ready</strong>
            </div>

            <span className="result-status">SAVED</span>
          </div>

          <div className="result-link-row">
            <a
              className="result-url"
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.shortUrl}
              <ExternalLink size={14} />
            </a>

            <button
              type="button"
              className="copy-button"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={15} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="result-details">
            <span>
              Short code: <strong>{result.shortCode}</strong>
            </span>

            <span>
              <Check size={13} />
              Stored in Supabase
            </span>
          </div>
          <QRCodeGenerator
  shortUrl={result.shortUrl}
  autoOpen={true}
/>

        </div>
      )}
    </>
  );
}

export default UrlShortener;
