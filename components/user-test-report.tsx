interface TestReportProps {
  testId: number | string;
}

export const UserTestReport = ({ testId }: TestReportProps) => {
  return (
    <div className="m-auto bg-red-600/40 p-6 w-1/2 rounded-2xl">
      No Details Available for Test: {testId}
    </div>
  );
};
