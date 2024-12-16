"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTestIdentifierData } from "@/services/test";
import * as storageUtils from "@/utils/storage";
import { TestData } from "@/types/test";
import { useAuth } from "@/context/auth-provider";

interface UrlProps {
  testId: string;
}

export const TestLink = ({ testId }: UrlProps) => {
  const router = useRouter();
  const { isAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const testIdentifier = testId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTestIdentifierData(testIdentifier);
        if (data) {
          const completeTestData: TestData = {
            id: data.id ?? "",
            module_api: data.module_api ?? "",
            company_name: data.company_name ?? "",
            test_identifier: data.test_identifier ?? testIdentifier,
            module_name: data.module_name ?? "",
            status: data.status,
          };
          storageUtils.setTestData(completeTestData);
          router.push(`/test/${completeTestData.module_name}/start`);
        } else {
          setError(true); // Set error if the test is inactive or null
        }
      } catch (err) {
        console.error("Error fetching test data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (isAuth) {
      fetchData();
    } else {
      router.push(`/login?test_identifier=${testIdentifier}`);
    }
  }, [isAuth, testIdentifier, router]);

  if (!isAuth) return null;
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-white text-4xl">Processing...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-4xl text-red-100">Something went wrong!</h1>
      </div>
    );
  }

  return null;
};
