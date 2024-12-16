import React, { useState } from "react";
import { endQuiz as endQuizApi } from "@/services/test";
import { Button } from "../components/ui/button";
import * as storageUtils from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { processResponseAPI } from "@/services/responses";

interface TestNavbarProps {
  stopRecording: () => void;
}

export const TestNavbar: React.FC<TestNavbarProps> = ({ stopRecording }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testData = storageUtils.getTestData();
  const quizId = testData.id;

  const handleEndTest = async () => {
    try {
      setIsLoading(true);
      stopRecording();

      if (quizId) {
        // await endQuizApi(quizId);
        await Promise.all([endQuizApi(quizId), processResponseAPI()]);
        toast({
          title: "Test Ended Successfully",
          description: "You will be redirected to the tests page.",
          variant: "default",
        });

        // Short delay to allow toast to be seen before redirect
        // setTimeout(() => {
        //   window.location.href = "/tests";
        // }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Invalid quiz ID",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-[#0f0f0f] w-full px-8 md:px-auto">
      <div className="md:h-16 h-12 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
        <div className="flex items-center gap-2 text-indigo-500 md:order-1">
          <h1 className="lg:text-2xl md:text-xl text-lg capitalize text-white">
            {testData?.company_name || "Test"}
          </h1>
        </div>
        <div className="order-2 md:order-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="bg-red-500 hover:bg-red-400 text-white rounded-full lg:px-8 lg:py-4"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "End Test"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl bg-slate-600 border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  End Test
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  Are you sure you want to end this test? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-white hover:text-white/80 border-none">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-400 rounded-2xl"
                  onClick={handleEndTest}
                >
                  End Test
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </nav>
  );
};

export default TestNavbar;
