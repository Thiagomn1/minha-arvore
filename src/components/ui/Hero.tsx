"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../Navbar";

export default function Hero() {
  return (
    <>
      <section className="relative h-screen w-full">
        <Image
          src="/naturebg.jpg"
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
              <p className="mt-8 mx-auto max-w-lg text-base font-normal leading-7 text-white bg-white/10 backdrop-blur-xs rounded-xl p-6 shadow-lg">
                Cada pessoa gera, em média, 4,5 toneladas de CO₂ por ano — mas
                você pode ajudar a compensar esse impacto. Compre mudas e
                escolha o local onde elas serão plantadas para ajudar a
                preservar o meio ambiente e reduzir sua pegada de carbono.
              </p>

              <div className="flex items-center justify-center mt-8 space-x-5 xl:mt-16 lg:justify-center">
                <Link
                  href="/co2"
                  title=""
                  className="btn btn-success rounded-lg p-6 text-base text-black"
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
