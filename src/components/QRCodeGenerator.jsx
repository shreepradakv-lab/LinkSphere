
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, LoaderCircle, CheckCircle2 } from "lucide-react";

export default function QRCodeGenerator({ shortUrl, autoOpen = false }) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !shortUrl) return;

    let active = true;

    async function generateQR() {
      setLoading(true);
      setQrCode("");
      setError("");

      try {
        const [image] = await Promise.all([
          QRCode.toDataURL(shortUrl, {
            width: 300,
            margin: 3,
            errorCorrectionLevel: "H",
            color: {
              dark: "#302A26",
              light: "#FFFFFF"
            }
          }),
          new Promise((resolve) => setTimeout(resolve, 900))
        ]);

        if (active) {
          setQrCode(image);
        }
      } catch (err) {
        console.error("QR generation error:", err);

        if (active) {
          setError("Unable to generate QR code. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    generateQR();

    return () => {
      active = false;
    };
  }, [isOpen, shortUrl]);

  return (
    <div className={`qr-generator ${autoOpen ? "qr-auto-open" : ""}`}>
      {!autoOpen && (
        <button
          type="button"
          className="qr-toggle-btn"
          onClick={() => setIsOpen((previous) => !previous)}
        >
          {isOpen ? "Hide QR Code" : "Generate QR Code"}
        </button>
      )}

      {isOpen && shortUrl && (
        <div className="qr-code-panel">
          <div className="qr-panel-heading">
            <div>
              <span className="qr-section-label">READY TO SHARE</span>
              <h4>Your LinkSphere QR Code</h4>
              <p>Scan to open your shortened link.</p>
            </div>

            {qrCode && (
              <span className="qr-ready-indicator">
                <CheckCircle2 size={15} />
                Ready
              </span>
            )}
          </div>

          <div className={`qr-visual-stage ${qrCode ? "qr-revealed" : ""}`}>
            {loading && (
              <div className="qr-scanning-state">
                <div className="qr-scan-frame">
                  <div className="qr-placeholder">
                    <LoaderCircle size={30} />
                    <span>Preparing your QR code</span>
                  </div>
                  <div className="qr-scan-line" />
                </div>

                <span className="qr-generating-text">
                  Generating your code...
                </span>
              </div>
            )}

            {qrCode && (
              <div className="qr-result-visual">
                <img
                  src={qrCode}
                  alt="QR code for your shortened LinkSphere URL"
                  className="qr-code-image"
                />
              </div>
            )}

            {error && (
              <p className="qr-error-message">{error}</p>
            )}
          </div>

          {qrCode && (
            <div className="qr-download-area">
              <a
                href={qrCode}
                download="linksphere-qr-code.png"
                className="qr-download-btn"
              >
                <Download size={16} />
                Download QR Code
              </a>

              <span>PNG image · High-quality QR</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
