import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, ExternalLink, Check, Share2, Award, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCodeView from './QRCodeView';
import { Certificate } from '../types/certificate';

interface CertificateModalProps {
    certificate: Certificate | null;
    onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
    const certRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!certificate) return null;

    const verificationUrl = `${window.location.origin}/verify/${certificate.certificateId}`;

    const handleDownloadPDF = async () => {
        if (!certRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#030712',
                logging: false,
                onclone: (clonedDoc) => {
                    const certEl = clonedDoc.querySelector('[data-cert-node="true"]');
                    if (certEl) {
                        const allNodes = certEl.querySelectorAll('*');
                        allNodes.forEach((node) => {
                            const htmlNode = node as HTMLElement;
                            if (htmlNode.classList.contains('text-transparent')) {
                                htmlNode.classList.remove('text-transparent');
                                htmlNode.style.color = '#ffffff';
                                htmlNode.style.webkitTextFillColor = '#ffffff';
                            }
                        });
                    }
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`SkillBridgeAI_${certificate.courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-4xl flex flex-col gap-6"
                >
                    {/* Top Action Bar */}
                    <div className="flex items-center justify-between bg-gray-900/90 border border-white/10 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-primary text-sm font-bold">
                            <Sparkles size={18} /> Official Verified AI Certificate
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                                {copied ? 'Link Copied!' : 'Share Verification Link'}
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="px-5 py-2 bg-gradient-to-r from-primary via-secondary to-accent text-black font-black rounded-xl text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDownloading ? (
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Download size={14} />
                                )}
                                {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Printable Certificate Frame */}
                    <div
                        ref={certRef}
                        data-cert-node="true"
                        className="relative w-full aspect-[1.414/1] bg-gray-950 rounded-3xl p-8 md:p-12 border-4 border-amber-400/30 overflow-hidden shadow-2xl flex flex-col justify-between text-white font-sans select-none"
                        style={{
                            backgroundColor: '#030712',
                            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.1), transparent 70%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1), transparent 60%)',
                            color: '#ffffff'
                        }}
                    >
                        {/* Decorative Outer Border Lines */}
                        <div className="absolute inset-3 border border-amber-400/20 rounded-2xl pointer-events-none" />
                        <div className="absolute inset-5 border border-white/5 rounded-xl pointer-events-none" />

                        {/* Top Header Branding */}
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 shadow-lg">
                                    <div className="w-full h-full bg-gray-950 rounded-2xl flex items-center justify-center">
                                        <Award className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-wider text-white" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                                        SKILL<span style={{ color: '#00f0ff', WebkitTextFillColor: '#00f0ff' }}>BRIDGE</span> AI
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                                        OFFICIAL ACCREDITATION & CERTIFICATION PLATFORM
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold shadow-lg">
                                    <ShieldCheck size={14} /> CERTIFIED BY SKILLBRIDGE AI
                                </span>
                            </div>
                        </div>

                        {/* Main Body */}
                        <div className="text-center my-auto py-6 space-y-4 relative z-10">
                            <p className="text-xs md:text-sm font-mono tracking-widest text-amber-400 uppercase font-bold" style={{ color: '#fbbf24', WebkitTextFillColor: '#fbbf24' }}>
                                ★ OFFICIAL CERTIFICATE OF COMPLETION & MASTERY ★
                            </p>
                            
                            <p className="text-gray-300 text-xs md:text-sm font-medium" style={{ color: '#d1d5db', WebkitTextFillColor: '#d1d5db' }}>
                                This official credential certifies that
                            </p>

                            <h1 
                                className="text-3xl md:text-5xl font-black tracking-tight text-white capitalize py-1"
                                style={{
                                    color: '#ffffff',
                                    WebkitTextFillColor: '#ffffff',
                                    textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)'
                                }}
                            >
                                {certificate.userName}
                            </h1>

                            <p className="text-gray-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed" style={{ color: '#d1d5db', WebkitTextFillColor: '#d1d5db' }}>
                                has successfully completed and mastered the rigorous curriculum, video lectures, and practical project requirements for
                            </p>

                            <div 
                                className="inline-block px-7 py-2.5 rounded-2xl border shadow-xl"
                                style={{
                                    backgroundColor: 'rgba(0, 240, 255, 0.12)',
                                    borderColor: 'rgba(0, 240, 255, 0.45)'
                                }}
                            >
                                <h2 
                                    className="text-xl md:text-3xl font-black tracking-wide"
                                    style={{
                                        color: '#00f0ff',
                                        WebkitTextFillColor: '#00f0ff',
                                        textShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
                                    }}
                                >
                                    {certificate.courseName}
                                </h2>
                            </div>

                            <p className="text-xs text-gray-300 font-mono" style={{ color: '#d1d5db', WebkitTextFillColor: '#d1d5db' }}>
                                Certified and issued on: <span className="text-white font-bold" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>{certificate.completionDate}</span> • Accredited by SkillBridge AI
                            </p>
                        </div>

                        {/* Footer Signature & Verification QR */}
                        <div className="flex items-end justify-between border-t border-white/10 pt-6 relative z-10">
                            {/* Left: Certificate Meta */}
                            <div className="space-y-1 text-left">
                                <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">OFFICIAL CREDENTIAL ID</div>
                                <div 
                                    className="text-sm font-mono font-black tracking-wider"
                                    style={{ color: '#fbbf24', WebkitTextFillColor: '#fbbf24' }}
                                >
                                    {certificate.certificateId}
                                </div>
                                <a
                                    href={verificationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline font-mono mt-1"
                                    style={{ color: '#38bdf8' }}
                                >
                                    Verify Credential Online <ExternalLink size={10} />
                                </a>
                            </div>

                            {/* Center: Official Seal */}
                            <div className="text-center hidden md:block">
                                <div 
                                    className="w-18 h-18 mx-auto mb-1 rounded-full bg-amber-500/10 border-2 border-dashed border-amber-400/60 p-2 flex flex-col items-center justify-center font-black text-[10px] leading-tight"
                                    style={{ color: '#fbbf24' }}
                                >
                                    <span>CERTIFIED BY</span>
                                    <span className="text-[11px] text-white">SKILLBRIDGE AI</span>
                                    <span>★ VERIFIED ★</span>
                                </div>
                                <p className="text-[9px] text-gray-400 font-mono uppercase">OFFICIAL WEBSITE SEAL</p>
                            </div>

                            {/* Right: Verification QR Code */}
                            <div className="flex items-center gap-3">
                                <QRCodeView value={verificationUrl} size={70} />
                                <div className="text-left text-[10px] font-mono text-gray-400 hidden sm:block">
                                    <p className="text-white font-bold" style={{ color: '#ffffff' }}>Scan to Verify</p>
                                    <p>Certified Authenticity</p>
                                    <p>Skill Bridge AI Registry</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CertificateModal;
