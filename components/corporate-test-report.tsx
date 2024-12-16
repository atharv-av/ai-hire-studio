// "use client";

// import { getResultsList } from "@/services/test";
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// interface ResultProps {
//   testId: string;
// }

// interface TestResult {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   total_score: number;
//   model_prediction: string;
//   created_at: string;
// }

// export const TestReport = ({ testId }: ResultProps) => {
//   const [results, setResults] = useState<TestResult[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setIsLoading(true);
//         const fetchedResults = await getResultsList(testId);
//         setResults(fetchedResults);
//       } catch (error) {
//         console.error("Error fetching results:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchResults();
//   }, [testId]);

//   if (isLoading) {
//     return (
//       <div className="text-center py-4 text-gray-300">
//         <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
//         Loading results...
//       </div>
//     );
//   }

//   if (results.length === 0) {
//     return <div className="bg-red-600/40 p-5 m-auto">No results available</div>;
//   }
  
//   return (
//     <div className="rounded-md">
//       <div className="relative w-full overflow-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-b border-gray-800 transition-colors">
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 ID
//               </TableHead>
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 First Name
//               </TableHead>
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 Last Name
//               </TableHead>
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 Email
//               </TableHead>
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 Total Score
//               </TableHead>
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 Prediction
//               </TableHead>
//               <TableHead className="h-12 px-4 text-left align-middle font-medium text-gray-400">
//                 Date
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {results.map((result) => (
//               <TableRow
//                 key={result.id}
//                 className="border-b border-slate-700 transition-colors hover:bg-[#0f0f0f]"
//               >
//                 <TableCell className="p-4 align-middle text-gray-300">
//                   {result.id}
//                 </TableCell>
//                 <TableCell className="p-4 align-middle text-gray-300">
//                   {result.first_name}
//                 </TableCell>
//                 <TableCell className="p-4 align-middle text-gray-300">
//                   {result.last_name}
//                 </TableCell>
//                 <TableCell className="p-4 align-middle">
//                   {result.email}
//                 </TableCell>
//                 <TableCell className="p-4 align-middle text-gray-300">
//                   {result.total_score}
//                 </TableCell>
//                 <TableCell className="p-4 align-middle">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className={
//                       result.model_prediction === "Pass"
//                         ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
//                         : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
//                     }
//                   >
//                     {result.model_prediction}
//                   </Button>
//                 </TableCell>
//                 <TableCell className="p-4 align-middle text-gray-300">
//                   {new Date(result.created_at).toDateString()}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

import React from 'react'

export const CorporateTestReport = () => {
  return (
    <div className='m-auto bg-red-600/40 p-6 w-1/2 rounded-2xl'>No Details Available</div>
  )
}

