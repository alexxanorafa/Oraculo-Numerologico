    // ============ SISTEMA DE MENU ============
    const menuIcon = document.getElementById("menuIcon");
    const menu = document.getElementById("menu");

    menuIcon.addEventListener("click", function(e) {
        e.stopPropagation();
        menu.classList.toggle("active");
        menuIcon.classList.toggle("active");
    });

    document.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
            menu.classList.remove("active");
            menuIcon.classList.remove("active");
        }
    });

    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-3px)";
        });
        item.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0)";
        });
    });

// =========================
// Configurações e Constantes
// =========================
const frases = {
  poetico: [
    "O dia abre-se como um véu entre forças invisíveis.",
    "O tempo tece sua tapeçaria com fios de luz e sombra.",
    "Cada momento é uma folha no livro do eterno.",
    "O silêncio fala através dos números que dançam."
  ],
  oracular: [
    "Este dia fala em silêncio, mas move-se em direção à mudança.",
    "Os fios do destino entrelaçam-se num padrão ainda oculto.",
    "O futuro sussurra através do véu do presente.",
    "Forças ancestrais movem-se sob a superfície do agora."
  ],
  analitico: [
    "Predomina a tensão entre autonomia e cooperação, amplificada por potencial latente.",
    "A estrutura revela padrões de repetição com variações significativas.",
    "Análise indica convergência de fatores opostos criando equilíbrio dinâmico.",
    "Dados sugerem transição entre ciclos com preservação de elementos essenciais."
  ]
};

const significados = {
  "0": "potencial silencioso",
  "1": "força de início",
  "2": "corrente de equilíbrio", 
  "3": "voz criativa",
  "4": "estrutura oculta",
  "5": "movimento inesperado",
  "6": "vínculo discreto",
  "7": "eco interior",
  "8": "peso invisível",
  "9": "ciclo que se fecha"
};

const significadosNumerosVida = {
  1: "início e ação pioneira",
  2: "equilíbrio e parceria", 
  3: "criatividade e expressão",
  4: "estabilidade e estrutura",
  5: "mudança e liberdade",
  6: "harmonia e responsabilidade",
  7: "introspeção e sabedoria",
  8: "poder e realização",
  9: "compleção e compaixão",
  11: "iluminação e intuição",
  22: "concretização de visões grandiosas", 
  33: "amor incondicional e serviço"
};

// Polaridades ocultas
const polaridades = {
  "1": { oposto: "9", significado: "início vs fim" },
  "2": { oposto: "8", significado: "equilíbrio vs peso" },
  "3": { oposto: "7", significado: "expressão vs introspeção" },
  "4": { oposto: "6", significado: "estrutura vs vínculo" },
  "5": { oposto: "5", significado: "movimento vs movimento" }
};

// Estado dos objetos
const estadoOpcoes = {
  poetico: { 
    fugindo: false, 
    podeClicar: false,
    timeoutRetorno: null,
    posicaoOriginal: { x: 0, y: 0 }
  },
  oracular: { 
    fugindo: false, 
    podeClicar: false,
    timeoutRetorno: null,
    posicaoOriginal: { x: 0, y: 0 }
  },
  analitico: { 
    fugindo: false, 
    podeClicar: false,
    timeoutRetorno: null,
    posicaoOriginal: { x: 0, y: 0 }
  }
};

// =========================
// Inicialização
// =========================
document.addEventListener('DOMContentLoaded', function() {
  inicializarOpcoes();
  verificarHistoricoVazio();
  inicializarDetecaoProximidade();
  
  ajustarAlturaContainer();
  window.addEventListener('resize', ajustarAlturaContainer);
});

function ajustarAlturaContainer() {
  const container = document.querySelector('.container');
  const alturaDisponivel = window.innerHeight - 40;
  container.style.maxHeight = `${Math.min(alturaDisponivel, 800)}px`;
}

