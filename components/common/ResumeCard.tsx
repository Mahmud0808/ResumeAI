"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { deleteResume } from "@/lib/actions/resume.actions";
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MiniResumePreview from "./MiniResumePreview";

const ResumeCard = ({
  resume,
  refreshResumes,
}: {
  resume: any;
  refreshResumes: () => void;
}) => {
  if (!resume) {
    return (
      <div className="!bg-slate-200/30 relative aspect-[1/1.2] rounded-xl shadow-md flex flex-col skeleton">
        <div className="flex-1"></div>
        <div className="border-0 p-3 flex justify-between bg-white/40 rounded-b-xl">
          ‎{" "}
        </div>
      </div>
    );
  }

  const router = useRouter();
  const pathname = usePathname();
  const myResume = JSON.parse(resume);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDelete = async () => {
    setIsLoading(true);

    const result = await deleteResume(myResume.resumeId, pathname);

    setIsLoading(false);
    setOpenAlert(false);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Resume deleted successfully.",
        className: "bg-white",
      });

      refreshResumes();
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative aspect-[1/1.2] flex flex-col rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl hover:shadow-primary-700/10"
    >
      <Link
        href={"/resume/" + myResume.resumeId}
        className="flex-grow"
      >
        <div className="h-full overflow-hidden rounded-t-xl border border-b-0 border-slate-200/80 bg-white">
          <div className="h-full transition-transform duration-300 group-hover:scale-[1.03]">
            <MiniResumePreview resume={myResume} />
          </div>
        </div>
      </Link>

      <div className="border border-slate-200/80 p-3 flex justify-between bg-white rounded-b-xl">
        <h2 className="text-sm font-medium text-slate-700 mr-4 block whitespace-nowrap overflow-hidden text-ellipsis">
          {myResume.title}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer" color="#000" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                router.push("/my-resume/" + myResume.resumeId + "/edit")
              }
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                router.push("/resume/" + myResume.resumeId)
              }
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenAlert(false)}
              disabled={isLoading}
              className="no-focus"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Deleting
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ResumeCard;
