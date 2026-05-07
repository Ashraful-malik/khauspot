"use client";
import { SuggestedStall } from "@/lib/validators/suggestStall.validator";
import Link from "next/link";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
import { toast } from "sonner";
import {
  useApproveSuggestion,
  useRejectSuggestion,
} from "@/hooks/tanstack/useDashboard";
import { Input } from "../ui/input";
import { useState } from "react";

function ProjectList({ suggestions }: { suggestions: SuggestedStall[] }) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Pending Stall Suggestions</h1>
      <div
        className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3 
      "
      >
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion._id} stall={suggestion} />
        ))}
      </div>
    </div>
  );
}
export default ProjectList;

function SuggestionCard({ stall }: { stall: SuggestedStall }) {
  const lat = stall?.location?.coordinates[1];
  const lng = stall?.location?.coordinates[0];
  const [adminNote, setAdminNote] = useState<string | undefined>("");

  const showToaster = (message?: string) => {
    toast.success(message || "Stall approved successfully");
  };
  const showError = (message?: string) => {
    toast.error(message || "Something went wrong");
  };

  const { mutate: approve, isPending: isApprovePending } =
    useApproveSuggestion();
  const { mutate: reject, isPending: isRejectPending } = useRejectSuggestion({
    adminNote,
  });

  const handleApprove = () => {
    if (stall._id) {
      approve(stall._id, {
        onSuccess(data) {
          showToaster("stall approved successfully");
        },
        onError(error) {
          showError(error.message);
        },
      });
    }
  };
  const handleReject = () => {
    if (stall._id) {
      reject(stall._id, {
        onSuccess(data) {
          showToaster("stall rejected successfully");
        },
        onError(error) {
          showError(error.message);
        },
      });
    }
  };
  const pendingClass = isRejectPending
    ? "animate-pulse opacity-20 bg-red-500/35"
    : isApprovePending
      ? "animate-pulse  bg-green-500/35"
      : "";
  return (
    <div
      className={`${pendingClass} bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition`}
    >
      <div className="h-40 w-full bg-gray-100 overflow-hidden">
        {stall.photos?.[0]?.url ? (
          <img
            src={stall.photos[0].url}
            alt={stall.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* 🏷 Title + Category */}
        <div>
          <h2 className="font-semibold text-lg text-gray-900">{stall.name}</h2>
          <p className="text-xs text-gray-500">{stall.address}</p>
          <p className="text-sm text-gray-500 capitalize rounded-full px-2 bg-primary/20 inline-block mt-2">
            {stall.category}
          </p>
        </div>

        {/* 📍 Location */}
        <Link
          href={`map?lat=${lat}&lng=${lng}`}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          📍 View on Map
        </Link>

        <p className="text-xs text-gray-400">
          Suggested on{" "}
          {stall.createdAt
            ? new Date(stall.createdAt).toLocaleDateString()
            : "Unknown"}
        </p>

        {/* ⚡ Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
          >
            Approve
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                Reject
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Stall</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reject the stall suggestion. Are you sure?
                  {/* type reason for rejection */}
                  <Input
                    type="text"
                    className="mt-4"
                    placeholder="Reason for rejection"
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReject}>
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