// =========================
// Sistema de Deteção de Proximidade
// =========================
function inicializarDetecaoProximidade() {
  const opcoes = document.querySelectorAll('.option-compacta');
  const ZONA_PERIGO = 120; // Raio em pixels onde o cursor ativa a fuga
  
  document.addEventListener('mousemove', (e) => {
    opcoes.forEach(opt => {
      const retangulo = opt.getBoundingClientRect();
      const centroX = retangulo.left + retangulo.width / 2;
      const centroY = retangulo.top + retangulo.height / 2;
      
      const distancia = Math.sqrt(
        Math.pow(e.clientX - centroX, 2) + 
        Math.pow(e.clientY - centroY, 2)
      );
      
      // Se o cursor está perto e o objeto não está fugindo
      if (distancia < ZONA_PERIGO && !estadoOpcoes[opt.id].fugindo) {
        ativarFugaPreventiva(opt);
      }
    });
  });
}

// =========================
// Sistema de Fuga Preventiva
// =========================
function ativarFugaPreventiva(elemento) {
  const estado = estadoOpcoes[elemento.id];
  
  if (estado.fugindo) return; // Já está fugindo
  
  estado.fugindo = true;
  estado.podeClicar = false;
  
  // Guardar posição original se for a primeira fuga
  if (estado.posicaoOriginal.x === 0 && estado.posicaoOriginal.y === 0) {
    const rect = elemento.getBoundingClientRect();
    estado.posicaoOriginal.x = rect.left;
    estado.posicaoOriginal.y = rect.top;
  }
  
  // Calcular direção de fuga (oposta ao cursor)
  const rect = elemento.getBoundingClientRect();
  const centroX = rect.left + rect.width / 2;
  const centroY = rect.top + rect.height / 2;
  
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  
  // Vetor do cursor para o centro do objeto
  const dirX = centroX - cursorX;
  const dirY = centroY - cursorY;
  
  // Normalizar e amplificar
  const comprimento = Math.sqrt(dirX * dirX + dirY * dirY);
  const normalX = dirX / comprimento;
  const normalY = dirY / comprimento;
  
  const distanciaFuga = 180 + Math.random() * 60; // Distância variável
  const destinoX = normalX * distanciaFuga;
  const destinoY = normalY * distanciaFuga;
  
  // Aplicar fuga imediata
  elemento.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease';
  elemento.style.transform = `translate(${destinoX}px, ${destinoY}px)`;
  elemento.style.opacity = '0.7';
  elemento.style.boxShadow = '0 0 25px rgba(166,124,82,0.8)';
  
  // Limpar timeout anterior se existir
  if (estado.timeoutRetorno) {
    clearTimeout(estado.timeoutRetorno);
  }
  
  // Programar retorno após curto intervalo
  estado.timeoutRetorno = setTimeout(() => {
    retornarPosicaoOriginal(elemento);
  }, 800 + Math.random() * 400); // Retorno aleatório entre 0.8-1.2s
}

function retornarPosicaoOriginal(elemento) {
  const estado = estadoOpcoes[elemento.id];
  
  elemento.style.transition = 'transform 0.6s ease-in, opacity 0.6s ease, box-shadow 0.6s ease';
  elemento.style.transform = 'translate(0, 0)';
  elemento.style.opacity = '1';
  elemento.style.boxShadow = '0 0 15px rgba(166,124,82,0.4)';
  
  // Permitir clique após retorno completo
  setTimeout(() => {
    estado.fugindo = false;
    estado.podeClicar = true;
    
    // Efeito visual indicando que está "clicável"
    elemento.style.boxShadow = '0 0 20px rgba(166,124,82,0.6), 0 0 30px rgba(166,124,82,0.3)';
    
    // Remover o efeito após breve período
    setTimeout(() => {
      if (estado.podeClicar && !estado.fugindo) {
        elemento.style.boxShadow = '0 0 15px rgba(166,124,82,0.4)';
      }
    }, 600);
  }, 600);
}

