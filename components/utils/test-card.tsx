import { ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Test } from "@/types/test";

export const TestCard = ({ test }: { test: Test }) => {
  // Conditional description based on module_name if description is missing
  const getDescription = (moduleName: string): string => {
    if (test.description) {
      return test.description; // Use description if available from the backend
    }

    // Provide a fallback description based on the module_name
    switch (moduleName) {
      case "React":
        return "Test your knowledge of React, including hooks, components, and state management.";
      case "MERN Stack":
        return "A comprehensive assessment of MERN Stack skills, from MongoDB to React.";
      case "Human Resource":
        return "Evaluate your understanding of human resource practices and policies.";
      default:
        return "No description available for this test.";
    }
  };

  return (
    <Card className="bg-[#0f0f0f] text-white w-full md:min-w-80 border-none rounded-2xl shadow-2xl flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl w-2/3 font-semibold">
            {test.module_name}
          </CardTitle>
          <Badge
            className={cn(
              "rounded-full text-[#0f0f0f] hover:text-white",
              test.status === "completed" ? "bg-blue-500" : "bg-green-500"
            )}
          >
            {test.status === "completed" ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-slate-300 mb-4">
          {getDescription(test.module_name)}
        </p>
        <div className="flex flex-col gap-2 text-sm text-slate-300">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{test.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle size={16} />
            <span>{test.questions} questions</span>
          </div>
          {test.status === "completed" && (
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} />
              <span>{test.score}%</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Link
          href={`/test/${test.module_name}/${
            test.status === "completed" ? "result" : "start"
          }`}
        >
          <Button className="bg-white hover:bg-white/90 text-black rounded-full w-full">
            <span>
              {test.status === "completed" ? "View Record" : "Attempt Test"}
            </span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
