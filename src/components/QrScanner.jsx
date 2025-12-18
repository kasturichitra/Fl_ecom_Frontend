import { Scanner } from "@yudiel/react-qr-scanner";

const QRScanner = ({ onScan }) => {
  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      <Scanner
        constraints={{ facingMode: "environment" }} // back camera
        onScan={(result) => {
          if (!result?.length) return;

          // result is an array
          const text = result[0].rawValue;
          onScan(text);
        }}
        onError={(error) => {
          console.error("QR Scan Error:", error);
        }}
      />
    </div>
  );
};

export default QRScanner;
