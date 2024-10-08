"use client";

import Image from 'next/image';
import { useState } from 'react';
import styles from './styles.module.css';

type Aeroportos = {
  [key: string]: [number, number, number];
};

const aeroportos: Aeroportos = {
  BSB: [44.74, 9.42, 0],
  CNF: [61.24, 12.98, 106.39],
  GIG: [37.28, 7.85, 320.75],
  IGU: [65.04, 13.66, 189.38],
};

type Resultado = {
  custoManobraTotal: number;
  custoEstacionamentoTotal: number;
  saving: number;
  resposta: string;
};

const calcularCustos = (aeroporto: string, horas: number): Resultado => {
  const [custoManobra, custoEstacionamento, custoReboque] = aeroportos[aeroporto];

  const custoManobraTotal = horas <= 3 ? 0 : custoManobra * horas;
  const custoEstacionamentoTotal = custoEstacionamento * horas + custoReboque * 2;
  const saving = custoManobraTotal - custoEstacionamentoTotal;

  const resposta = saving <= 0 ? "PERMANECER EM POSIÇÃO DE MANOBRAS" : "MOVIMENTAR PARA POSIÇÃO DE ESTACIONAMENTO";

  return { custoManobraTotal, custoEstacionamentoTotal, saving, resposta };
};

export default function AirportCosts() {
  const [erro, setErro] = useState<string>('');
  const [horas, setHoras] = useState<string>('');
  const [aeroporto, setAeroporto] = useState<string>('');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const handleCalcular = () => {
    try {
      const horasInt = parseInt(horas);
      if (isNaN(horasInt) || horasInt < 0) {
        throw new Error('As horas devem ser um valor inteiro positivo.');
      }

      if (!aeroporto) {
        throw new Error('Selecione um aeroporto.');
      }

      const { custoManobraTotal, custoEstacionamentoTotal, saving, resposta } = calcularCustos(aeroporto, horasInt);

      setResultado({ custoManobraTotal, custoEstacionamentoTotal, saving, resposta });
      setErro('');
    } catch (e) {
      setErro((e as Error).message);
      setResultado(null);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            fill
            objectFit="contain"
            alt="Product Image"
            src="https://drive.google.com/uc?export=view&id=1Q8U7ac6WbhI_bNGmdK0D6DL12tzoTimz"
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputContainer}>
            <label className={`${styles.label} ${aeroporto ? styles.labelShrink : ''}`} htmlFor="aeroporto">
              Selecione o Aeroporto:
            </label>
            <select
              required
              id="aeroporto"
              value={aeroporto}
              className={styles.input}
              onChange={(e) => setAeroporto(e.target.value)}
            >
              <option value=""></option>
              {Object.keys(aeroportos).map((aero) => (
                <option key={aero} value={aero}>{aero}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputContainer}>
            <label className={`${styles.label} ${horas ? styles.labelShrink : ''}`} htmlFor="horas">
              Horas em Solo (INT):
            </label>
            <input
              required
              id="horas"
              type="text"
              value={horas}
              className={styles.input}
              placeholder={horas && "Ex: 5"}
              onChange={(e) => setHoras(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
        </div>

        <button onClick={handleCalcular} className={styles.button}>Calcular</button>

        {erro && <p className={styles.error}>{erro}</p>}

        {resultado && (
          <div className={`${styles.resultado} ${styles.fadeIn} ${styles.containerExpandActive}`}>
            <table className={styles.resultTable}>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Custo de Manobra</td>
                  <td>{resultado.custoManobraTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Custo de Estacionamento</td>
                  <td>{resultado.custoEstacionamentoTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Economia</td>
                  <td>{resultado.saving.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <p className={resultado.resposta.includes('PERMANECER') ? styles.red : styles.green}>
              {resultado.resposta}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
