"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function CustomSignIn() {
    const { signIn, isLoaded } = useSignIn();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        if (!isLoaded) return;
        setIsLoading(true);
        setError(null);

        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/admin",
            });
        } catch (err: unknown) {
            console.error("Login error:", err);
            let msg = "An error occurred during sign in.";

            if (
                typeof err === "object" &&
                err !== null &&
                "errors" in err &&
                Array.isArray((err as { errors?: unknown[] }).errors) &&
                (err as { errors?: Array<{ message?: string }> }).errors?.[0]?.message
            ) {
                msg = (err as { errors: Array<{ message?: string }> }).errors[0]?.message ?? msg;
            } else if (err instanceof Error && err.message) {
                msg = err.message;
            }

            // Customize common error messages if needed
            if (msg.includes("access_denied")) {
                msg = "Access denied. You must be an invited admin to sign in.";
            }

            setError(msg);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="text-center space-y-2">
                <Logo className="h-12 w-auto mx-auto mb-4 text-foreground" />
                <h1 className="text-2xl font-bold font-display text-foreground">
                    Admin Access
                </h1>
                <p className="text-sm text-[var(--accents-5)]">
                    This area is restricted to authorized administrators.
                </p>
            </div>

            <div className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleSignIn}
                    disabled={!isLoaded || isLoading}
                    className="relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-background text-foreground border border-border rounded-lg hover:bg-[var(--accents-1)] hover:border-[var(--accents-3)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[var(--accents-4)]" />
                    ) : (
                        <>
                            {/* Google G Logo */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-[var(--accents-4)]">
                    By signing in, you agree to our internal terms of service.
                </p>
            </div>
        </div>
    );
}
