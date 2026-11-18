
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator({ shortUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !shortUrl) return;

    let active = true;

    async function generateQR() {
      try {
        setError("");

        const image = await QRCode.toDataURL(shortUrl, {
          width: 250,
          margin: 2,
          errorCorrectionLevel: "H"
        });

        if (active) setQrCode(image);
      } catch {
        if (active) {
          setError("Unable to generate QR code.");
        }
      }
    }

    generateQR();

    return () => {
      active = false;
    };
  }, [isOpen, shortUrl]);

  return (
    <div className="qr-generator">
      <button
        type="button"
        className="qr-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Hide QR Code" : "Generate QR Code"}
      </button>

      {isOpen && (
        <div className="qr-code-panel">
          <h4>Your LinkSphere QR Code</h4>

          {error && <p>{error}</p>}

          {qrCode && (
            <>
              <img
                src={qrCode}
                alt="QR code for your shortened link"
                className="qr-code-image"
              />

              <a
                href={qrCode}
                download="linksphere-qr-code.png"
                className="qr-download-btn"
              >
                Download QR Code
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
