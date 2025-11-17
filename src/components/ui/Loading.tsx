/**
 * Componentes de Loading reutilizáveis
 */

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md" }: { size?: LoadingProps["size"] }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-green-600 border-t-transparent rounded-full animate-spin`}
    />
  );
}

export function LoadingFullScreen({ text = "Carregando..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded mb-4" />
      <div className="h-6 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="h-12 bg-gray-200 rounded mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded mb-2" />
      ))}
    </div>
  );
}

export function LoadingButton() {
  return (
    <button
      disabled
      className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed flex items-center gap-2"
    >
      <LoadingSpinner size="sm" />
      <span>Processando...</span>
    </button>
  );
}

export default LoadingSpinner;