// =========================
// Sistema de Clique (Só quando "calmo")
// =========================
function inicializarOpcoes() {
  document.querySelectorAll(".option-compacta").forEach(opt => {
    const id = opt.id;

    opt.addEventListener("click", function(e) {
      e.stopPropagation();
      
      const estado = estadoOpcoes[id];
      
      // Só permite clique se o objeto não está fugindo e está "clicável"
      if (!estado.fugindo && estado.podeClicar) {
        executarRevelacao(opt);
      } else {
        // Feedback visual de que não pode clicar agora
        opt.style.boxShadow = '0 0 15px rgba(255,100,100,0.6)';
        setTimeout(() => {
          if (!estado.fugindo && estado.podeClicar) {
            opt.style.boxShadow = '0 0 15px rgba(166,124,82,0.4)';
          }
        }, 300);
      }
    });

    // Efeito hover suave apenas quando "clicável"
    opt.addEventListener("mouseenter", function() {
      const estado = estadoOpcoes[id];
      if (!estado.fugindo && estado.podeClicar) {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 20px rgba(166,124,82,0.7)';
      }
    });

    opt.addEventListener("mouseleave", function() {
      const estado = estadoOpcoes[id];
      if (!estado.fugindo && estado.podeClicar) {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 15px rgba(166,124,82,0.4)';
      }
    });
  });
}

// =========================
// Rituais de Revelação
// =========================
function executarRevelacao(elemento) {
  const id = elemento.id;
  const data = document.getElementById("dataInput").value;
  
  let frase;
  if (data) {
    frase = gerarFraseEstilo(id, data);
  } else {
    frase = frases[id][Math.floor(Math.random() * frases[id].length)];
  }
  
  // Aplicar ritual de revelação conforme o estilo
  aplicarRitualRevelacao(id, frase);
  guardarHistorico(frase, id);
  
  // Efeito visual de confirmação
  elemento.style.boxShadow = '0 0 30px rgba(166,124,82,0.9)';
  setTimeout(() => {
    elemento.style.boxShadow = '0 0 15px rgba(166,124,82,0.4)';
  }, 800);
}

function aplicarRitualRevelacao(estilo, texto) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  resultado.className = "resultado-destaque"; // Reset de classes
  
  // Aplicar classe de animação conforme o estilo
  switch(estilo) {
    case "poetico":
      resultado.classList.add("revelacao-poetica");
      revelacaoPoetica(texto, resultado);
      break;
    case "oracular":
      resultado.classList.add("revelacao-oracular");
      revelacaoOracular(texto, resultado);
      break;
    case "analitico":
      resultado.classList.add("revelacao-analitica");
      revelacaoAnalitica(texto, resultado);
      break;
  }
}

function revelacaoPoetica(texto, elemento) {
  // Revelação lenta, como um véu
  let palavras = texto.split(" ");
  let conteudo = "";
  
  palavras.forEach((palavra, index) => {
    setTimeout(() => {
      conteudo += palavra + " ";
      elemento.innerHTML = conteudo;
      
      if (index === palavras.length - 1) {
        elemento.style.opacity = "1";
      }
    }, 200 * index);
  });
}

function revelacaoOracular(texto, elemento) {
  // Revelação abrupta, como uma sentença
  elemento.innerHTML = texto;
  elemento.style.opacity = "1";
  
  // Efeito de impacto
  elemento.style.transform = "scale(1.1)";
  setTimeout(() => {
    elemento.style.transform = "scale(1)";
  }, 300);
}

function revelacaoAnalitica(texto, elemento) {
  // Revelação passo a passo, como uma equação
  let caracteres = texto.split("");
  let conteudo = "";
  
  caracteres.forEach((caractere, index) => {
    setTimeout(() => {
      conteudo += caractere;
      elemento.innerHTML = conteudo;
      
      if (index === caracteres.length - 1) {
        elemento.style.opacity = "1";
      }
    }, 50 * index);
  });
}

