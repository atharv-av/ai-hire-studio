"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { copyToClipboard } from "@/utils/helpers";
import { getTestsList, updateTestStatus } from "@/services/test";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, FileText } from "lucide-react";

interface AssessmentRow {
  id: string;
  module_name: string;
  test_identifier: string;
  status: string;
  created_at: string;
}

export const AssessmentsTable: React.FC = () => {
  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [loadingID, setLoadingID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const corpUserData =
    typeof window !== "undefined"
      ? localStorage.getItem("corp_user_data")
      : null;
  const parsedUserData = corpUserData ? JSON.parse(corpUserData) : null;
  const id = parsedUserData?.id || "";

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await getTestsList(id);
        setRows(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch test data",
        });
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id, toast]);

  const handleCopyLink = (testIdentifier: string) => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/tk/${testIdentifier}`;
    copyToClipboard(
      link,
      () =>
        toast({
          title: "Success",
          description: "Link copied to clipboard",
        }),
      () =>
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link",
        })
    );
  };

  const handleChangeStatus = async (testIdentifier: string) => {
    try {
      setLoadingID(testIdentifier);
      await updateTestStatus(id, testIdentifier);
      toast({
        title: "Success",
        description: "Test status updated successfully",
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.test_identifier === testIdentifier
            ? {
                ...row,
                status: row.status === "active" ? "inactive" : "active",
              }
            : row
        )
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update test status",
      });
      console.log(error);
    } finally {
      setLoadingID(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-gray-800 bg-[#000e41]">
        <p className="text-sm text-gray-400">
          No assessments found. Create a new test to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 lg:w-4/5 mx-auto bg-black/70">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800 transition-colors">
              <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                Test ID
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                Module Name
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                Link
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                View Result
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                Status
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-slate-700 transition-colors hover:bg-[#0f0f0f]"
              >
                <TableCell className="p-4 align-middle text-gray-300">
                  {row.id}
                </TableCell>
                <TableCell className="p-4 align-middle text-gray-300">
                  {row.module_name}
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyLink(row.test_identifier)}
                    className="text-gray-300 rounded-full hover:text-white hover:bg-gray-800"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-blue-500 hover:text-blue-400 rounded-full hover:bg-gray-800"
                  >
                    <Link href={`/assessments/${row.test_identifier}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Results
                    </Link>
                  </Button>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={
                          row.status === "active" ? "destructive" : "default"
                        }
                        size="sm"
                        disabled={loadingID === row.test_identifier}
                        className={
                          row.status === "active"
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full"
                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-full"
                        }
                      >
                        {loadingID === row.test_identifier ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {row.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0f0f0f] border-none text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Update Test Status</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to{" "}
                          {row.status === "active" ? "deactivate" : "activate"}{" "}
                          this test? This action can be reversed later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-white border-none hover:text-slate-400">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleChangeStatus(row.test_identifier)
                          }
                          className="bg-blue-600 rounded-2xl text-white hover:bg-blue-500"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell className="p-4 align-middle text-gray-300">
                  {new Date(row.created_at).toDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
