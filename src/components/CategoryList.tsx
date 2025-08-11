import { Category } from "../types/ProductTypes";

export default function CategoryList({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (categoryId: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {categories.map((c: Category) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`px-3 py-1 rounded ${
            active === c.id ? "bg-green-600 text-white" : "bg-gray-100"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
