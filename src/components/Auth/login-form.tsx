"use client";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from "next/link";
import { LoginFormType, LoginFormSchema } from "@/schemas/auth-schema";
import { useLogin } from "@/hooks/useAuthMutation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";


export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // TanStack Query mutation for handling the API call, loading, and error states
    const { mutate: login, isPending } = useLogin();

    const {
        register, handleSubmit, formState: { errors }, setError,
    } = useForm<LoginFormType>({
        resolver: zodResolver(LoginFormSchema),  // Integrate Zod schema with React Hook Form
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // 2. SUBMISSION HANDLER
    // This function is only called if validation is successful
    const processLogin = (data: LoginFormType) => {
        setFormError(null); // Clear any previous errors
        console.log("Form data is valid:", data);
        login(data, {
            onError: (error: Error) => {
                setFormError(error.message);
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Removed status message */}
            <Card className="overflow-hidden border-0 bg-white/90 p-0 shadow-2xl shadow-black/10 backdrop-blur-sm">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-7 md:p-8" onSubmit={handleSubmit(processLogin)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent">
                                    Welcome back
                                </h1>
                                <p className="text-balance text-muted-foreground">Login to your healthcare account</p>
                                {formError && (
                                    <div className="mt-4 w-full rounded-md bg-red-50 p-3">
                                        <p className="text-sm text-red-600">{formError}</p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        className="h-10 pl-10"
                                        aria-invalid={errors.email ? "true" : "false"}
                                        {...register('email')}
                                    />
                                </div>
                                {/* error message*/}
                                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        className="h-10 pr-10 pl-10"
                                        aria-invalid={errors.password ? "true" : "false"}
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                        tabIndex={-1}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {/* error message*/}
                                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            {/* Remember Me Checkbox */}
                            {/* <div className="flex items-center space-x-2">
                                <Checkbox id="remember" {...register("remember")} />
                                <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                                    Remember me
                                </Label>
                            </div> */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700"
                                tabIndex={4}
                                disabled={isPending} // Disable button while loading

                            >
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? "Logging in..." : "Login"}
                            </Button>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                            <Button variant="outline" type="button" className="w-full" tabIndex={-1}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Login with Google
                            </Button>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <Link href="/auth/role" className="underline underline-offset-4 cursor-pointer">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-purple-400/20 to-pink-400/20">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            {/* <div className="absolute right-8 bottom-8 left-8 text-white">
                                <h2 className="mb-2 text-2xl font-bold">Your Health, Our Priority</h2>
                                <p className="text-white/90">
                                    Access comprehensive healthcare services with our modern platform designed for both patients and providers.
                                </p>
                            </div> */}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-center text-xs text-balance text-muted-foreground">
                By clicking continue, you agree to our{' '}
                <a href="#" className="underline underline-offset-4 hover:text-primary cursor-pointer">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline underline-offset-4 hover:text-primary cursor-pointer">
                    Privacy Policy
                </a>
                .
            </div>
        </div>
    );
}