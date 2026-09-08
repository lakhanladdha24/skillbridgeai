import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Award, CheckCircle2, Search, ArrowLeft, Calendar, User, BookOpen } from 'lucide-react';
import { Certificate } from '../types/certificate';
import QRCodeView from '../components/QRCodeView';

export const CertificateVerify: React.FC = () => {
    const { certificateId: paramCertId } = useParams<{ certificateId: string }>();
    const navigate = useNavigate();

    const [searchId, setSearchId] = useState<string>(paramCertId || '');
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (paramCertId) {
            verifyCertificate(paramCertId);
        }
    }, [paramCertId]);

    const verifyCertificate = async (id: string) => {
        if (!id || !id.trim()) return;
        setLoading(true);
        setError(null);
        setCertificate(null);

        try {
            const res = await fetch(`/api/certificates/verify/${encodeURIComponent(id.trim())}`);
            const data = await res.json();

            if (data.valid && data.certificate) {
                setCertificate(data.certificate);
            } else {
                setError(data.error || 'Certificate not found or invalid certificate ID.');
            }
        } catch (e) {
            setError('Failed to reach verification server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/verify/${searchId.trim()}`);
            verifyCertificate(searchId.trim());
        }
    };

    const fullUrl = window.location.href;

    return (
        <div className="max-w-4xl mx-auto pt-10 px-4 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
                >
                    <ArrowLeft size={14} /> Back to Dashboard
                </button>

                <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold">
                    <ShieldCheck size={16} /> Skill Bridge AI Verification Engine
                </div>
            </div>

            <div className="text-center mb-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs">
                    <Award size={14} /> Official Credential Verification System
                </div>
                <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-primary">
                    Verify Certificate Authenticity
                </h1>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    Enter any Skill Bridge AI Certificate ID to instantly verify its validity, recipient identity, and course details.
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="glass-card p-3 rounded-2xl border border-white/10 max-w-xl mx-auto mb-10 flex items-center gap-2 shadow-2xl">
                <Search size={20} className="text-gray-400 ml-3 flex-shrink-0" />
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. SBAI-ML-7F4A92D1)..."
                    className="w-full bg-transparent text-white placeholder-gray-500 text-sm font-mono focus:outline-none px-2"
                />
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-black font-black text-xs rounded-xl shadow-lg hover:bg-primary/90 transition-all flex-shrink-0"
                >
                    Verify
                </button>
            </form>

            {/* Result Area */}
            {loading && (
                <div className="p-12 text-center text-primary font-semibold animate-pulse flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    Authenticating credential record against Skill Bridge AI Ledger...
                </div>
            )}

            {error && !loading && (
                <div className="p-8 glass-card rounded-3xl border border-red-500/30 bg-red-500/10 text-center space-y-4 max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                        <AlertCircle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Invalid Certificate ID</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{error}</p>
                </div>
            )}

            {certificate && !loading && (
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-emerald-500/40 bg-gray-950/80 shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Award size={200} className="text-emerald-400" />
                    </div>

                    {/* Status Badge Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle2 size={28} />
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                    ✓ OFFICIAL VALID CREDENTIAL
                                </span>
                                <h2 className="text-2xl font-black text-white mt-1">Certificate Authenticated</h2>
                            </div>
                        </div>

                        <div className="text-left sm:text-right font-mono">
                            <span className="text-[10px] text-gray-400 uppercase">Certificate ID</span>
                            <div className="text-lg font-black text-amber-400">{certificate.certificateId}</div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                <User size={14} className="text-primary" /> RECIPIENT NAME
                            </div>
                            <div className="text-xl font-bold text-white capitalize">{certificate.userName}</div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                <BookOpen size={14} className="text-secondary" /> COMPLETED COURSE
                            </div>
                            <div className="text-xl font-bold text-primary">{certificate.courseName}</div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                <Calendar size={14} className="text-accent" /> ISSUE DATE
                            </div>
                            <div className="text-base font-bold text-white">{certificate.completionDate}</div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                <ShieldCheck size={14} className="text-emerald-400" /> ISSUER
                            </div>
                            <div className="text-base font-bold text-white">Skill Bridge AI Credential Engine</div>
                        </div>
                    </div>

                    {/* QR Code & Link */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <h4 className="font-bold text-white text-base">Verified Public Record</h4>
                            <p className="text-xs text-gray-400">
                                This credential has been cryptographically signed and stored in the Skill Bridge AI verification database.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <QRCodeView value={fullUrl} size={90} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateVerify;
