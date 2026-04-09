"use client";
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
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";

export type ProjectType = {
  project: {
    id: number;
    name: string;
    location: string;
  };
  key: number;
};
function ProjectCard({ project }: ProjectType) {
  const lat = 12.9716;
  const lng = 77.5946;
  const showToaster = () => {
    toast.success("Project approved successfully");
  };
  return (
    <div className="bg-white rounded-xl shadow-xs border p-4 space-y-3">
      {/* Title */}
      <div>
        <h2 className="font-semibold text-lg text-foreground">
          {project.name}
        </h2>
        <p className="text-sm text-muted-foreground">{project.location}</p>
      </div>

      {/* Map Link */}
      <Link
        href={`map?lat=${lat}&lng=${lng}`}
        className="flex items-center gap-2 text-sm text-secondary hover:underline"
      >
        📍 View on Map
      </Link>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={showToaster} className="bg-accent">
          Approve
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Reject</Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Stall</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this stall? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Reject</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
export default ProjectCard;
