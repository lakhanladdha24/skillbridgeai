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
                backgroundColor: '#030712', // Dark background
                logging: false
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
                        className="relative w-full aspect-[1.414/1] bg-gray-950 rounded-3xl p-8 md:p-12 border-4 border-amber-400/30 overflow-hidden shadow-2xl flex flex-col justify-between text-white font-sans select-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.08), transparent 70%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08), transparent 60%)'
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
                                    <h3 className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                        SKILL<span className="text-primary">BRIDGE</span> AI
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                                        AI-POWERED LEARNING PLATFORM
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                                    <ShieldCheck size={14} /> VERIFIED COMPLETED
                                </span>
                            </div>
                        </div>

                        {/* Main Body */}
                        <div className="text-center my-auto py-6 space-y-4 relative z-10">
                            <p className="text-xs md:text-sm font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                                CERTIFICATE OF COMPLETION
                            </p>
                            
                            <p className="text-gray-400 text-xs md:text-sm font-medium">
                                This certificate is proudly presented to
                            </p>

                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white capitalize bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-primary py-1">
                                {certificate.userName}
                            </h1>

                            <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                                for successfully completing the structured curriculum and masterclass requirements for
                            </p>

                            <div className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/40">
                                <h2 className="text-xl md:text-3xl font-black text-primary tracking-wide">
                                    {certificate.courseName}
                                </h2>
                            </div>

                            <p className="text-xs text-gray-400 font-mono">
                                Successfully completed on: <span className="text-white font-bold">{certificate.completionDate}</span>
                            </p>
                        </div>

                        {/* Footer Signature & Verification QR */}
                        <div className="flex items-end justify-between border-t border-white/10 pt-6 relative z-10">
                            {/* Left: Certificate Meta */}
                            <div className="space-y-1 text-left">
                                <div className="text-[10px] text-gray-400 font-mono">CERTIFICATE ID</div>
                                <div className="text-sm font-mono font-black text-amber-400 tracking-wider">
                                    {certificate.certificateId}
                                </div>
                                <a
                                    href={verificationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-mono mt-1"
                                >
                                    Verify Online <ExternalLink size={10} />
                                </a>
                            </div>

                            {/* Center: Official Seal */}
                            <div className="text-center hidden md:block">
                                <div className="w-16 h-16 mx-auto mb-1 rounded-full bg-amber-500/10 border-2 border-dashed border-amber-400/50 flex items-center justify-center text-amber-400 font-black text-xs">
                                    SEAL OF<br />EXCELLENCE
                                </div>
                                <p className="text-[9px] text-gray-500 font-mono uppercase">AUTHENTICATED BY AI</p>
                            </div>

                            {/* Right: Verification QR Code */}
                            <div className="flex items-center gap-3">
                                <QRCodeView value={verificationUrl} size={70} />
                                <div className="text-left text-[10px] font-mono text-gray-400 hidden sm:block">
                                    <p className="text-white font-bold">Scan to Verify</p>
                                    <p>Official Credential</p>
                                    <p>Skill Bridge AI Engine</p>
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
