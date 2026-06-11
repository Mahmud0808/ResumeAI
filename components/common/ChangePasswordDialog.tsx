"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  changePassword,
  getPasswordStatus,
} from "@/lib/actions/auth.actions";

const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Discover whether this account already has a password (credentials) or is
  // OAuth-only and is setting one for the first time.
  useEffect(() => {
    if (!open) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setHasPassword(null);
    getPasswordStatus()
      .then((res) => setHasPassword(res.hasPassword))
      .catch(() => setHasPassword(true));
  }, [open]);

  const title = hasPassword === false ? "Set a password" : "Change password";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter the same password.",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    setIsLoading(true);
    const result = await changePassword({
      currentPassword: hasPassword ? currentPassword : undefined,
      newPassword,
    });
    setIsLoading(false);

    if (!result.success) {
      toast({
        title: "Could not update password",
        description: result.error,
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    toast({
      title: hasPassword ? "Password changed" : "Password set",
      description: "Your password has been updated.",
      className: "bg-white",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {hasPassword === false
              ? "Add a password so you can also sign in with email."
              : "Enter your current password and choose a new one."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {hasPassword !== false && (
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Current password
              </label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              New password
            </label>
            <Input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Confirm new password
            </label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || hasPassword === null}
              className="w-full bg-primary-700 text-white hover:bg-primary-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                title
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
