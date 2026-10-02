import React, { useState } from 'react';
import {
  QrCode,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MOCK_DIGITAL_LINKS } from '../../data/mockData';
import { DigitalLinkCheck } from '../../types/canon';

export const StructuredWorkbench: React.FC = () => {
  const [links, setLinks] = useState<DigitalLinkCheck[]>(MOCK_DIGITAL_LINKS);
  const [testUrl, setTestUrl] = useState('https://pramanex.canon.rx/verify/eu/keytruda?v=9.1');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutput, setVerificationOutput] = useState<any>(null);

  const handleTestEndpoint = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationOutput({
        statusCode: 200,
        sslValid: true,
        targetVersion: 'SmPC v9.1 (Active Official EMA)',
        languageMatch: 'PASS (English EN)',
        hashConformant: true,
        sha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        notes: 'Target destination points to the current active authorized leaflet. No reprint required.'
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-2 border border-blue-200">
            <QrCode className="w-3.5 h-3.5" />
            Structured-Readiness & Digital-Link Integrity
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SPL / ePI Structured Workbench & Digital-Link Integrity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validate physical 2D DataMatrix packaging barcodes, FHIR bundle schemas, and electronic patient leaflet endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            FHIR ePI v2.4 Ready
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            FDA SPL HL7 Validated
          </span>
        </div>
      </div>

      {/* Live Endpoint & QR Scanner Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Interactive Scanner */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-600" />
            2D DataMatrix / QR Verification Engine
          </h3>
          <p className="text-xs text-slate-500">
            Enter a packaging QR URL or 2D DataMatrix payload to verify live health authority target integrity.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
              <QrCode className="w-24 h-24 text-slate-800" />
            </div>
            <div className="text-center">
              <span className="text-xs font-mono font-bold text-slate-700">Sample Packaging QR</span>
              <p className="text-[10px] text-slate-400">GS1 Digital Link Compliant</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Target Endpoint URL:</label>
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 font-mono"
            />
          </div>

          <button
            onClick={handleTestEndpoint}
            disabled={isVerifying}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'Executing Endpoint Probe...' : 'Probe & Validate Endpoint'}
          </button>

          {verificationOutput && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">Verification Result:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                  PASS (Status 200)
                </span>
              </div>
              <p className="text-emerald-800 font-medium">{verificationOutput.notes}</p>
              <div className="pt-2 border-t border-emerald-200 text-[10px] font-mono text-emerald-700">
                Resolved Version: {verificationOutput.targetVersion}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Monitored Packaging Endpoints */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              Active Commercial Packaging Endpoints ({links.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Automatic hourly probes</span>
          </div>

          <div className="space-y-3">
            {links.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.productName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                      {item.market}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'VERIFIED_ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {item.verificationNotes}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-500">
                  <div>Target Version: <span className="font-bold text-slate-700">{item.resolvedTargetVersion}</span></div>
                  <div>Expected: <span className="font-bold text-slate-700">{item.expectedVersion}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Last Probed: {item.lastCheckedAt}</span>
                  <a
                    href={item.declaredEndpointUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    Visit Declared Destination <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
