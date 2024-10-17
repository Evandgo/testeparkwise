const SHEET_ID = '1TgwUn5S6UGLWElE3yitFpF6o7mtveF_Z1pmrgHO8vfY';
const API_KEY = 'SUA_API_KEY_AQUI';
const SHEET_NAME = 'Histórico';

const patiosPorAeroporto = {
  BSB: ['123', '124', '125'],
  CNF: ['234', '235', '236'],
  GIG: ['345', '356', '367'],
  IGU: ['456', '467', '489']
};

function mostrarPatios() {
  const aeroporto = document.getElementById("aeroportoSelect").value;
  const patioContainer = document.getElementById("patioContainer");
  const patioTableBody = document.getElementById("patioTable").getElementsByTagName('tbody')[0];

  patioTableBody.innerHTML = ""; // Limpa as posições anteriores

  if (aeroporto && patiosPorAeroporto[aeroporto]) {
    patiosPorAeroporto[aeroporto].forEach(patio => {
      const row = patioTableBody.insertRow();
      const cell = row.insertCell();
      cell.textContent = patio;
    });
    patioContainer.classList.add('containerExpandActive'); // Expande a tabela
  } else {
    patioContainer.classList.remove('containerExpandActive'); // Recolhe a tabela se nada for selecionado
  }
}

function calcularCusto() {
  const horas = document.getElementById("horasInput").value;
  const resultadoMensagem = document.getElementById("resultadoMensagem");
  const registroButton = document.getElementById("registroButton");

  if (horas === "" || isNaN(horas)) {
    resultadoMensagem.innerHTML = '<span class="red">Insira um valor válido para horas.</span>';
    registroButton.style.display = "none";
    return;
  }

  const valor = parseInt(horas);

  if (valor > 0) {
    resultadoMensagem.innerHTML = '<span class="green">MOVIMENTAR PARA POSIÇÃO DE ESTACIONAMENTO</span>';
    registroButton.style.display = "block";
  } else {
    resultadoMensagem.innerHTML = '<span class="red">PERMANECER EM POSIÇÃO DE MANOBRAS</span>';
    registroButton.style.display = "none";
  }
}

function registrarAcao() {
  const aeroporto = document.getElementById("aeroportoSelect").value;
  const horas = document.getElementById("horasInput").value;
  const resultado = horas > 0 ? 'MOVIMENTAR' : 'PERMANECER';
  const dataAtual = new Date().toLocaleDateString();

  const valores = [
    [dataAtual, aeroporto, horas, resultado]
  ];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      range: `${SHEET_NAME}!A1`,
      values: valores,
      majorDimension: 'ROWS'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('Dados registrados com sucesso:', data);
    alert('Ação registrada com sucesso!');
  })
  .catch(error => {
    console.error('Erro ao registrar ação:', error);
    alert('Erro ao registrar a ação.');
  });
}
