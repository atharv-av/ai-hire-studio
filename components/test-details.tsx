"use client";

import { TestCard } from "@/components/utils/test-card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-provider";
import { getTestData } from "@/utils/storage";
import { Test } from "@/types/test";

export const TestDetails = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { firstName } = useAuth();

  useEffect(() => {
    // Fetch test data when component mounts
    const testData = getTestData();

    if (testData) {
      // @ts-expect-error Type '{ duration: string; questions: number; status: "pending"; id: number; module_api: string; module_name: string; company_name: string; test_identifier: string; }' is not assignable to type 'Test'.
      const testWithDefaults: Test = {
        ...testData,
        // duration: testData.duration || "30 minutes",
        // questions: testData.questions || 10,
        // status: testData.status || "pending",
        // todo - add after creating api
        duration: "30 seconds per question",
        questions: 30,
        status: "pending",
      };

      setLoading(false);
      setTests([testWithDefaults]);
    }
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading tests...</div>;
  }

  const currentTests = tests.filter((test) => test.status === "pending");
  const previousTests = tests.filter((test) => test.status === "completed");

  return (
    <div className="flex flex-col gap-6 px-6">
      <div>
        <h1 className="text-white font-bold text-5xl">Your Tests</h1>
        <p className="text-slate-300 font-medium text-xl mt-2">
          Welcome back, {firstName}
        </p>
      </div>

      <Separator className="bg-slate-700" />

      {/* Section for Current Tests */}
      <section>
        <h3 className="text-white text-2xl font-semibold mb-4">
          Current Tests
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {currentTests.length > 0 ? (
            currentTests.map((test) => <TestCard key={test.id} test={test} />)
          ) : (
            <p className="text-white">No pending tests at the moment.</p>
          )}
        </div>
      </section>

      {previousTests.length > 0 && (
        <>
          <Separator className="bg-slate-700" />

          <section>
            <h3 className="text-white text-2xl font-semibold mb-4">
              Previous Tests
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-28 gap-10">
              {previousTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
