"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { registerCorporate } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const employeeSizeOptions = ["1-50", "51-100", "100-500", "501-1000", "1000+"];

const regionOptions = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Australia",
];

export const CorporateRegisterForm: React.FC = () => {
  const { toast } = useToast();
  const { setAuth, isAuth } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    corp_email: "",
    corp_first_name: "",
    corp_last_name: "",
    password: "",
    corp_job_tile: "",
    corp_corp_name: "",
    corp_emp_size: "100-500",
    corp_phone_no: "",
    corp_region: "North America",
  });
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth && loginSuccess) {
      router.replace("/assessments");
    } else if (isAuth) {
      router.replace("/home");
    }
  }, [isAuth, loginSuccess, router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await registerCorporate(formData);
      const { token, corp_user_data } = response;
  
      localStorage.setItem("token", token);
      localStorage.setItem("corp_user_data", JSON.stringify(corp_user_data));
  
      setAuth({
        isAuth: true,
        id: corp_user_data.id,
        firstName: corp_user_data.firstName,
        lastName: corp_user_data.lastName,
        token: token,
      });

      setLoginSuccess(true)
  
      toast({
        title: "Corporate account created successfully!",
        description: "Welcome to AI Hire Studio.",
        variant: "success",
      });
      // eslint-disable-next-line
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Card className="w-full max-w-xl bg-black/70 border-slate-700">
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
        <CardDescription className="text-gray-400">Create your corporate account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="corp_first_name"
              >
                First Name
              </Label>
              <Input
                id="corp_first_name"
                name="corp_first_name"
                value={formData.corp_first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="corp_last_name"
              >
                Last Name
              </Label>
              <Input
                id="corp_last_name"
                name="corp_last_name"
                value={formData.corp_last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
                className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="corp_email"
              >
                Corporate Email
              </Label>
              <Input
                id="corp_email"
                name="corp_email"
                type="email"
                value={formData.corp_email}
                onChange={handleChange}
                placeholder="Enter your corporate email"
                required
                className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="corp_job_tile"
              >
                Job Title
              </Label>
              <Input
                id="corp_job_tile"
                name="corp_job_tile"
                value={formData.corp_job_tile}
                onChange={handleChange}
                placeholder="Enter your job title"
                required
                className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
              required
              className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="corp_corp_name"
              >
                Company Name
              </Label>
              <Input
                id="corp_corp_name"
                name="corp_corp_name"
                value={formData.corp_corp_name}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
                className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-300 mb-1">
                Employee Size
              </Label>
              <Select
                value={formData.corp_emp_size}
                onValueChange={(value: string) =>
                  handleSelectChange("corp_emp_size", value)
                }
              >
                <SelectTrigger className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] text-white">
                  {employeeSizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-300 mb-1">
                Region
              </Label>
              <Select
                value={formData.corp_region}
                onValueChange={(value: string) =>
                  handleSelectChange("corp_region", value)
                }
              >
                <SelectTrigger className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] text-white">
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                className="block text-sm font-medium text-gray-300 mb-1"
                htmlFor="corp_phone_no"
              >
                Phone Number
              </Label>
              <Input
                id="corp_phone_no"
                name="corp_phone_no"
                type="tel"
                value={formData.corp_phone_no}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 rounded-2xl py-3 bg-black/20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-2xl hover:bg-white hover:text-black"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Corporate Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              href="/corporatelogin"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
