import { TestLink } from "@/components/test-link";
import React from "react";

export default async function TestLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const slug = (await params).id
  return <TestLink testId={slug} />;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
