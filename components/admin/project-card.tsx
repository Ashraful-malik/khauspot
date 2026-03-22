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

export type ProjectType = {
  project: {
    id: number;
    name: string;
    location: string;
  };
  key: number;
};
function ProjectCard({ project }: ProjectType) {
  const showToaster = () => {
    console.log("working");
    toast.success("Event has not been created");
  };
  return (
    <div className="bg-white rounded-xl shadow-xs border p-4 space-y-3">
      {/* Title */}
      <div>
        <h2 className="font-semibold text-lg">{project.name}</h2>
        <p className="text-sm text-gray-500">{project.location}</p>
      </div>

      {/* Map Link */}
      <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
        📍 View on Map
      </button>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          className="flex-1 bg-green-500 text-white py-1.5 rounded-lg hover:bg-green-600"
          onClick={showToaster}
        >
          Approve
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex-1 bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600">
              Reject
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Deleting Stall</AlertDialogTitle>
              <AlertDialogDescription>
                Are your Sure you want to delete this stall.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
export default ProjectCard;