// =========================
// Cálculo Numerológico Avançado
// =========================
function calcularNumeroVida(dataString) {
  const digitos = dataString.replace(/-/g, '').split('').map(Number);
  let soma = digitos.reduce((acc, val) => acc + val, 0);

  while (soma > 9 && soma !== 11 && soma !== 22 && soma !== 33) {
    soma = soma.toString().split('').map(Number).reduce((acc, val) => acc + val, 0);
  }
  return soma;
}

function analisarDigitos(dataString) {
  const digitos = dataString.replace(/[^0-9]/g, "").split("");
  const contagem = {};
  digitos.forEach(d => contagem[d] = (contagem[d] || 0) + 1);

  const influenciasOrdenadas = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .map(([n]) => significados[n])
    .filter(Boolean);

  return influenciasOrdenadas;
}

// =========================
// Temporalidade Oculta
// =========================
function calcularTemporalidade(dataString) {
  const dataInserida = new Date(dataString);
  const hoje = new Date();
  const diferencaTempo = dataInserida.getTime() - hoje.getTime();
  const diferencaDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
  
  if (diferencaDias > 0) {
    // Data futura
    return { 
      tipo: "futuro", 
      dias: diferencaDias,
      significado: "força em gestação"
    };
  } else if (diferencaDias < 0) {
    // Data passada
    const anos = Math.floor(Math.abs(diferencaDias) / 365);
    return { 
      tipo: "passado", 
      dias: Math.abs(diferencaDias),
      anos: anos,
      significado: anos > 0 ? `eco de ${anos} anos` : "eco recente"
    };
  } else {
    // Hoje
    return { 
      tipo: "presente", 
      dias: 0,
      significado: "momento presente"
    };
  }
}

// =========================
// Deteção de Polaridades
// =========================
function detectarPolaridades(dataString) {
  const digitos = dataString.replace(/[^0-9]/g, "").split("");
  const polaridadesEncontradas = [];
  
  digitos.forEach(digito => {
    if (polaridades[digito]) {
      const polaridade = polaridades[digito];
      if (digitos.includes(polaridade.oposto)) {
        polaridadesEncontradas.push({
          par: `${digito}-${polaridade.oposto}`,
          significado: polaridade.significado,
          tensao: Math.random() > 0.5 ? "harmoniosa" : "tensa"
        });
      }
    }
  });
  
  return polaridadesEncontradas;
}

function gerarFraseEstilo(estilo, dataString) {
  const numeroVida = calcularNumeroVida(dataString);
  const influencias = analisarDigitos(dataString);
  const temporalidade = calcularTemporalidade(dataString);
  const polaridades = detectarPolaridades(dataString);
  const significadoVida = significadosNumerosVida[numeroVida] || "energia única";

  // Frases base por estilo
  const frasesBase = {
    poetico: [
      `Um dia de ${significadoVida}, onde ${influencias[0] || "o mistério"} dança com ${influencias[1] || "o silêncio"}. ${temporalidade.significado}.`,
      `Sob a influência de ${significadoVida}, ${influencias[0] || "o tempo"} entrelaça-se com ${influencias[1] || "a eternidade"}. ${temporalidade.significado}.`
    ],
    oracular: [
      `O destino revela ${significadoVida} em conversa com ${influencias[0] || "forças ocultas"}. ${temporalidade.significado}.`,
      `Os sinais apontam para ${significadoVida}, enquanto ${influencias[0] || "o invisível"} guia seus passos. ${temporalidade.significado}.`
    ],
    analitico: [
      `Análise indica ${significadoVida} predominante, com forte presença de ${influencias[0] || "elementos base"}. ${temporalidade.significado}.`,
      `Padrão numérico revela ${significadoVida} coordenando com ${influencias[0] || "fatores secundários"}. ${temporalidade.significado}.`
    ]
  };

  // Adicionar polaridades se detectadas
  let frase = frasesBase[estilo][Math.floor(Math.random() * frasesBase[estilo].length)];
  
  if (polaridades.length > 0) {
    const polaridade = polaridades[0];
    frase += ` Polaridade ${polaridade.par} (${polaridade.significado}) cria uma tensão ${polaridade.tensao}.`;
  }

  return frase;
}

