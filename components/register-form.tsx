"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { registerUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const RegisterForm: React.FC = () => {
  const { setAuth, isAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth && loginSuccess) {
      router.replace("/tests");
    } else if (isAuth) {
      router.replace("/home");
    }
  }, [isAuth, loginSuccess, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      };

      const response = await registerUser(data);
      const { token, user_data } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(user_data));

      setAuth({
        isAuth: true,
        id: user_data.id,
        firstName: user_data.firstName,
        lastName: user_data.lastName,
        token: token,
      });

      setLoginSuccess(true);

      toast({
        variant: "success",
        title: "Account created successfully!",
        description: "Welcome to AI Hire Studio. Redirecting...",
        duration: 3000,
      });
      // eslint-disable-next-line
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
      setError(errorMessage);

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-black/70 rounded-2xl lg:shadow-2xl border border-slate-700">
      <CardHeader className="text-center mb-4">
        <Link
          href="/home"
          className="flex-shrink-0 flex justify-center items-center"
        >
          <CardTitle className="text-white lg:text-3xl text-2xl font-bold cursor-pointer">
            <span className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent">
              AI Hire{" "}
            </span>
            <span className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent">
              Studio
            </span>
          </CardTitle>
        </Link>
        <CardDescription className="text-gray-400">
          Create your account
        </CardDescription>
      </CardHeader>

      {error && (
        <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/50">
          <p className="text-red-400 text-center text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              First Name
            </Label>
            <Input
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="last-name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Last Name
            </Label>
            <Input
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </Label>
            <Input
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </Label>
            <Input
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-2xl hover:bg-white hover:text-black"
            disabled={loading}
            // variant={loading ? "secondary" : "primary"}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>

      <CardFooter className="text-center">
        <p className="text-gray-400 mx-auto">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
