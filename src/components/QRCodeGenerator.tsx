import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, ExternalLink } from 'lucide-react';

interface QRCodeGeneratorProps {
  clinicId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ clinicId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const queueUrl = `${window.location.origin}/queue/${clinicId}`;

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(queueUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#2B6777',
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
  }, [queueUrl]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `clinic-${clinicId}-qr-code.png`;
      link.click();
    }
  };

  const openQueuePage = () => {
    window.open(queueUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-gray-200">
      <div className="text-center mb-6">
        <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
          <QrCode className="h-8 w-8 text-accent mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Clinic QR Code</h2>
        <p className="text-gray-600 font-body">Patients can scan this to join your queue</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-72">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-neutral p-6 rounded-lg mb-6">
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
          </div>
          
          <div className="space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2 font-heading"
            >
              <Download className="h-5 w-5" />
              <span>Download QR Code</span>
            </button>
            
            <button
              onClick={openQueuePage}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2 font-heading"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Open Queue Page</span>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-neutral rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-body">Queue URL:</p>
            <p className="text-xs text-gray-500 break-all font-body">{queueUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;