// =========================
// Funções Principais
// =========================
function calcular() {
  const data = document.getElementById("dataInput").value;
  if (!data) { 
    mostrarResultado("Por favor insere uma data para desvendar seus segredos."); 
    return; 
  }

  const numeroVida = calcularNumeroVida(data);
  const influencias = analisarDigitos(data);
  const temporalidade = calcularTemporalidade(data);
  const significadoVida = significadosNumerosVida[numeroVida] || "uma energia singular";

  let frase;
  if (influencias.length === 0) {
    frase = `Este dia guarda silêncio, mas carrega a essência de ${significadoVida}. ${temporalidade.significado}.`;
  } else if (influencias.length === 1) {
    frase = `Revela-se ${significadoVida} em harmonia com ${influencias[0]}. ${temporalidade.significado}.`;
  } else {
    frase = `Manifesta-se ${significadoVida} através de ${influencias[0]} em diálogo com ${influencias[1]}. ${temporalidade.significado}.`;
  }

  // Adicionar polaridades se detectadas
  const polaridades = detectarPolaridades(data);
  if (polaridades.length > 0) {
    const polaridade = polaridades[0];
    frase += ` Polaridade ${polaridade.par} (${polaridade.significado}) cria uma tensão ${polaridade.tensao}.`;
  }

  mostrarResultado(frase);
  guardarHistorico(frase, "calculo");
  ativarEfeitoCanvas();
}

function comparar() {
  const d1 = document.getElementById("data1").value;
  const d2 = document.getElementById("data2").value;
  if (!d1 || !d2) { 
    mostrarResultado("Para comparar destinos, precisas de duas datas."); 
    return; 
  }

  const n1 = calcularNumeroVida(d1);
  const n2 = calcularNumeroVida(d2);
  const s1 = significadosNumerosVida[n1] || "energia única";
  const s2 = significadosNumerosVida[n2] || "energia distinta";

  const frasesComparacao = [
    `A data ${d1} (${s1}) encontra ${d2} (${s2}) num diálogo de espelhos e contrastes.`,
    `${s1} de ${d1} entrelaça-se com ${s2} de ${d2}, criando nova harmonia.`
  ];

  const frase = frasesComparacao[Math.floor(Math.random() * frasesComparacao.length)];
  mostrarResultado(frase);
  guardarHistorico(frase, "comparacao");
  ativarEfeitoCanvas();
}

// =========================
// Sistema de Histórico com Narrativa Acumulativa
// =========================
function guardarHistorico(frase, tipo) {
  let hist = JSON.parse(localStorage.getItem("historico")) || [];
  
  // Analisar padrões se houver registos anteriores
  const padrao = analisarPadroes(hist);
  
  hist.push({ 
    t: Date.now(), 
    texto: frase,
    tipo: tipo,
    data: new Date().toLocaleDateString('pt-PT'),
    padrao: padrao
  });
  
  // Manter apenas os últimos 8 registos
  if (hist.length > 8) {
    hist = hist.slice(-8);
  }
  
  localStorage.setItem("historico", JSON.stringify(hist));
  verificarHistoricoVazio();
}

function analisarPadroes(historico) {
  if (historico.length < 3) return null;
  
  // Analisar números recorrentes nos últimos registos
  const textosRecentes = historico.slice(-3).map(item => item.texto);
  const numerosRecentes = [];
  
  textosRecentes.forEach(texto => {
    const numeros = texto.match(/\d+/g);
    if (numeros) {
      numerosRecentes.push(...numeros);
    }
  });
  
  // Contar frequência de números
  const contagem = {};
  numerosRecentes.forEach(num => {
    contagem[num] = (contagem[num] || 0) + 1;
  });
  
  // Encontrar números que aparecem múltiplas vezes
  const numerosRecorrentes = Object.entries(contagem)
    .filter(([num, count]) => count >= 2)
    .map(([num]) => num);
  
  if (numerosRecorrentes.length > 0) {
    const numero = numerosRecorrentes[0];
    const significado = significados[numero] || significadosNumerosVida[numero];
    
    const padroes = [
      `O número ${numero} (${significado}) tem regressado, como um fio que atravessa os teus dias.`,
      `Um padrão emerge: ${significado} reaparece como tema central.`,
      `O eco do ${numero} ressoa através do tempo, conectando os momentos.`
    ];
    
    return padroes[Math.floor(Math.random() * padroes.length)];
  }
  
  return null;
}

