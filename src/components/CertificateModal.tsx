import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, ExternalLink, Check, Share2, Award, Sparkles, Moon, Sun, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCodeView from './QRCodeView';
import { Certificate, CertificateTheme } from '../types/certificate';
import { getSavedCertificateTheme, saveCertificateTheme } from '../utils/certificateHelper';

interface CertificateModalProps {
    certificate: Certificate | null;
    onClose: () => void;
}

interface ThemeConfig {
    id: CertificateTheme;
    name: string;
    icon: React.ReactNode;
    canvasBg: string;
    containerStyle: React.CSSProperties;
    outerBorder: string;
    innerBorder1: string;
    innerBorder2: string;
    primaryBrandText: string;
    accentBrandText: string;
    brandSubtext: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    ribbonText: string;
    bodyText: string;
    recipientName: string;
    recipientShadow?: string;
    courseBoxBg: string;
    courseBoxBorder: string;
    courseNameText: string;
    dateLabel: string;
    dateValue: string;
    metaLabel: string;
    metaId: string;
    verifyLink: string;
    sealBorder: string;
    sealBg: string;
    sealText: string;
    sealSubtext: string;
    qrHeader: string;
    qrSubtext: string;
    dividerBorder: string;
}

const THEMES: Record<CertificateTheme, ThemeConfig> = {
    dark: {
        id: 'dark',
        name: 'Dark Obsidian',
        icon: <Moon size={13} />,
        canvasBg: '#050814',
        containerStyle: {
            backgroundColor: '#050814',
            backgroundImage: 'radial-gradient(circle at 50% 25%, rgba(0, 240, 255, 0.12), transparent 60%), radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.12), transparent 50%), linear-gradient(180deg, #070c1e 0%, #03050c 100%)',
            color: '#ffffff'
        },
        outerBorder: 'border-amber-400/35',
        innerBorder1: 'border-amber-400/20',
        innerBorder2: 'border-white/10',
        primaryBrandText: '#ffffff',
        accentBrandText: '#00f0ff',
        brandSubtext: '#94a3b8',
        badgeBg: 'rgba(16, 185, 129, 0.15)',
        badgeBorder: 'rgba(16, 185, 129, 0.4)',
        badgeText: '#34d399',
        ribbonText: '#fbbf24',
        bodyText: '#cbd5e1',
        recipientName: '#ffffff',
        recipientShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
        courseBoxBg: 'rgba(0, 240, 255, 0.12)',
        courseBoxBorder: 'rgba(0, 240, 255, 0.45)',
        courseNameText: '#00f0ff',
        dateLabel: '#94a3b8',
        dateValue: '#ffffff',
        metaLabel: '#94a3b8',
        metaId: '#fbbf24',
        verifyLink: '#38bdf8',
        sealBorder: 'rgba(245, 158, 11, 0.6)',
        sealBg: 'rgba(245, 158, 11, 0.1)',
        sealText: '#fbbf24',
        sealSubtext: '#ffffff',
        qrHeader: '#ffffff',
        qrSubtext: '#94a3b8',
        dividerBorder: 'rgba(255, 255, 255, 0.12)'
    },
    light: {
        id: 'light',
        name: 'Royal Ivory',
        icon: <Sun size={13} />,
        canvasBg: '#ffffff',
        containerStyle: {
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.08), transparent 60%), radial-gradient(circle at 85% 85%, rgba(2, 132, 199, 0.06), transparent 50%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            color: '#0f172a'
        },
        outerBorder: 'border-amber-700/60',
        innerBorder1: 'border-amber-700/30',
        innerBorder2: 'border-slate-300/60',
        primaryBrandText: '#0f172a',
        accentBrandText: '#0284c7',
        brandSubtext: '#475569',
        badgeBg: 'rgba(5, 150, 105, 0.12)',
        badgeBorder: 'rgba(5, 150, 105, 0.4)',
        badgeText: '#065f46',
        ribbonText: '#92400e',
        bodyText: '#334155',
        recipientName: '#0f172a',
        recipientShadow: 'none',
        courseBoxBg: 'rgba(2, 132, 199, 0.08)',
        courseBoxBorder: 'rgba(2, 132, 199, 0.45)',
        courseNameText: '#0369a1',
        dateLabel: '#64748b',
        dateValue: '#0f172a',
        metaLabel: '#64748b',
        metaId: '#b45309',
        verifyLink: '#0284c7',
        sealBorder: 'rgba(180, 83, 9, 0.65)',
        sealBg: 'rgba(254, 243, 199, 0.75)',
        sealText: '#92400e',
        sealSubtext: '#0f172a',
        qrHeader: '#0f172a',
        qrSubtext: '#475569',
        dividerBorder: 'rgba(15, 23, 42, 0.14)'
    },
    grey: {
        id: 'grey',
        name: 'Platinum Grey',
        icon: <Palette size={13} />,
        canvasBg: '#1e242d',
        containerStyle: {
            backgroundColor: '#1e242d',
            backgroundImage: 'radial-gradient(circle at 50% 25%, rgba(148, 163, 184, 0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(100, 116, 139, 0.12), transparent 50%), linear-gradient(180deg, #262e39 0%, #161a22 100%)',
            color: '#f8fafc'
        },
        outerBorder: 'border-slate-400/50',
        innerBorder1: 'border-slate-300/30',
        innerBorder2: 'border-slate-500/20',
        primaryBrandText: '#f8fafc',
        accentBrandText: '#38bdf8',
        brandSubtext: '#94a3b8',
        badgeBg: 'rgba(148, 163, 184, 0.18)',
        badgeBorder: 'rgba(203, 213, 225, 0.35)',
        badgeText: '#e2e8f0',
        ribbonText: '#e2e8f0',
        bodyText: '#cbd5e1',
        recipientName: '#ffffff',
        recipientShadow: '0 2px 14px rgba(0, 0, 0, 0.7)',
        courseBoxBg: 'rgba(148, 163, 184, 0.14)',
        courseBoxBorder: 'rgba(203, 213, 225, 0.4)',
        courseNameText: '#38bdf8',
        dateLabel: '#94a3b8',
        dateValue: '#ffffff',
        metaLabel: '#94a3b8',
        metaId: '#e2e8f0',
        verifyLink: '#38bdf8',
        sealBorder: 'rgba(203, 213, 225, 0.55)',
        sealBg: 'rgba(148, 163, 184, 0.14)',
        sealText: '#e2e8f0',
        sealSubtext: '#ffffff',
        qrHeader: '#ffffff',
        qrSubtext: '#94a3b8',
        dividerBorder: 'rgba(148, 163, 184, 0.2)'
    }
};

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
    const certRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState<CertificateTheme>(() => {
        return certificate?.theme || getSavedCertificateTheme();
    });

    if (!certificate) return null;

    const currentTheme = THEMES[theme] || THEMES.dark;
    const verificationUrl = `${window.location.origin}/verify/${certificate.certificateId}`;

    const handleThemeChange = (newTheme: CertificateTheme) => {
        setTheme(newTheme);
        saveCertificateTheme(newTheme);
    };

    const handleDownloadPDF = async () => {
        if (!certRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: currentTheme.canvasBg,
                logging: false,
                onclone: (clonedDoc) => {
                    const certEl = clonedDoc.querySelector('[data-cert-node="true"]');
                    if (certEl) {
                        const allNodes = certEl.querySelectorAll('*');
                        allNodes.forEach((node) => {
                            const htmlNode = node as HTMLElement;
                            if (htmlNode.classList.contains('text-transparent')) {
                                htmlNode.classList.remove('text-transparent');
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
            pdf.save(`SkillBridgeAI_${certificate.courseName.replace(/\s+/g, '_')}_${theme}_Certificate.pdf`);
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
                    className="w-full max-w-4xl flex flex-col gap-5 my-auto"
                >
                    {/* Top Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-900/95 border border-white/10 p-3.5 md:p-4 rounded-2xl gap-3 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-primary text-xs md:text-sm font-bold">
                                <Sparkles size={16} /> Official Verified AI Certificate
                            </div>

                            {/* Theme Selector Pills */}
                            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
                                {(['dark', 'light', 'grey'] as CertificateTheme[]).map((t) => {
                                    const isActive = theme === t;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => handleThemeChange(t)}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-primary text-black shadow-md'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                            title={`Switch to ${THEMES[t].name} Theme`}
                                        >
                                            {THEMES[t].icon}
                                            <span className="capitalize">{t}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={handleCopyLink}
                                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                                {copied ? 'Link Copied!' : 'Share Link'}
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="px-4 py-2 bg-gradient-to-r from-primary via-secondary to-accent text-black font-black rounded-xl text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-50"
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
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Printable Certificate Frame */}
                    <div
                        ref={certRef}
                        data-cert-node="true"
                        className={`relative w-full aspect-[1.414/1] rounded-3xl p-6 md:p-10 border-4 ${currentTheme.outerBorder} overflow-hidden shadow-2xl flex flex-col justify-between font-sans select-none transition-colors duration-300`}
                        style={currentTheme.containerStyle}
                    >
                        {/* Decorative Outer Border Lines */}
                        <div className={`absolute inset-2 md:inset-3 border ${currentTheme.innerBorder1} rounded-2xl pointer-events-none`} />
                        <div className={`absolute inset-4 md:inset-5 border ${currentTheme.innerBorder2} rounded-xl pointer-events-none`} />

                        {/* Top Header Branding */}
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 shadow-lg flex-shrink-0">
                                    <div 
                                        className="w-full h-full rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: theme === 'light' ? '#f8fafc' : '#090d1a' }}
                                    >
                                        <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                    </div>
                                </div>
                                <div>
                                    <h3 
                                        className="text-lg md:text-xl font-black tracking-wider transition-colors"
                                        style={{ color: currentTheme.primaryBrandText, WebkitTextFillColor: currentTheme.primaryBrandText }}
                                    >
                                        SKILL
                                        <span style={{ color: currentTheme.accentBrandText, WebkitTextFillColor: currentTheme.accentBrandText }}>
                                            BRIDGE
                                        </span> AI
                                    </h3>
                                    <p 
                                        className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase transition-colors"
                                        style={{ color: currentTheme.brandSubtext, WebkitTextFillColor: currentTheme.brandSubtext }}
                                    >
                                        OFFICIAL ACCREDITATION & CERTIFICATION PLATFORM
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-mono font-bold shadow-sm transition-colors"
                                    style={{
                                        backgroundColor: currentTheme.badgeBg,
                                        borderColor: currentTheme.badgeBorder,
                                        borderWidth: '1px',
                                        color: currentTheme.badgeText,
                                        WebkitTextFillColor: currentTheme.badgeText
                                    }}
                                >
                                    <ShieldCheck size={13} /> CERTIFIED BY SKILLBRIDGE AI
                                </span>
                            </div>
                        </div>

                        {/* Main Body */}
                        <div className="text-center my-auto py-3 md:py-5 space-y-3 md:space-y-4 relative z-10">
                            <p 
                                className="text-xs md:text-sm font-mono tracking-widest uppercase font-black transition-colors"
                                style={{ color: currentTheme.ribbonText, WebkitTextFillColor: currentTheme.ribbonText }}
                            >
                                ★ OFFICIAL CERTIFICATE OF COMPLETION & MASTERY ★
                            </p>
                            
                            <p 
                                className="text-xs md:text-sm font-medium transition-colors"
                                style={{ color: currentTheme.bodyText, WebkitTextFillColor: currentTheme.bodyText }}
                            >
                                This official credential certifies that
                            </p>

                            <h1 
                                className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight capitalize py-1 transition-colors"
                                style={{
                                    color: currentTheme.recipientName,
                                    WebkitTextFillColor: currentTheme.recipientName,
                                    textShadow: currentTheme.recipientShadow || 'none'
                                }}
                            >
                                {certificate.userName}
                            </h1>

                            <p 
                                className="text-xs md:text-sm max-w-xl mx-auto leading-relaxed transition-colors px-4"
                                style={{ color: currentTheme.bodyText, WebkitTextFillColor: currentTheme.bodyText }}
                            >
                                has successfully completed and mastered the rigorous curriculum, video lectures, and practical project requirements for
                            </p>

                            <div 
                                className="inline-block px-6 md:px-8 py-2 md:py-2.5 rounded-2xl shadow-xl transition-all"
                                style={{
                                    backgroundColor: currentTheme.courseBoxBg,
                                    borderColor: currentTheme.courseBoxBorder,
                                    borderWidth: '1px'
                                }}
                            >
                                <h2 
                                    className="text-lg sm:text-2xl md:text-3xl font-black tracking-wide transition-colors"
                                    style={{
                                        color: currentTheme.courseNameText,
                                        WebkitTextFillColor: currentTheme.courseNameText
                                    }}
                                >
                                    {certificate.courseName}
                                </h2>
                            </div>

                            <p 
                                className="text-[11px] md:text-xs font-mono transition-colors"
                                style={{ color: currentTheme.dateLabel, WebkitTextFillColor: currentTheme.dateLabel }}
                            >
                                Certified and issued on: <span className="font-bold" style={{ color: currentTheme.dateValue, WebkitTextFillColor: currentTheme.dateValue }}>{certificate.completionDate}</span> • Accredited by SkillBridge AI
                            </p>
                        </div>

                        {/* Footer Signature & Verification QR */}
                        <div 
                            className="flex items-end justify-between pt-4 md:pt-6 relative z-10 transition-colors"
                            style={{ borderTop: `1px solid ${currentTheme.dividerBorder}` }}
                        >
                            {/* Left: Certificate Meta */}
                            <div className="space-y-1 text-left">
                                <div 
                                    className="text-[9px] md:text-[10px] font-mono uppercase tracking-wider transition-colors"
                                    style={{ color: currentTheme.metaLabel, WebkitTextFillColor: currentTheme.metaLabel }}
                                >
                                    OFFICIAL CREDENTIAL ID
                                </div>
                                <div 
                                    className="text-xs sm:text-sm font-mono font-black tracking-wider transition-colors"
                                    style={{ color: currentTheme.metaId, WebkitTextFillColor: currentTheme.metaId }}
                                >
                                    {certificate.certificateId}
                                </div>
                                <a
                                    href={verificationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] md:text-[11px] hover:underline font-mono mt-0.5 transition-colors"
                                    style={{ color: currentTheme.verifyLink, WebkitTextFillColor: currentTheme.verifyLink }}
                                >
                                    Verify Credential Online <ExternalLink size={10} />
                                </a>
                            </div>

                            {/* Center: Official Seal */}
                            <div className="text-center hidden md:block">
                                <div 
                                    className="w-16 h-16 mx-auto mb-1 rounded-full border-2 border-dashed p-1.5 flex flex-col items-center justify-center font-black text-[9px] leading-tight transition-colors shadow-inner"
                                    style={{
                                        borderColor: currentTheme.sealBorder,
                                        backgroundColor: currentTheme.sealBg,
                                        color: currentTheme.sealText
                                    }}
                                >
                                    <span>CERTIFIED BY</span>
                                    <span 
                                        className="text-[10px] font-black"
                                        style={{ color: currentTheme.sealSubtext, WebkitTextFillColor: currentTheme.sealSubtext }}
                                    >
                                        SKILLBRIDGE AI
                                    </span>
                                    <span>★ VERIFIED ★</span>
                                </div>
                                <p 
                                    className="text-[8px] font-mono uppercase transition-colors"
                                    style={{ color: currentTheme.brandSubtext, WebkitTextFillColor: currentTheme.brandSubtext }}
                                >
                                    OFFICIAL WEBSITE SEAL
                                </p>
                            </div>

                            {/* Right: Verification QR Code */}
                            <div className="flex items-center gap-2.5">
                                <QRCodeView value={verificationUrl} size={62} />
                                <div className="text-left text-[9px] font-mono hidden sm:block">
                                    <p 
                                        className="font-bold transition-colors"
                                        style={{ color: currentTheme.qrHeader, WebkitTextFillColor: currentTheme.qrHeader }}
                                    >
                                        Scan to Verify
                                    </p>
                                    <p style={{ color: currentTheme.qrSubtext, WebkitTextFillColor: currentTheme.qrSubtext }}>
                                        Certified Authenticity
                                    </p>
                                    <p style={{ color: currentTheme.qrSubtext, WebkitTextFillColor: currentTheme.qrSubtext }}>
                                        SkillBridge AI Registry
                                    </p>
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
