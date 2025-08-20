"use client";

import { useState } from "react";
import Image from "next/image";
import {
  GlobeAmericasIcon,
  CalculatorIcon,
  BoltIcon,
  FireIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";

const fatores = {
  energiaEletrica: 0.000051, // ton CO2 / kWh (exemplo Brasil média)
  glp: 0.0029, // ton CO2 / kg
  gasNatural: 0.0019, // ton CO2 / m³
};

export default function CO2() {
  const [energiaEletricaKwh, setEnergiaEletricaKwh] = useState(0);
  const [glpKg, setGlpKg] = useState(0);
  const [gasNaturalM3, setGasNaturalM3] = useState(0);
  const [resultado, setResultado] = useState<string | null>(null);

  const calcular = () => {
    const emissaoEnergia = energiaEletricaKwh * fatores.energiaEletrica * 12;
    const emissaoGLP = glpKg * fatores.glp * 12;
    const emissaoGas = gasNaturalM3 * fatores.gasNatural * 12;

    const total = emissaoEnergia + emissaoGLP + emissaoGas;

    setResultado(
      `Sua emissão estimada é de ${total.toFixed(
        2
      )} toneladas de CO₂ por ano. 🌍`
    );
  };

  return (
    <div className="bg-green-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="hero bg-green-100 py-12 px-6">
        <div className="hero-content flex-col lg:flex-row gap-8 max-w-5xl">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <GlobeAmericasIcon className="w-10 h-10 text-green-700" />
              Compense sua emissão de CO₂
            </h1>
            <p className="text-lg text-green-700 leading-relaxed">
              Calcule suas emissões de CO₂ a partir do consumo de energia, gás e
              outras atividades, e descubra quantas árvores seriam necessárias
              para compensar sua pegada de carbono.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/mudaco2.jpeg"
              alt="Natureza e árvores"
              width={400}
              height={300}
              className="rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Calculadora */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Energia Elétrica */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="bg-sky-900 text-white px-4 py-2 font-bold">
            ENERGIA ELÉTRICA DA REDE
          </div>
          <div className="grid grid-cols-3 bg-teal-600 text-white p-6">
            <div className="flex justify-center items-center">
              <BoltIcon className="w-16 h-16" />
            </div>
            <div className="col-span-2 flex flex-col justify-center">
              <p className="font-semibold mb-2">Atividade</p>
              <label className="flex items-center gap-2 border-b border-white/50 pb-2">
                Consumo de Energia Elétrica
                <input
                  type="number"
                  value={energiaEletricaKwh}
                  onChange={(e) =>
                    setEnergiaEletricaKwh(Number(e.target.value))
                  }
                  className="text-black px-2 py-1 rounded w-28"
                />
                <span>KWh por mês</span>
              </label>
            </div>
          </div>
        </div>

        {/* GLP */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="bg-sky-900 text-white px-4 py-2 font-bold">
            GLP (GÁS LIQUEFEITO DE PETRÓLEO – BOTIJÃO)
          </div>
          <div className="grid grid-cols-3 bg-teal-600 text-white p-6">
            <div className="flex justify-center items-center">
              <FireIcon className="w-16 h-16" />
            </div>
            <div className="col-span-2 flex flex-col justify-center">
              <p className="font-semibold mb-2">Atividade</p>
              <label className="flex items-center gap-2 border-b border-white/50 pb-2">
                Consumo de gás de cozinha
                <input
                  type="number"
                  value={glpKg}
                  onChange={(e) => setGlpKg(Number(e.target.value))}
                  className="text-black px-2 py-1 rounded w-28"
                />
                <span>Kg por mês</span>
              </label>
            </div>
          </div>
        </div>

        {/* Gás Natural */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="bg-sky-900 text-white px-4 py-2 font-bold">
            GÁS NATURAL (GÁS DE ENCANAMENTO)
          </div>
          <div className="grid grid-cols-3 bg-teal-600 text-white p-6">
            <div className="flex justify-center items-center">
              <BeakerIcon className="w-16 h-16" />
            </div>
            <div className="col-span-2 flex flex-col justify-center">
              <p className="font-semibold mb-2">Atividade</p>
              <label className="flex items-center gap-2 border-b border-white/50 pb-2">
                Gás de cozinha ou aquecimento de água
                <input
                  type="number"
                  value={gasNaturalM3}
                  onChange={(e) => setGasNaturalM3(Number(e.target.value))}
                  className="text-black px-2 py-1 rounded w-28"
                />
                <span>Metros cúbicos por mês</span>
              </label>
            </div>
          </div>
        </div>

        {/* Botão Calcular */}
        <div className="flex justify-center">
          <button
            onClick={calcular}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl shadow-md font-semibold"
          >
            <CalculatorIcon className="w-6 h-6" />
            Calcular Emissão
          </button>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow text-center text-green-800 font-bold text-xl">
            {resultado}
          </div>
        )}
      </div>
    </div>
  );
}
