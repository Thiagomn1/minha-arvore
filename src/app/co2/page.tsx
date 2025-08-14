"use client";
import Button from "@/components/ui/Button";
import { calcularEmissaoCO2 } from "@/lib/calculoCo2";
import { useState } from "react";

export default function CO2() {
  const [energiaEletricaKwh, setEnergiaEletricaKwh] = useState(1);
  const [gasKg, setGasKg] = useState(1);
  const [transporteKm, setTransporteKm] = useState(1);
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="card w-full max-w-md bg-base-100 shadow-lg border border-green-200">
        <div className="card-body">
          <h2 className="card-title text-green-700 text-3xl justify-center">
            🌿 Calculadora de Emissão de CO₂
          </h2>

          <div>
            <label className="label">
              <span className="label-text text-green-800 font-medium">
                Consumo de energia elétrica (kWh/mês)
              </span>
            </label>
            <input
              type="number"
              value={energiaEletricaKwh}
              onChange={(e) => setEnergiaEletricaKwh(Number(e.target.value))}
              className="input input-bordered w-full border-green-300 focus:border-green-500"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-green-800 font-medium">
                Consumo de gás (kg/mês)
              </span>
            </label>
            <input
              type="number"
              value={gasKg}
              onChange={(e) => setGasKg(Number(e.target.value))}
              className="input input-bordered w-full border-green-300 focus:border-green-500"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-green-800 font-medium">
                Transporte terrestre (km/mês)
              </span>
            </label>
            <input
              type="number"
              value={transporteKm}
              onChange={(e) => setTransporteKm(Number(e.target.value))}
              className="input input-bordered w-full border-green-300 focus:border-green-500"
            />
          </div>

          <div className="card-actions mt-4">
            <Button
              variant="success"
              fullWidth
              onClick={() =>
                setResult(
                  calcularEmissaoCO2({
                    energiaEletricaKwh: 1,
                    gasKg: 1,
                    transporteKm: 1,
                  }).toFixed(2)
                )
              }
            >
              Calcular
            </Button>
          </div>

          {result && (
            <div className="alert alert-success mt-4 text-center">
              <span>
                🌱 Emissão mensal estimada: <strong>{result} kg CO₂</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
