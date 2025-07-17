import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download } from 'lucide-react';

const QRCodeGenerator: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = window.location.origin;
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1e40af',
            light: '#ffffff',
          },
        });
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, []);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'upnext-qr-code.png';
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
          <QrCode className="h-8 w-8 text-green-600 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code</h2>
        <p className="text-gray-600">Print this QR code for patients to scan</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-72">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
          </div>
          
          <button
            onClick={downloadQRCode}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Download className="h-5 w-5" />
            <span>Download QR Code</span>
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Patients can scan this QR code to access the queue form
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;