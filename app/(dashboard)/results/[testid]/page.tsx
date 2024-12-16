import { UserTestReport } from "@/components/user-test-report";

// export default function TestResultPage({
//   params,
// }: {
//   params: { testid: string };
// }) {
//   return <TestResultsTable testId={params.testid} />;
// }

export default async function TestResultPage({
  params,
}: {
  params: Promise<{ testid: string }>
}) {
  const slug = (await params).testid
  return <UserTestReport testId={slug} />;
}

export async function generateStaticParams() {
  return [{ testid: "1" }, { testid: "2" }, { testid: "3" }];
}
