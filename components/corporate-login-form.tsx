"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";
import { authService } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function CorporateLoginForm() {
  const { setAuth, isAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth && loginSuccess) {
      router.replace("/assessments");
    } else if (isAuth) {
      router.replace("/home");
    }
  }, [isAuth, loginSuccess, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        corp_email: email,
        password,
      });

      const { token, corp_user_data } = response;
      localStorage.setItem("token", token);
      localStorage.setItem("corp_user_data", JSON.stringify(corp_user_data));

      setAuth({
        isAuth: true,
        id: corp_user_data.id,
        firstName: corp_user_data.firstName,
        lastName: corp_user_data.lastName,
        token,
      });

      setLoginSuccess(true);

      toast({
        variant: "success",
        title: "Success",
        description: "Successfully signed in. Redirecting...",
        duration: 3000,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-black/70 rounded-2xl p-4 lg:shadow-2xl border border-slate-700">
      <CardHeader className="text-center space-y-2">
        <Link
          href="/home"
          className="flex-shrink-0 flex justify-center items-center"
        >
          <span className="text-white lg:text-3xl text-2xl font-bold cursor-pointer">
            <span className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent">
              AI Hire{" "}
            </span>
            <span className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent">
              Studio
            </span>
          </span>
        </Link>
        <CardDescription className="text-gray-400">
          Sign in to your corporate account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="email"
            >
              Corporate Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="password"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-2xl hover:bg-white hover:text-black"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/corporateregister"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
