import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  trigger: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: ButtonProps["variant"];
  size?: "sm" | "md" | "lg" | "xl";
  showClose?: boolean;
  footer?: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  trigger,
  title,
  description,
  children,
  variant = "default",
  size = "md",
  showClose = true,
  footer,
  className,
  onOpenChange,
}) => {
  // Define size classes for the modal
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={cn(
          sizeClasses[size],
          "duration-300",
          className
        )}
      >
        {showClose && (
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => onOpenChange?.(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}

        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-xl font-semibold leading-none tracking-tight">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="relative">
          {children}
        </div>

        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Example usage of the Footer component for reusability
export const ModalFooter: React.FC<{
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: ButtonProps["variant"];
}> = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmVariant = "default",
}) => {
  return (
    <>
      {onCancel && (
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      )}
    </>
  );
};

export default Modal;