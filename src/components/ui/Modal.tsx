import { ReactNode } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  actions?: ReactNode;
  closeOnBackdrop?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  actions,
  closeOnBackdrop = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <dialog open className="modal" onClick={closeOnBackdrop ? onClose : undefined}>
      <div
        className={cn("modal-box", sizeClasses[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        {children}
        {actions && <div className="modal-action">{actions}</div>}
        {!actions && (
          <div className="modal-action">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        )}
      </div>
    </dialog>
  );
}
