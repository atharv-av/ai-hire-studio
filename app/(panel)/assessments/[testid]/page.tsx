import { CorporateTestReport } from "@/components/corporate-test-report";

// export default function TestResultPage({
//   params,
// }: {
//   params: { testid: string };
// }) {
//   return <TestResultsTable testId={params.testid} />;
// }

export default function TestResultPage() {
  return <CorporateTestReport />;
}

export async function generateStaticParams() {
  return [{ testid: "1" }, { testid: "2" }, { testid: "3" }];
}
