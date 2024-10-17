import React, { useState } from 'react';
import styles from './styles.module.css'; // Importa o CSS como módulos

const AirportApp = () => {
    const [horas, setHoras] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const patios = {
        BSB: ['123', '124', '125'],
        CNF: ['234', '235', '236'],
        GIG: ['345', '356', '367'],
        IGU: ['456', '467', '489'],
    };

    const [aeroportoSelecionado, setAeroportoSelecionado] = useState('');
    const [posicoesPatio, setPosicoesPatio] = useState<string[]>([]);

    const handleAeroportoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAeroporto = e.target.value;
        setAeroportoSelecionado(selectedAeroporto);
        setPosicoesPatio(patios[selectedAeroporto] || []);
    };

    const calcularCusto = () => {
        const valor = parseInt(horas, 10);
        if (valor > 0) {
            setMensagem('MOVIMENTAR PARA POSIÇÃO DE ESTACIONAMENTO');
            setMostrarRegistro(true);
        } else {
            setMensagem('PERMANECER EM POSIÇÃO DE MANOBRAS');
            setMostrarRegistro(false);
        }
    };

    const registrarAcao = () => {
        // Integração com Google Sheets pode ser implementada aqui.
        alert('Ação registrada com sucesso!');
    };

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h2>Selecione o Aeroporto</h2>
                <select id="aeroportoSelect" className={styles.input} onChange={handleAeroportoChange}>
                    <option value="">Selecione o Aeroporto</option>
                    <option value="BSB">BSB - Brasília</option>
                    <option value="CNF">CNF - Confins</option>
                    <option value="GIG">GIG - Galeão</option>
                    <option value="IGU">IGU - Foz do Iguaçu</option>
                </select>

                {/* Tabela de Pátios */}
                {posicoesPatio.length > 0 && (
                    <div className={styles.containerExpand}>
                        <table className={styles.resultTable}>
                            <thead>
                                <tr>
                                    <th>Posições de Pátio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posicoesPatio.map((posicao, index) => (
                                    <tr key={index}>
                                        <td>{posicao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className={styles.inputContainer}>
                    <label className={styles.label}>Insira a quantidade de horas</label>
                    <input
                        type="number"
                        id="horasInput"
                        className={styles.input}
                        value={horas}
                        onChange={(e) => setHoras(e.target.value)}
                        placeholder="Horas"
                    />
                </div>

                <button className={styles.button} onClick={calcularCusto}>Calcular</button>

                {/* Resultado */}
                <div className={styles.resultado}>{mensagem}</div>

                {/* Botão para registrar ação */}
                {mostrarRegistro && (
                    <button className={styles.button} onClick={registrarAcao}>
                        Registrar Ação
                    </button>
                )}
            </div>
        </div>
    );
};

export default AirportApp;
