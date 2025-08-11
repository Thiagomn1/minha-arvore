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
    <div>
      {/* Mobile: Dropdown */}
      <div className="block md:hidden">
        <select
          className="select select-bordered w-full bg-green-600 text-white"
          value={active}
          onChange={(e) => onChange(e.target.value)}
        >
          {categories.map((c) => (
            <option className="bg-white text-black" key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden md:flex tabs tabs-boxed justify-center">
        {categories.map((c) => {
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`tab transition-all duration-200 rounded-md px-4 mx-2 ${
                isActive ? "tab-active bg-green-600 text-white" : "bg-gray-100"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
