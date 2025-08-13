export type EmissionInput = {
  energiaEletricaKwh: number;
  gasKg: number;
  transporteKm: number;
};

export function calcularEmissaoCO2({
  energiaEletricaKwh,
  gasKg,
  transporteKm,
}: EmissionInput): number {
  const fatorEletricidade = 0.089;
  const fatorGas = 2.3;
  const fatorTransporte = 0.2;

  const emissaoEletricidade = energiaEletricaKwh * fatorEletricidade;
  const emissaoGas = gasKg * fatorGas;
  const emissaoTransporte = transporteKm * fatorTransporte;

  return emissaoEletricidade + emissaoGas + emissaoTransporte;
}