function mostrarHistorico() {
  const hist = JSON.parse(localStorage.getItem("historico")) || [];
  const div = document.getElementById("historico");
  
  if (hist.length === 0) {
    div.innerHTML = "<p style='opacity:0.7; font-style:italic; text-align:center;'>O livro dos dias ainda está vazio. Cada consulta escreverá um novo capítulo na tua história.</p>";
  } else {
    let html = "";
    
    // Agrupar por padrões se existirem
    let ultimoPadrao = null;
    
    hist.slice(-6).reverse().forEach(item => {
      // Adicionar comentário sobre padrão se for diferente do anterior
      if (item.padrao && item.padrao !== ultimoPadrao) {
        html += `<p style='background:rgba(166,124,82,0.2); border-left-color:#d4b996;'><strong>📖 Padrão Detectado:</strong> ${item.padrao}</p>`;
        ultimoPadrao = item.padrao;
      }
      
      html += `<p><strong>${item.data}:</strong> ${item.texto}</p>`;
    });
    
    div.innerHTML = html;
  }
  div.style.opacity = 1;
}

function limparHistorico() {
  if (confirm("Desejas realmente apagar todos os registos do Livro dos Dias? Esta ação não pode ser desfeita.")) {
    localStorage.removeItem("historico");
    mostrarHistorico();
    mostrarResultado("O Livro dos Dias foi limpo. Um novo ciclo começa. Que novas histórias serão escritas?");
  }
}

function verificarHistoricoVazio() {
  const hist = JSON.parse(localStorage.getItem("historico")) || [];
  const botaoLimpar = document.querySelector('.btn-limpar');
  if (botaoLimpar) {
    botaoLimpar.style.display = hist.length > 0 ? 'inline-block' : 'none';
  }
}

// =========================
// Interface e Resultados
// =========================
function mostrarResultado(texto) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = texto;
  resultado.style.opacity = 0;
  
  setTimeout(() => {
    resultado.style.opacity = 1;
  }, 50);
}

// =========================
// Canvas Background
// =========================
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
let efeitoAtivo = false;
let tempoEfeito = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const dustParticles = Array.from({ length: 80 }).map(() => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 0.4 + Math.random() * 0.6,
  dx: (Math.random() - 0.5) * 0.2,
  dy: (Math.random() - 0.5) * 0.2
}));

let start = performance.now();

function ativarEfeitoCanvas() {
  efeitoAtivo = true;
  tempoEfeito = performance.now();
}

function draw() {
  const now = performance.now();
  const elapsed = now - start;
  const efeitoElapsed = efeitoAtivo ? now - tempoEfeito : 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (efeitoAtivo && efeitoElapsed < 1500) {
    const intensidade = 1 - (efeitoElapsed / 1500);
    ctx.fillStyle = `rgba(166,124,82,${intensidade * 0.08})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const dustOpacity = Math.min(elapsed / 40000, 0.2);
  ctx.fillStyle = `rgba(166,124,82,${dustOpacity})`;
  dustParticles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.y > canvas.height + 10) p.y = -10;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const lineOpacity = Math.min(elapsed / 50000, 0.2);
  ctx.strokeStyle = `rgba(166,124,82,${lineOpacity})`;
  ctx.lineWidth = 0.4;

  for (let i = -200; i < canvas.width + 200; i += 250) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - 300, canvas.height);
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);