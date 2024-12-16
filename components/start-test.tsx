"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MediaPermissionsErrorType, requestMediaPermissions } from "mic-check";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as storageUtils from "@/utils/storage";
import { getFileCounts, deleteVideoFiles } from "@/services/test";
import Link from "next/link";

type ModalState = {
  open: boolean;
  title: string;
  desc: string;
  status?: "completed" | "resume";
};

export const StartTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    title: "",
    desc: "",
  });
  const testData = storageUtils.getTestData();
  const router = useRouter();
  const { toast } = useToast();

  const moduleName = testData.module_name;

  const { data: fileCount, isLoading: isFetching } = useSWR<number>(
    "/count",
    getFileCounts
  );

  const handleClose = () => setModalState({ open: false, title: "", desc: "" });

  const handleResume = () => {
    router.push(`/test/${moduleName}/appearing?q=${(fileCount || 0) + 1}`);
  };

  const handleRetake = async () => {
    try {
      setIsLoading(true);
      await deleteVideoFiles();
      router.push(`/test/${moduleName}/appearing`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while restarting the test!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await requestMediaPermissions({ audio: true, video: true });
      // Only navigate if permissions are granted
      router.push(`/test/${testData.module_name}/appearing`);
      // eslint-disable-next-line
    } catch (err: any) {
      const { type } = err;
      const errorMessages: Record<
        string,
        { title: string; description: string }
      > = {
        [MediaPermissionsErrorType.SystemPermissionDenied]: {
          title: "Permission Required",
          description:
            "Please allow camera and microphone access in your browser settings to continue.",
        },
        [MediaPermissionsErrorType.UserPermissionDenied]: {
          title: "Access Denied",
          description:
            "Camera and microphone access is required to take the test. Please allow access and try again.",
        },
        [MediaPermissionsErrorType.CouldNotStartVideoSource]: {
          title: "Camera Unavailable",
          description:
            "Your camera appears to be in use by another application. Please close other apps using your camera and try again.",
        },
        default: {
          title: "Device Error",
          description:
            "Unable to access camera or microphone. Please check your device settings and try again.",
        },
      };

      const error = errorMessages[type] || errorMessages.default;

      toast({
        variant: "destructive",
        title: error.title,
        description: error.description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (testData.status === "inactive") {
    return (
      <div className="bg-black/70 p-6 flex flex-col items-start gap-4 justify-center m-auto rounded-2xl text-white">
        <h1 className="font-bold text-3xl text-red-500">Test Deactivated</h1>
        <p className="text-base">
          Please attempt an active test or contact the test owner.
        </p>
        <Link href="/tests">
          <Button className="bg-white text-black rounded-full hover:bg-white/90">
            Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-4 max-w-xl bg-black/70 rounded-2xl lg:shadow-2xl border border-slate-700">
      <section className="flex flex-col items-center justify-center p-4">
        <div className="w-full mx-auto p-8 rounded-lg">
          <Link href="/home" className="flex-shrink-0 mb-4 flex items-center">
            <span className="text-white lg:text-5xl text-3xl font-bold cursor-pointer">
              <span className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent">
                AI Hire{" "}
              </span>
              <span className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent">
                Studio
              </span>
            </span>
          </Link>
          <h1 className="lg:text-4xl text-2xl font-bold text-white mb-4">
            Attempting test for: {testData?.company_name}
          </h1>

          <h2 className="lg:text-2xl text-lg font-semibold text-white mb-4">
            Test Name: {testData?.module_name}
          </h2>

          <p className="lg:text-lg text-base text-slate-500 mb-4">
            Start the test by clicking the button below
          </p>

          <h3 className="lg:text-lg text-base font-normal text-white mb-6">
            All The Best!
          </h3>

          <Button
            size="lg"
            onClick={handleStart}
            disabled={isLoading || isFetching}
            className="w-full md:w-auto rounded-2xl bg-white hover:bg-white/80"
          >
            {isLoading || isFetching ? "Loading..." : "Start Test"}
          </Button>

          <Link href="/tests">
            <Button
              size="lg"
              disabled={isLoading || isFetching}
              className="w-full md:w-auto rounded-2xl bg-red-600 hover:bg-red-500 mx-3"
            >
              {isLoading || isFetching ? "Loading..." : "End Test"}
            </Button>
          </Link>
        </div>
      </section>

      <Dialog open={modalState.open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalState.title}</DialogTitle>
            <DialogDescription>{modalState.desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRetake}
              disabled={isLoading}
            >
              Retake Test
            </Button>
            {modalState.status === "resume" && (
              <Button onClick={handleResume}>Resume Test</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
