import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please return to the dashboard.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you are looking for does not exist.";
    } else if (error.status === 500) {
      title = "Server Error";
      message = "An internal server error occurred. Please try again.";
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Oops! {title}</h1>
        <p className="text-gray-500 mb-8">{message}</p>
        <Link to="/">
          <Button className="rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] gap-2">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
