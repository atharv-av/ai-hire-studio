"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTestsList, createTest, getAllModules } from "@/services/test";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  module_name: string;
}

export const CreateTest: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const { toast } = useToast();

  const corpUserData =
    typeof window !== "undefined"
      ? localStorage.getItem("corp_user_data")
      : null;
  const parsedUserData = corpUserData ? JSON.parse(corpUserData) : null;
  const id = parsedUserData?.id || "";
  const corp_name = parsedUserData?.corp_name || "";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [modulesData] = await Promise.all([
          getAllModules(),
          getTestsList(id),
        ]);
        setModules(modulesData || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data. Please try again.",
        });
        console.log(error);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a module",
      });
      return;
    }

    setIsSaving(true);
    try {
      await createTest(id, corp_name, selectedModule);
      setSelectedModule("");
      toast({
        title: "Success",
        description: "Test created successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create test. Please try again.",
      });
      console.log(error);
      
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl space-y-3 mx-auto">
        <h1 className="text-center font-bold text-5xl text-white">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent">
            AI Hire{" "}
          </span>
          <span className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent">
            Studio
          </span>
        </h1>
        <h1 className="text-center font-bold text-2xl text-white mb-8">
          Get started by creating tests from our modules
        </h1>

        <div className="bg-black/70 backdrop-blur-sm max-w-md mx-auto rounded-2xl lg:shadow-2xl border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Create Test</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex-1 flex flex-col gap-y-4">
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-full bg-white rounded-2xl">
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Select Module"}
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] text-white">
                  {modules.map((module) => (
                    <SelectItem
                      key={module.id}
                      value={module.module_name}
                      className="cursor-pointer"
                    >
                      {module.module_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                disabled={isSaving || !selectedModule}
                className="w-full rounded-2xl bg-white text-black hover:bg-white/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Test"
                )}
              </Button>
            </div>

            <div className="mt-4">
              <Link
                href="/createtest/custom"
                className="text-white/70 hover:text-white underline text-sm"
              >
                Create your own module to have custom questions
              </Link>
            </div>
          </form>
        </div>

        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <div className="text-white text-center">
              {/* <AssessmentTable rows={tests} onStatusChange={handleChangeStatus} /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

