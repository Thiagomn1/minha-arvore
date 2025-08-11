import React from "react";
import naturebg from "../assets/naturebg.webp";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <>
      <section className="relative h-screen w-full">
        <Image
          src={naturebg}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />

        <Navbar gradient />
        <div className="flex pt-32 md:pt-32 lg:py-20 xl:pt-32 xl:pb-44 h-screen">
          <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-xl mx-auto text-center lg:max-w-md xl:max-w-lg lg:mx-0">
              <h1 className="text-3xl font-bold text-white sm:text-4xl xl:text-5xl xl:leading-tight">
                Plante o <span className="text-green-400">futuro,</span> um
                passo por vez
              </h1>
              <p className="mt-8 text-base font-normal leading-7 text-gray-300 xl:pr-0 lg:px-8">
                Cada pessoa gera, em média, 4,5 toneladas de CO₂ por ano — mas
                você pode ajudar a compensar esse impacto. Compre mudas e
                escolha o local onde elas serão plantadas para ajudar a
                preservar o meio ambiente e reduzir sua pegada de carbono.
              </p>

              <div className="flex items-center justify-center mt-8 space-x-5 xl:mt-16 lg:justify-center">
                <Link
                  href="/co2"
                  title=""
                  className="inline-flex items-center justify-center px-3 py-3 text-base font-bold leading-7 text-gray-900 transition-all duration-200 
                bg-green-400 border border-transparent rounded-md sm:px-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 
                focus:ring-white hover:bg-gray-200"
                  role="button"
                >
                  Calcule seu impacto de CO₂
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
