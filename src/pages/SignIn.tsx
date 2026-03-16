import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
    const { signInWithGoogle, signInWithEmail } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await signInWithEmail(email);
            // Navigate to dashboard after successful sign-in
            navigate('/dashboard');
        } catch (error) {
            console.error("Error signing in", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (isGoogleSubmitting) return;

        setIsGoogleSubmitting(true);
        try {
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            console.error("Error signing in with Google", error);
        } finally {
            setIsGoogleSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl"
            >
                {/* Visual Flair */}
                <div className="absolute top-0 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-[80px]" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-[1px] shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                                <BrainCircuit className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Access your personal career dashboard
                        </p>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleSubmitting || isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGoogleSubmitting ? (
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-gray-500 text-sm font-medium">or continue with email</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                    disabled={isSubmitting || isGoogleSubmitting}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!email || isSubmitting || isGoogleSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-xs mt-8 font-medium">
                        By continuing, you agree to SkillBridgeAI's <br />
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
