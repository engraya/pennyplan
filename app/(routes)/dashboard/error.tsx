"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
      <p className="text-gray-500 text-center max-w-md">
        An error occurred while loading this page. Please try again.
      </p>
      <Button onClick={reset} className="rounded-full">Try Again</Button>
    </div>
  );
}
