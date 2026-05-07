"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
};

export default function CommentModal({ open, onClose, onSubmit }: Props) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
    onClose();
  };

  const handleSkip = () => {
    setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add a quick note
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Anything special about this place? (optional)
        </p>

        <Textarea
          placeholder="e.g. Amazing chai, must try samosa..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2"
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>

          <Button onClick={handleSubmit} disabled={!comment.trim()}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
