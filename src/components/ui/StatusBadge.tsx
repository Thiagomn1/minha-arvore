import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  variant?: "order" | "user" | "product";
  className?: string;
}

const orderStatusMap: Record<string, string> = {
  Plantado: "badge-success",
  "Em Processo": "badge-warning",
  Pendente: "badge-ghost",
};

const userRoleMap: Record<string, string> = {
  Admin: "badge-primary",
  User: "badge-ghost",
};

const productStatusMap: Record<string, string> = {
  Disponível: "badge-success",
  Indisponível: "badge-error",
};

export default function StatusBadge({
  status,
  variant = "order",
  className,
}: StatusBadgeProps) {
  let badgeClass = "badge-ghost";

  if (variant === "order") {
    badgeClass = orderStatusMap[status] || "badge-ghost";
  } else if (variant === "user") {
    badgeClass = userRoleMap[status] || "badge-ghost";
  } else if (variant === "product") {
    badgeClass = productStatusMap[status] || "badge-ghost";
  }

  return <span className={cn("badge", badgeClass, className)}>{status}</span>;
}
