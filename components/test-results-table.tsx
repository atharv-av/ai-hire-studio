"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import axios from "axios";

interface ResultItem {
  id: string;
  company_name: string;
  module_name: string;
  total_score: number;
  model_prediction: string;
  created_at: string;
  user_id: string;
}

export const TestResultsTable: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = async () => {
    const storedUserData = localStorage.getItem("user_data");
    let userData;
    if (storedUserData) {
      userData = JSON.parse(storedUserData); // Converts JSON string back to an object
    }
    // if (!user) {
    //   setError("User not authenticated");
    //   setLoading(false);
    //   return;
    // }

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/score_history_data/${userData.id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      setResults(data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <>
      <div className="w-full px-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-white">Results</h1>

          {loading && (
            <div className="flex h-24 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-white"></div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {results.length > 0 ? (
            <div className="rounded-md">
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-800 transition-colors">
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Test ID
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Company Name
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Module Name
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Technical Score
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Steadiness Score
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Attempted At
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-slate-700 transition-colors hover:bg-[#0f0f0f]"
                      >
                        <TableCell className="p-4 align-middle text-gray-300">
                          {item.id}
                        </TableCell>
                        <TableCell className="p-4 align-middle text-gray-300">
                          {item.company_name}
                        </TableCell>
                        <TableCell className="p-4 align-middle text-gray-300">
                          {item.module_name}
                        </TableCell>
                        <TableCell className="p-4 align-middle font-extrabold text-white">
                          {item.total_score}
                        </TableCell>
                        <TableCell className="p-4 font-extrabold align-middle text-white">
                          {item.model_prediction}
                        </TableCell>
                        <TableCell className="p-4 align-middle text-gray-300">
                          {new Date(item.created_at).toDateString()}
                        </TableCell>
                        <TableCell className="p-4 align-middle">
                          <Link
                            href={`/results/${item.id}`}
                            className="text-sm font-medium text-blue-500 hover:underline"
                          >
                            View Details
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-gray-800 bg-[#000e41]">
              <p className="text-sm text-gray-400">
                No data found. If you have just given the test, your data must
                be processing.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
