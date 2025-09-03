"use client";

import { useState } from "react";
import Image from "next/image";
import {
  GlobeAmericasIcon,
  CalculatorIcon,
  BoltIcon,
  FireIcon,
  BeakerIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import Button from "@/components/ui/Button";

const fatores = {
  energiaEletrica: 0.000051, // ton CO2 / kWh (Brasil média aproximada)
  glp: 0.0029, // ton CO2 / kg
  gasNatural: 0.0019, // ton CO2 / m³
  transporteTerrestre: 0.000192, // ton CO2 / km (aprox. 192 g/km carro médio)
};

export default function CO2() {
  const [energiaEletricaKwh, setEnergiaEletricaKwh] = useState(0);
  const [glpKg, setGlpKg] = useState(0);
  const [gasNaturalM3, setGasNaturalM3] = useState(0);
  const [kmRodados, setKmRodados] = useState(0);
  const [resultado, setResultado] = useState<string | null>(null);

  const calcular = () => {
    const emissaoEnergia = energiaEletricaKwh * fatores.energiaEletrica * 12;
    const emissaoGLP = glpKg * fatores.glp * 12;
    const emissaoGas = gasNaturalM3 * fatores.gasNatural * 12;
    const emissaoTransporte = kmRodados * fatores.transporteTerrestre * 12;

    const total = emissaoEnergia + emissaoGLP + emissaoGas + emissaoTransporte;

    // estimativa de árvores (uma árvore captura aprox. 0.165 tCO₂/ano)
    const arvoresNecessarias = Math.ceil(total / 0.165);

    setResultado(
      `Sua emissão estimada é de ${total.toFixed(
        2
      )} toneladas de CO₂ por ano 🌍. 
      Seriam necessárias cerca de ${arvoresNecessarias} árvores para compensar essa emissão. 🌳`
    );
  };

  return (
    <div className=" min-h-screen flex flex-col mb-4">
      {/* Hero Section */}
      <div className="hero bg-green-50 py-12 px-6">
        <div className="hero-content flex-col lg:flex-row gap-8 max-w-5xl">
          <div>
            <h1 className="text-4xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <GlobeAmericasIcon className="w-10 h-10 text-green-700" />
              Compense sua emissão de CO₂
            </h1>
            <p className="text-lg text-green-700 leading-relaxed">
              Calcule suas emissões de CO₂ a partir do consumo de energia, gás,
              transporte e outras atividades, e descubra quantas árvores seriam
              necessárias para compensar sua pegada de carbono.
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
      <div className="max-w-5xl flex flex-wrap gap-6 mx-auto p-6 justify-center">
        {/* Energia Elétrica */}
        <div className="card shadow-lg w-96 h-64">
          <div className="card-body bg-base-100">
            <h2 className="card-title text-sky-900">
              <BoltIcon className="w-8 h-8 text-sky-700" />
              Energia Elétrica da Rede
            </h2>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Consumo mensal</span>
              </div>
              <input
                type="number"
                value={energiaEletricaKwh}
                onChange={(e) => setEnergiaEletricaKwh(Number(e.target.value))}
                className="input input-bordered w-full"
              />
              <div className="label">
                <span className="label-text-alt">kWh por mês</span>
              </div>
            </label>
          </div>
        </div>

        {/* GLP */}
        <div className="card shadow-lg w-96 h-64">
          <div className="card-body bg-base-100">
            <h2 className="card-title text-sky-900">
              <FireIcon className="w-8 h-8 text-orange-600" />
              Gás GLP (Botijão)
            </h2>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Consumo mensal</span>
              </div>
              <input
                type="number"
                value={glpKg}
                onChange={(e) => setGlpKg(Number(e.target.value))}
                className="input input-bordered w-full"
              />
              <div className="label">
                <span className="label-text-alt">Kg por mês</span>
              </div>
            </label>
          </div>
        </div>

        {/* Gás Natural */}
        <div className="card shadow-lg w-96 h-64">
          <div className="card-body bg-base-100">
            <h2 className="card-title text-sky-900">
              <BeakerIcon className="w-8 h-8 text-green-600" />
              Gás Natural (Encanado)
            </h2>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Consumo mensal</span>
              </div>
              <input
                type="number"
                value={gasNaturalM3}
                onChange={(e) => setGasNaturalM3(Number(e.target.value))}
                className="input input-bordered w-full"
              />
              <div className="label">
                <span className="label-text-alt whitespace-nowrap">
                  m³ por mês
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Transporte Terrestre */}
        <div className="card shadow-lg w-96 h-64">
          <div className="card-body bg-base-100">
            <h2 className="card-title text-sky-900">
              <TruckIcon className="w-8 h-8 text-emerald-600" />
              Transporte Terrestre
            </h2>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Quilômetros rodados</span>
              </div>
              <input
                type="number"
                value={kmRodados}
                onChange={(e) => setKmRodados(Number(e.target.value))}
                className="input input-bordered w-full"
              />
              <div className="label">
                <span className="label-text-alt">Km por mês</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Botão Calcular */}
      <div className="flex flex-col items-center">
        <Button variant="success" onClick={calcular} className="gap-2 px-6">
          <CalculatorIcon className="w-6 h-6" />
          Calcular Emissão
        </Button>

        {/* Resultado */}
        {resultado && (
          <div className="alert alert-success shadow-lg mt-6 max-w-3xl">
            <span className="text-lg font-bold whitespace-pre-line">
              {resultado}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
