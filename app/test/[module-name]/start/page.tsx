import { StartTest } from "@/components/start-test";

export default function StartTestPage() {
  return <StartTest />;
}

export async function generateStaticParams() {
  const modules = [
    { "module-name": "React" },
    { "module-name": "MERN Stack" },
    { "module-name": "Machine Learning" },
    { "module-name": "Human Resource" },
  ];

  return modules.map((module) => ({
    "module-name": module["module-name"],
  }));
}
