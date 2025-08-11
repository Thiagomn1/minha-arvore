"use client";
import { useState } from "react";

function calcCO2(people: number) {
  // very rough: avg emissions per person/year Brazil ~2.1 tCO2 (example)
  return (people * 2.1).toFixed(2);
}

export default function CO2() {
  const [people, setPeople] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Calculadora de emissão de CO₂</h2>
      <div className="max-w-md">
        <label className="block">Número de pessoas</label>
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => setResult(calcCO2(people))}
          className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
        >
          Calcular
        </button>
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            Emissão anual estimada: <strong>{result} tCO₂</strong>
          </div>
        )}
      </div>
    </div>
  );
}
