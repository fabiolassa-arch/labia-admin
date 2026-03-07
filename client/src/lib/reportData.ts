/*
 * Dados dinâmicos para relatórios — variam conforme o período selecionado
 * Períodos: 7d (7 dias), 30d (30 dias), 90d (90 dias), 1a (1 ano)
 */

export type PeriodoKey = "7d" | "30d" | "90d" | "1a";

export interface PeriodoInfo {
  label: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
}

export interface DesempenhoMensalRow {
  mes: string;
  novosAlunos: number;
  missoesConc: number;
  taxaEngaj: number;
}

export interface EscolaRow {
  escola: string;
  alunos: number;
  progresso: number;
  engajamento: number;
  missoesPorAluno: number;
  ranking: string;
}

export interface NivelRow {
  name: string;
  value: number;
  color: string;
  percentual: string;
  descricao: string;
}

export interface HabilidadeRow {
  skill: string;
  A: number;
  B: number;
  status: string;
}

export interface EngajamentoRow {
  mes: string;
  sessoes: string;
  tempoMedio: string;
  taxaRetorno: string;
  missoesDia: string;
  chatIA: string;
  engajamento: string;
}

export interface TrilhaRow {
  trilha: string;
  missoes: string;
  alunosInscritos: string;
  taxaConclusao: string;
  notaMedia: string;
  tempoMedio: string;
}

export interface ReportDataSet {
  periodo: PeriodoInfo;
  resumo: {
    totalAlunos: string;
    totalAlunosDelta: string;
    missoesConc: string;
    missoesDelta: string;
    taxaEngajamento: string;
    engajamentoDelta: string;
    escolasParceiras: string;
    escolasDelta: string;
  };
  desempenhoMensal: DesempenhoMensalRow[];
  desempenhoMensalTabela: string[][];
  desempenhoMensalTotal: string[];
  escolas: EscolaRow[];
  escolasTabela: string[][];
  escolasResumo: {
    totalEscolas: string;
    totalAlunos: string;
    alunosDelta: string;
    progressoMedio: string;
    progressoDelta: string;
    engajamentoMedio: string;
    engajamentoDelta: string;
  };
  escolasDetalhamento: {
    nome: string;
    alunos: number;
    progresso: number;
    engajamento: number;
    destaques: string;
    desafios: string;
  }[];
  niveis: NivelRow[];
  habilidades: HabilidadeRow[];
  habilidadesTabela: string[][];
  habilidadesAnalise: string;
  engajamentoResumo: {
    sessoesTotais: string;
    sessoesDelta: string;
    tempoMedio: string;
    tempoDelta: string;
    taxaRetorno: string;
    retornoDelta: string;
    nps: string;
    npsDelta: string;
  };
  engajamentoTabela: string[][];
  engajamentoAnalise: string;
  trilhasTabela: string[][];
  trilhasAnalise: string;
  analiseGeral: string;
  recomendacoes: { title: string; desc: string }[];
}

// ============================================================
// Período: Últimos 7 dias
// ============================================================
const data7d: ReportDataSet = {
  periodo: {
    label: "Últimos 7 dias",
    descricao: "28/fev — 07/mar de 2026",
    dataInicio: "28/02/2026",
    dataFim: "07/03/2026",
  },
  resumo: {
    totalAlunos: "1.247",
    totalAlunosDelta: "+28",
    missoesConc: "312",
    missoesDelta: "+8%",
    taxaEngajamento: "74%",
    engajamentoDelta: "+1%",
    escolasParceiras: "18",
    escolasDelta: "",
  },
  desempenhoMensal: [
    { mes: "Seg", novosAlunos: 5, missoesConc: 48, taxaEngaj: 72 },
    { mes: "Ter", novosAlunos: 4, missoesConc: 52, taxaEngaj: 75 },
    { mes: "Qua", novosAlunos: 6, missoesConc: 45, taxaEngaj: 73 },
    { mes: "Qui", novosAlunos: 3, missoesConc: 41, taxaEngaj: 71 },
    { mes: "Sex", novosAlunos: 5, missoesConc: 56, taxaEngaj: 76 },
    { mes: "Sáb", novosAlunos: 2, missoesConc: 38, taxaEngaj: 68 },
    { mes: "Dom", novosAlunos: 3, missoesConc: 32, taxaEngaj: 65 },
  ],
  desempenhoMensalTabela: [
    ["Seg 03/mar", "5", "48", "72%"],
    ["Ter 04/mar", "4", "52", "75%"],
    ["Qua 05/mar", "6", "45", "73%"],
    ["Qui 06/mar", "3", "41", "71%"],
    ["Sex 07/mar", "5", "56", "76%"],
    ["Sáb 01/mar", "2", "38", "68%"],
    ["Dom 02/mar", "3", "32", "65%"],
  ],
  desempenhoMensalTotal: ["Total / Média", "28", "312", "71,4%"],
  escolas: [
    { escola: "Nova Era", alunos: 245, progresso: 79, engajamento: 83, missoesPorAluno: 1.2, ranking: "2º" },
    { escola: "C. Futuro", alunos: 189, progresso: 66, engajamento: 72, missoesPorAluno: 0.9, ranking: "4º" },
    { escola: "Inst. Tech", alunos: 156, progresso: 83, engajamento: 89, missoesPorAluno: 1.4, ranking: "1º" },
    { escola: "E. Criativa", alunos: 134, progresso: 72, engajamento: 76, missoesPorAluno: 1.0, ranking: "3º" },
    { escola: "C. Inovação", alunos: 98, progresso: 46, engajamento: 53, missoesPorAluno: 0.6, ranking: "5º" },
  ],
  escolasTabela: [
    ["Instituto Tech", "156", "83%", "89%", "1.4", "1º"],
    ["Escola Nova Era", "245", "79%", "83%", "1.2", "2º"],
    ["Escola Criativa", "134", "72%", "76%", "1.0", "3º"],
    ["Colégio Futuro", "189", "66%", "72%", "0.9", "4º"],
    ["Colégio Inovação", "98", "46%", "53%", "0.6", "5º"],
  ],
  escolasResumo: {
    totalEscolas: "5",
    totalAlunos: "822",
    alunosDelta: "+12",
    progressoMedio: "69,2%",
    progressoDelta: "+1%",
    engajamentoMedio: "74,6%",
    engajamentoDelta: "+1%",
  },
  escolasDetalhamento: [
    { nome: "Instituto Tech", alunos: 156, progresso: 83, engajamento: 89, destaques: "Maior engajamento semanal. 5 alunos subiram de nível esta semana.", desafios: "Necessita de mais conteúdo avançado para alunos nível Cientista." },
    { nome: "Escola Nova Era", alunos: 245, progresso: 79, engajamento: 83, destaques: "Maior número de missões concluídas no período. Boa participação diária.", desafios: "Queda de engajamento no fim de semana." },
    { nome: "Escola Criativa", alunos: 134, progresso: 72, engajamento: 76, destaques: "Aumento no uso do Chat IA. Projetos criativos em andamento.", desafios: "Baixa frequência nas sextas-feiras." },
    { nome: "Colégio Futuro", alunos: 189, progresso: 66, engajamento: 72, destaques: "Crescimento estável. Novos professores engajados.", desafios: "Taxa de conclusão de missões abaixo da média." },
    { nome: "Colégio Inovação", alunos: 98, progresso: 46, engajamento: 53, destaques: "Direção iniciou campanha de incentivo ao uso da plataforma.", desafios: "Engajamento muito abaixo da média. Necessita intervenção." },
  ],
  niveis: [
    { name: "Iniciante", value: 312, color: "#9CA3AF", percentual: "25%", descricao: "Alunos que estão começando a jornada" },
    { name: "Explorador", value: 428, color: "#7C3AED", percentual: "34,3%", descricao: "Alunos explorando conceitos de IA" },
    { name: "Inventor", value: 289, color: "#F97316", percentual: "23,2%", descricao: "Alunos criando soluções com IA" },
    { name: "Cientista", value: 156, color: "#10B981", percentual: "12,5%", descricao: "Alunos com domínio avançado" },
    { name: "Mestre", value: 62, color: "#EC4899", percentual: "5%", descricao: "Alunos que completaram todas as trilhas" },
  ],
  habilidades: [
    { skill: "Conceitos IA", A: 85, B: 72, status: "Acima da meta" },
    { skill: "Prompts", A: 78, B: 65, status: "Acima da meta" },
    { skill: "Pensamento Crítico", A: 72, B: 58, status: "Acima da meta" },
    { skill: "Criatividade", A: 88, B: 70, status: "Acima da meta" },
    { skill: "Resolução Prob.", A: 65, B: 55, status: "Acima da meta" },
    { skill: "Colaboração", A: 80, B: 68, status: "Acima da meta" },
  ],
  habilidadesTabela: [
    ["Conceitos de IA", "85", "72", "Acima da meta"],
    ["Criação de Prompts", "78", "65", "Acima da meta"],
    ["Pensamento Crítico", "72", "58", "Acima da meta"],
    ["Criatividade", "88", "70", "Acima da meta"],
    ["Resolução de Problemas", "65", "55", "Acima da meta"],
    ["Colaboração", "80", "68", "Acima da meta"],
  ],
  habilidadesAnalise: "Na última semana, todas as habilidades mantiveram-se acima das metas. Destaque para Criatividade (88%) e Conceitos de IA (85%). Resolução de Problemas (65%) continua como a habilidade com menor pontuação, embora acima da meta de 55%.",
  engajamentoResumo: {
    sessoesTotais: "2.640",
    sessoesDelta: "+8%",
    tempoMedio: "12 min",
    tempoDelta: "+1 min",
    taxaRetorno: "69%",
    retornoDelta: "+2%",
    nps: "73",
    npsDelta: "+1",
  },
  engajamentoTabela: [
    ["Seg 03/mar", "420", "13 min", "71%", "48", "95", "75%"],
    ["Ter 04/mar", "410", "12 min", "70%", "52", "88", "74%"],
    ["Qua 05/mar", "395", "12 min", "68%", "45", "82", "73%"],
    ["Qui 06/mar", "380", "11 min", "67%", "41", "78", "71%"],
    ["Sex 07/mar", "435", "13 min", "72%", "56", "102", "76%"],
    ["Sáb 01/mar", "310", "10 min", "62%", "38", "65", "68%"],
    ["Dom 02/mar", "290", "9 min", "58%", "32", "55", "65%"],
  ],
  engajamentoAnalise: "O engajamento semanal mostra padrão consistente com picos nos dias úteis (especialmente sexta-feira) e queda natural nos finais de semana. O tempo médio por sessão manteve-se em 12 minutos, com uso crescente do Chat IA nos dias de maior atividade. Recomenda-se criar desafios especiais para fins de semana.",
  trilhasTabela: [
    ["Entendendo a IA", "4", "1.247", "72%", "8.5", "45 min"],
    ["Criando Prompts", "4", "892", "58%", "7.8", "60 min"],
    ["Criando Soluções", "4", "534", "41%", "8.2", "75 min"],
    ["Meu Primeiro App", "4", "312", "28%", "8.7", "90 min"],
  ],
  trilhasAnalise: "Na última semana, a trilha 'Entendendo a IA' manteve a maior taxa de conclusão (72%). 18 alunos avançaram para a trilha 'Criando Prompts'. A trilha 'Meu Primeiro App' registrou 3 novas conclusões, mantendo a nota média mais alta (8.7).",
  analiseGeral: "Na última semana, a plataforma LabIA registrou 28 novos alunos e 312 missões concluídas. A taxa de engajamento manteve-se estável em 74%, com pico na sexta-feira (76%). O uso do Chat IA cresceu 8% em relação à semana anterior. As 5 escolas parceiras mantiveram desempenho consistente, com o Instituto Tech liderando o ranking.",
  recomendacoes: [
    { title: "Desafios de fim de semana", desc: "Criar missões especiais e competições para aumentar o engajamento nos sábados e domingos, que apresentam queda de 10% em relação aos dias úteis." },
    { title: "Campanha para Colégio Inovação", desc: "Implementar plano de ação urgente para o Colégio Inovação, que mantém engajamento de apenas 53%, incluindo visitas presenciais e treinamento docente." },
    { title: "Conteúdo avançado para Instituto Tech", desc: "Desenvolver trilhas avançadas para atender a demanda dos alunos de nível Cientista e Mestre do Instituto Tech." },
    { title: "Gamificação semanal", desc: "Lançar ranking semanal entre escolas com premiações para incentivar a competição saudável e aumentar o engajamento geral." },
    { title: "Monitoramento de evasão", desc: "Identificar alunos que não acessaram a plataforma nos últimos 3 dias e enviar notificações personalizadas de reengajamento." },
  ],
};

// ============================================================
// Período: Últimos 30 dias
// ============================================================
const data30d: ReportDataSet = {
  periodo: {
    label: "Últimos 30 dias",
    descricao: "05/fev — 07/mar de 2026",
    dataInicio: "05/02/2026",
    dataFim: "07/03/2026",
  },
  resumo: {
    totalAlunos: "1.247",
    totalAlunosDelta: "+142",
    missoesConc: "1.890",
    missoesDelta: "+15%",
    taxaEngajamento: "75%",
    engajamentoDelta: "+3%",
    escolasParceiras: "18",
    escolasDelta: "+1",
  },
  desempenhoMensal: [
    { mes: "Sem 1", novosAlunos: 32, missoesConc: 420, taxaEngaj: 73 },
    { mes: "Sem 2", novosAlunos: 38, missoesConc: 485, taxaEngaj: 75 },
    { mes: "Sem 3", novosAlunos: 41, missoesConc: 510, taxaEngaj: 77 },
    { mes: "Sem 4", novosAlunos: 31, missoesConc: 475, taxaEngaj: 74 },
  ],
  desempenhoMensalTabela: [
    ["Semana 1 (05-11/fev)", "32", "420", "73%"],
    ["Semana 2 (12-18/fev)", "38", "485", "75%"],
    ["Semana 3 (19-25/fev)", "41", "510", "77%"],
    ["Semana 4 (26/fev-07/mar)", "31", "475", "74%"],
  ],
  desempenhoMensalTotal: ["Total / Média", "142", "1.890", "74,8%"],
  escolas: [
    { escola: "Nova Era", alunos: 245, progresso: 79, engajamento: 83, missoesPorAluno: 4.5, ranking: "2º" },
    { escola: "C. Futuro", alunos: 189, progresso: 66, engajamento: 72, missoesPorAluno: 3.2, ranking: "4º" },
    { escola: "Inst. Tech", alunos: 156, progresso: 83, engajamento: 89, missoesPorAluno: 5.0, ranking: "1º" },
    { escola: "E. Criativa", alunos: 134, progresso: 72, engajamento: 76, missoesPorAluno: 3.8, ranking: "3º" },
    { escola: "C. Inovação", alunos: 98, progresso: 47, engajamento: 54, missoesPorAluno: 2.2, ranking: "5º" },
  ],
  escolasTabela: [
    ["Instituto Tech", "156", "83%", "89%", "5.0", "1º"],
    ["Escola Nova Era", "245", "79%", "83%", "4.5", "2º"],
    ["Escola Criativa", "134", "72%", "76%", "3.8", "3º"],
    ["Colégio Futuro", "189", "66%", "72%", "3.2", "4º"],
    ["Colégio Inovação", "98", "47%", "54%", "2.2", "5º"],
  ],
  escolasResumo: {
    totalEscolas: "5",
    totalAlunos: "822",
    alunosDelta: "+45",
    progressoMedio: "69,4%",
    progressoDelta: "+3%",
    engajamentoMedio: "74,8%",
    engajamentoDelta: "+2%",
  },
  escolasDetalhamento: [
    { nome: "Instituto Tech", alunos: 156, progresso: 83, engajamento: 89, destaques: "Maior taxa de engajamento mensal. 12 alunos alcançaram nível Cientista.", desafios: "Capacidade limitada para novos alunos. Necessita de mais trilhas avançadas." },
    { nome: "Escola Nova Era", alunos: 245, progresso: 79, engajamento: 83, destaques: "Maior número de alunos. Boa distribuição entre níveis. Professores engajados.", desafios: "Taxa de conclusão de missões abaixo da média em turmas do 6º ano." },
    { nome: "Escola Criativa", alunos: 134, progresso: 72, engajamento: 76, destaques: "Forte em atividades criativas. Bom uso do Chat IA. Projetos interdisciplinares.", desafios: "Baixa frequência de acesso nos finais de semana." },
    { nome: "Colégio Futuro", alunos: 189, progresso: 66, engajamento: 72, destaques: "Crescimento constante. Boa infraestrutura tecnológica.", desafios: "Alta rotatividade de professores. Necessita de treinamento docente." },
    { nome: "Colégio Inovação", alunos: 98, progresso: 47, engajamento: 54, destaques: "Escola mais recente na plataforma. Direção comprometida.", desafios: "Baixo engajamento geral. Infraestrutura limitada. Necessita plano de ação." },
  ],
  niveis: [
    { name: "Iniciante", value: 312, color: "#9CA3AF", percentual: "25%", descricao: "Alunos que estão começando a jornada" },
    { name: "Explorador", value: 428, color: "#7C3AED", percentual: "34,3%", descricao: "Alunos explorando conceitos de IA" },
    { name: "Inventor", value: 289, color: "#F97316", percentual: "23,2%", descricao: "Alunos criando soluções com IA" },
    { name: "Cientista", value: 156, color: "#10B981", percentual: "12,5%", descricao: "Alunos com domínio avançado" },
    { name: "Mestre", value: 62, color: "#EC4899", percentual: "5%", descricao: "Alunos que completaram todas as trilhas" },
  ],
  habilidades: [
    { skill: "Conceitos IA", A: 85, B: 72, status: "Acima da meta" },
    { skill: "Prompts", A: 78, B: 65, status: "Acima da meta" },
    { skill: "Pensamento Crítico", A: 72, B: 58, status: "Acima da meta" },
    { skill: "Criatividade", A: 88, B: 70, status: "Acima da meta" },
    { skill: "Resolução Prob.", A: 65, B: 55, status: "Acima da meta" },
    { skill: "Colaboração", A: 80, B: 68, status: "Acima da meta" },
  ],
  habilidadesTabela: [
    ["Conceitos de IA", "85", "72", "Acima da meta"],
    ["Criação de Prompts", "78", "65", "Acima da meta"],
    ["Pensamento Crítico", "72", "58", "Acima da meta"],
    ["Criatividade", "88", "70", "Acima da meta"],
    ["Resolução de Problemas", "65", "55", "Acima da meta"],
    ["Colaboração", "80", "68", "Acima da meta"],
  ],
  habilidadesAnalise: "No último mês, todas as habilidades mantiveram-se acima das metas estabelecidas. Criatividade (88%) e Conceitos de IA (85%) lideram o ranking. A habilidade de Resolução de Problemas (65%) apresenta a menor pontuação, mas supera a meta de 55%. Houve melhoria de 2 pontos percentuais em Pensamento Crítico.",
  engajamentoResumo: {
    sessoesTotais: "6.170",
    sessoesDelta: "+18%",
    tempoMedio: "12 min",
    tempoDelta: "+2 min",
    taxaRetorno: "70%",
    retornoDelta: "+5%",
    nps: "73",
    npsDelta: "+3",
  },
  engajamentoTabela: [
    ["Semana 1 (05-11/fev)", "1.420", "11 min", "67%", "60", "210", "73%"],
    ["Semana 2 (12-18/fev)", "1.580", "12 min", "70%", "69", "245", "75%"],
    ["Semana 3 (19-25/fev)", "1.650", "13 min", "72%", "73", "268", "77%"],
    ["Semana 4 (26/fev-07/mar)", "1.520", "12 min", "69%", "65", "230", "74%"],
  ],
  engajamentoAnalise: "O engajamento mensal apresentou tendência de alta nas primeiras 3 semanas, com leve recuo na semana 4. O tempo médio por sessão estabilizou em 12 minutos. O uso do Chat IA cresceu 18% no período, com pico na semana 3. A taxa de retorno atingiu 70%, indicando boa retenção dos alunos. Recomenda-se manter o ritmo de novos conteúdos para sustentar o crescimento.",
  trilhasTabela: [
    ["Entendendo a IA", "4", "1.247", "72%", "8.5", "45 min"],
    ["Criando Prompts", "4", "892", "58%", "7.8", "60 min"],
    ["Criando Soluções", "4", "534", "41%", "8.2", "75 min"],
    ["Meu Primeiro App", "4", "312", "28%", "8.7", "90 min"],
  ],
  trilhasAnalise: "No último mês, a trilha 'Entendendo a IA' manteve a maior taxa de conclusão (72%). 85 alunos avançaram para a trilha 'Criando Prompts'. A trilha 'Meu Primeiro App' registrou 12 novas conclusões, mantendo a nota média mais alta (8.7). Recomenda-se criar conteúdos de transição entre trilhas para reduzir a evasão.",
  analiseGeral: "No último mês, a plataforma LabIA registrou 142 novos alunos e 1.890 missões concluídas. A taxa de engajamento subiu para 75%, um aumento de 3 pontos percentuais. O uso do Chat IA cresceu 18% e o tempo médio por sessão estabilizou em 12 minutos. As escolas parceiras mantiveram desempenho consistente, com o Instituto Tech liderando e o Colégio Inovação necessitando de atenção especial.",
  recomendacoes: [
    { title: "Plano de ação para Colégio Inovação", desc: "Implementar programa intensivo de treinamento docente e campanhas de engajamento para elevar os índices de 47% de progresso e 54% de engajamento." },
    { title: "Programa de mentoria para nível Iniciante", desc: "Implementar sistema de mentoria onde alunos de nível Cientista e Mestre auxiliem os Iniciantes, reduzindo a taxa de abandono nos primeiros dias." },
    { title: "Gamificação avançada", desc: "Adicionar competições semanais entre escolas e rankings dinâmicos para aumentar o engajamento geral." },
    { title: "Conteúdo adaptativo por escola", desc: "Personalizar trilhas de acordo com o perfil de cada escola parceira, considerando as diferenças de desempenho." },
    { title: "Relatórios para pais e responsáveis", desc: "Criar versão simplificada do relatório de progresso para compartilhar com as famílias." },
  ],
};

// ============================================================
// Período: Últimos 90 dias
// ============================================================
const data90d: ReportDataSet = {
  periodo: {
    label: "Últimos 90 dias",
    descricao: "07/dez 2025 — 07/mar 2026",
    dataInicio: "07/12/2025",
    dataFim: "07/03/2026",
  },
  resumo: {
    totalAlunos: "1.247",
    totalAlunosDelta: "+389",
    missoesConc: "5.280",
    missoesDelta: "+22%",
    taxaEngajamento: "76%",
    engajamentoDelta: "+4%",
    escolasParceiras: "18",
    escolasDelta: "+2",
  },
  desempenhoMensal: [
    { mes: "Dez", novosAlunos: 98, missoesConc: 540, taxaEngaj: 70 },
    { mes: "Jan", novosAlunos: 178, missoesConc: 750, taxaEngaj: 78 },
    { mes: "Fev", novosAlunos: 203, missoesConc: 890, taxaEngaj: 76 },
    { mes: "Mar*", novosAlunos: 189, missoesConc: 1020, taxaEngaj: 73 },
  ],
  desempenhoMensalTabela: [
    ["Dezembro 2025", "98", "540", "70%"],
    ["Janeiro 2026", "178", "750", "78%"],
    ["Fevereiro 2026", "203", "890", "76%"],
    ["Março 2026*", "189", "1.020", "73%"],
  ],
  desempenhoMensalTotal: ["Total / Média", "668", "3.200", "74,3%"],
  escolas: [
    { escola: "Nova Era", alunos: 245, progresso: 78, engajamento: 82, missoesPorAluno: 4.2, ranking: "2º" },
    { escola: "C. Futuro", alunos: 189, progresso: 65, engajamento: 71, missoesPorAluno: 3.1, ranking: "4º" },
    { escola: "Inst. Tech", alunos: 156, progresso: 82, engajamento: 88, missoesPorAluno: 4.8, ranking: "1º" },
    { escola: "E. Criativa", alunos: 134, progresso: 71, engajamento: 75, missoesPorAluno: 3.6, ranking: "3º" },
    { escola: "C. Inovação", alunos: 98, progresso: 45, engajamento: 52, missoesPorAluno: 2.1, ranking: "5º" },
  ],
  escolasTabela: [
    ["Instituto Tech", "156", "82%", "88%", "4.8", "1º"],
    ["Escola Nova Era", "245", "78%", "82%", "4.2", "2º"],
    ["Escola Criativa", "134", "71%", "75%", "3.6", "3º"],
    ["Colégio Futuro", "189", "65%", "71%", "3.1", "4º"],
    ["Colégio Inovação", "98", "45%", "52%", "2.1", "5º"],
  ],
  escolasResumo: {
    totalEscolas: "5",
    totalAlunos: "822",
    alunosDelta: "+120",
    progressoMedio: "68,2%",
    progressoDelta: "+6%",
    engajamentoMedio: "73,6%",
    engajamentoDelta: "+5%",
  },
  escolasDetalhamento: [
    { nome: "Instituto Tech", alunos: 156, progresso: 82, engajamento: 88, destaques: "Maior taxa de engajamento. 23 alunos no nível Cientista. Programa de monitoria ativo.", desafios: "Capacidade limitada para novos alunos. Necessita de mais trilhas avançadas." },
    { nome: "Escola Nova Era", alunos: 245, progresso: 78, engajamento: 82, destaques: "Maior número de alunos. Boa distribuição entre níveis. Professores engajados.", desafios: "Taxa de conclusão de missões abaixo da média em turmas do 6º ano." },
    { nome: "Escola Criativa", alunos: 134, progresso: 71, engajamento: 75, destaques: "Forte em atividades criativas. Bom uso do Chat IA. Projetos interdisciplinares.", desafios: "Baixa frequência de acesso nos finais de semana. Necessita de gamificação." },
    { nome: "Colégio Futuro", alunos: 189, progresso: 65, engajamento: 71, destaques: "Crescimento constante mês a mês. Boa infraestrutura tecnológica.", desafios: "Alta rotatividade de professores. Necessita de treinamento docente." },
    { nome: "Colégio Inovação", alunos: 98, progresso: 45, engajamento: 52, destaques: "Escola mais recente na plataforma. Direção comprometida com o projeto.", desafios: "Baixo engajamento geral. Infraestrutura limitada. Necessita de plano de ação urgente." },
  ],
  niveis: [
    { name: "Iniciante", value: 298, color: "#9CA3AF", percentual: "23,9%", descricao: "Alunos que estão começando a jornada" },
    { name: "Explorador", value: 435, color: "#7C3AED", percentual: "34,9%", descricao: "Alunos explorando conceitos de IA" },
    { name: "Inventor", value: 295, color: "#F97316", percentual: "23,7%", descricao: "Alunos criando soluções com IA" },
    { name: "Cientista", value: 158, color: "#10B981", percentual: "12,7%", descricao: "Alunos com domínio avançado" },
    { name: "Mestre", value: 61, color: "#EC4899", percentual: "4,9%", descricao: "Alunos que completaram todas as trilhas" },
  ],
  habilidades: [
    { skill: "Conceitos IA", A: 84, B: 72, status: "Acima da meta" },
    { skill: "Prompts", A: 77, B: 65, status: "Acima da meta" },
    { skill: "Pensamento Crítico", A: 71, B: 58, status: "Acima da meta" },
    { skill: "Criatividade", A: 87, B: 70, status: "Acima da meta" },
    { skill: "Resolução Prob.", A: 64, B: 55, status: "Acima da meta" },
    { skill: "Colaboração", A: 79, B: 68, status: "Acima da meta" },
  ],
  habilidadesTabela: [
    ["Conceitos de IA", "84", "72", "Acima da meta"],
    ["Criação de Prompts", "77", "65", "Acima da meta"],
    ["Pensamento Crítico", "71", "58", "Acima da meta"],
    ["Criatividade", "87", "70", "Acima da meta"],
    ["Resolução de Problemas", "64", "55", "Acima da meta"],
    ["Colaboração", "79", "68", "Acima da meta"],
  ],
  habilidadesAnalise: "Nos últimos 90 dias, todas as habilidades mantiveram-se acima das metas. Criatividade (87%) e Conceitos de IA (84%) lideram. Resolução de Problemas (64%) é a habilidade com menor pontuação, mas ainda supera a meta de 55%. Houve melhoria geral de 2-3 pontos percentuais em relação ao trimestre anterior.",
  engajamentoResumo: {
    sessoesTotais: "14.220",
    sessoesDelta: "+22%",
    tempoMedio: "12 min",
    tempoDelta: "+2 min",
    taxaRetorno: "68%",
    retornoDelta: "+6%",
    nps: "72",
    npsDelta: "+4",
  },
  engajamentoTabela: [
    ["Dezembro 2025", "2.150", "10 min", "60%", "52", "410", "70%"],
    ["Janeiro 2026", "3.120", "12 min", "70%", "78", "750", "78%"],
    ["Fevereiro 2026", "3.450", "13 min", "72%", "85", "890", "76%"],
    ["Março 2026*", "2.720", "12 min", "68%", "72", "680", "73%"],
  ],
  engajamentoAnalise: "O engajamento trimestral apresentou tendência de alta consistente, com pico em janeiro (78%). A queda em dezembro é sazonal (férias escolares). O tempo médio por sessão cresceu de 10 para 13 minutos. O uso do Chat IA triplicou no período. Recomenda-se manter campanhas de engajamento durante períodos de férias.",
  trilhasTabela: [
    ["Entendendo a IA", "4", "1.247", "72%", "8.5", "45 min"],
    ["Criando Prompts", "4", "892", "58%", "7.8", "60 min"],
    ["Criando Soluções", "4", "534", "41%", "8.2", "75 min"],
    ["Meu Primeiro App", "4", "312", "28%", "8.7", "90 min"],
  ],
  trilhasAnalise: "Nos últimos 90 dias, a trilha 'Entendendo a IA' manteve a maior taxa de conclusão (72%). A taxa de conclusão diminui progressivamente nas trilhas seguintes, o que é esperado dado o aumento de complexidade. A trilha 'Meu Primeiro App' tem a menor taxa (28%), mas a maior nota média (8.7). Recomenda-se criar conteúdos de transição entre trilhas.",
  analiseGeral: "Nos últimos 90 dias, a plataforma LabIA registrou 389 novos alunos e 5.280 missões concluídas. A taxa de engajamento subiu para 76%, com destaque para janeiro que atingiu 78%. O uso do Chat IA triplicou e o tempo médio por sessão cresceu de 10 para 13 minutos. As escolas parceiras apresentaram crescimento consistente, com exceção do Colégio Inovação que requer atenção especial.",
  recomendacoes: [
    { title: "Aumentar atividades de Resolução de Problemas", desc: "Criar missões adicionais focadas em desafios práticos para fortalecer essa habilidade, que apresenta a menor pontuação entre todas as avaliadas." },
    { title: "Programa de mentoria para nível Iniciante", desc: "Implementar sistema de mentoria onde alunos de nível Cientista e Mestre auxiliem os Iniciantes, reduzindo a taxa de abandono nos primeiros dias." },
    { title: "Gamificação avançada", desc: "Adicionar competições semanais entre escolas e rankings dinâmicos para aumentar o engajamento, especialmente no Colégio Inovação (52%)." },
    { title: "Conteúdo adaptativo por escola", desc: "Personalizar trilhas de acordo com o perfil de cada escola parceira, considerando as diferenças de desempenho identificadas." },
    { title: "Relatórios para pais e responsáveis", desc: "Criar versão simplificada do relatório de progresso para compartilhar com as famílias, aumentando o engajamento fora da plataforma." },
  ],
};

// ============================================================
// Período: Último ano
// ============================================================
const data1a: ReportDataSet = {
  periodo: {
    label: "Último ano",
    descricao: "Março 2025 — Março 2026",
    dataInicio: "07/03/2025",
    dataFim: "07/03/2026",
  },
  resumo: {
    totalAlunos: "1.247",
    totalAlunosDelta: "+847",
    missoesConc: "8.432",
    missoesDelta: "+310%",
    taxaEngajamento: "73%",
    engajamentoDelta: "+18%",
    escolasParceiras: "18",
    escolasDelta: "+13",
  },
  desempenhoMensal: [
    { mes: "Mar*25", novosAlunos: 45, missoesConc: 120, taxaEngaj: 55 },
    { mes: "Abr", novosAlunos: 52, missoesConc: 180, taxaEngaj: 58 },
    { mes: "Mai", novosAlunos: 68, missoesConc: 240, taxaEngaj: 60 },
    { mes: "Jun", novosAlunos: 55, missoesConc: 210, taxaEngaj: 58 },
    { mes: "Jul", novosAlunos: 42, missoesConc: 180, taxaEngaj: 55 },
    { mes: "Ago", novosAlunos: 78, missoesConc: 310, taxaEngaj: 63 },
    { mes: "Set", novosAlunos: 89, missoesConc: 320, taxaEngaj: 68 },
    { mes: "Out", novosAlunos: 124, missoesConc: 480, taxaEngaj: 72 },
    { mes: "Nov", novosAlunos: 156, missoesConc: 620, taxaEngaj: 75 },
    { mes: "Dez", novosAlunos: 98, missoesConc: 540, taxaEngaj: 70 },
    { mes: "Jan", novosAlunos: 178, missoesConc: 750, taxaEngaj: 78 },
    { mes: "Fev", novosAlunos: 203, missoesConc: 890, taxaEngaj: 76 },
    { mes: "Mar*26", novosAlunos: 189, missoesConc: 1020, taxaEngaj: 73 },
  ],
  desempenhoMensalTabela: [
    ["Março 2025", "45", "120", "55%"],
    ["Abril 2025", "52", "180", "58%"],
    ["Maio 2025", "68", "240", "60%"],
    ["Junho 2025", "55", "210", "58%"],
    ["Julho 2025", "42", "180", "55%"],
    ["Agosto 2025", "78", "310", "63%"],
    ["Setembro 2025", "89", "320", "68%"],
    ["Outubro 2025", "124", "480", "72%"],
    ["Novembro 2025", "156", "620", "75%"],
    ["Dezembro 2025", "98", "540", "70%"],
    ["Janeiro 2026", "178", "750", "78%"],
    ["Fevereiro 2026", "203", "890", "76%"],
    ["Março 2026*", "189", "1.020", "73%"],
  ],
  desempenhoMensalTotal: ["Total / Média", "1.577", "6.280", "67%"],
  escolas: [
    { escola: "Nova Era", alunos: 245, progresso: 78, engajamento: 82, missoesPorAluno: 4.2, ranking: "2º" },
    { escola: "C. Futuro", alunos: 189, progresso: 65, engajamento: 71, missoesPorAluno: 3.1, ranking: "4º" },
    { escola: "Inst. Tech", alunos: 156, progresso: 82, engajamento: 88, missoesPorAluno: 4.8, ranking: "1º" },
    { escola: "E. Criativa", alunos: 134, progresso: 71, engajamento: 75, missoesPorAluno: 3.6, ranking: "3º" },
    { escola: "C. Inovação", alunos: 98, progresso: 45, engajamento: 52, missoesPorAluno: 2.1, ranking: "5º" },
  ],
  escolasTabela: [
    ["Instituto Tech", "156", "82%", "88%", "4.8", "1º"],
    ["Escola Nova Era", "245", "78%", "82%", "4.2", "2º"],
    ["Escola Criativa", "134", "71%", "75%", "3.6", "3º"],
    ["Colégio Futuro", "189", "65%", "71%", "3.1", "4º"],
    ["Colégio Inovação", "98", "45%", "52%", "2.1", "5º"],
  ],
  escolasResumo: {
    totalEscolas: "5",
    totalAlunos: "822",
    alunosDelta: "+622",
    progressoMedio: "68,2%",
    progressoDelta: "+28%",
    engajamentoMedio: "73,6%",
    engajamentoDelta: "+23%",
  },
  escolasDetalhamento: [
    { nome: "Instituto Tech", alunos: 156, progresso: 82, engajamento: 88, destaques: "Primeira escola parceira. Maior taxa de engajamento anual. 23 alunos no nível Cientista.", desafios: "Capacidade limitada. Necessita de trilhas avançadas e programa de extensão." },
    { nome: "Escola Nova Era", alunos: 245, progresso: 78, engajamento: 82, destaques: "Maior número de alunos. Crescimento de 180% no ano. Professores muito engajados.", desafios: "Taxa de conclusão abaixo da média em turmas do 6º ano. Necessita de conteúdo adaptado." },
    { nome: "Escola Criativa", alunos: 134, progresso: 71, engajamento: 75, destaques: "Forte em atividades criativas. Melhor uso do Chat IA entre todas as escolas.", desafios: "Baixa frequência nos finais de semana. Necessita de gamificação e desafios extras." },
    { nome: "Colégio Futuro", alunos: 189, progresso: 65, engajamento: 71, destaques: "Crescimento constante. Boa infraestrutura. Parceria sólida com a direção.", desafios: "Alta rotatividade de professores. Necessita de programa de formação docente contínua." },
    { nome: "Colégio Inovação", alunos: 98, progresso: 45, engajamento: 52, destaques: "Escola mais recente (6 meses). Direção comprometida. Potencial de crescimento alto.", desafios: "Baixo engajamento geral. Infraestrutura limitada. Necessita de plano de ação urgente e investimento." },
  ],
  niveis: [
    { name: "Iniciante", value: 312, color: "#9CA3AF", percentual: "25%", descricao: "Alunos que estão começando a jornada" },
    { name: "Explorador", value: 428, color: "#7C3AED", percentual: "34,3%", descricao: "Alunos explorando conceitos de IA" },
    { name: "Inventor", value: 289, color: "#F97316", percentual: "23,2%", descricao: "Alunos criando soluções com IA" },
    { name: "Cientista", value: 156, color: "#10B981", percentual: "12,5%", descricao: "Alunos com domínio avançado" },
    { name: "Mestre", value: 62, color: "#EC4899", percentual: "5%", descricao: "Alunos que completaram todas as trilhas" },
  ],
  habilidades: [
    { skill: "Conceitos IA", A: 85, B: 72, status: "Acima da meta" },
    { skill: "Prompts", A: 78, B: 65, status: "Acima da meta" },
    { skill: "Pensamento Crítico", A: 72, B: 58, status: "Acima da meta" },
    { skill: "Criatividade", A: 88, B: 70, status: "Acima da meta" },
    { skill: "Resolução Prob.", A: 65, B: 55, status: "Acima da meta" },
    { skill: "Colaboração", A: 80, B: 68, status: "Acima da meta" },
  ],
  habilidadesTabela: [
    ["Conceitos de IA", "85", "72", "Acima da meta"],
    ["Criação de Prompts", "78", "65", "Acima da meta"],
    ["Pensamento Crítico", "72", "58", "Acima da meta"],
    ["Criatividade", "88", "70", "Acima da meta"],
    ["Resolução de Problemas", "65", "55", "Acima da meta"],
    ["Colaboração", "80", "68", "Acima da meta"],
  ],
  habilidadesAnalise: "Ao longo do último ano, todas as habilidades avaliadas superaram as metas estabelecidas. Criatividade (88%) e Conceitos de IA (85%) lideram o ranking. A habilidade de Resolução de Problemas (65%) apresenta a menor pontuação, mas supera a meta de 55%. Houve evolução significativa em todas as competências desde o início do programa.",
  engajamentoResumo: {
    sessoesTotais: "18.450",
    sessoesDelta: "+280%",
    tempoMedio: "12 min",
    tempoDelta: "+5 min",
    taxaRetorno: "68%",
    retornoDelta: "+28%",
    nps: "72",
    npsDelta: "+22",
  },
  engajamentoTabela: [
    ["Mar/25", "450", "7 min", "40%", "12", "45", "55%"],
    ["Abr/25", "620", "7 min", "42%", "18", "68", "58%"],
    ["Mai/25", "780", "8 min", "45%", "24", "95", "60%"],
    ["Jun/25", "690", "8 min", "43%", "21", "82", "58%"],
    ["Jul/25", "580", "7 min", "40%", "18", "70", "55%"],
    ["Ago/25", "1.120", "9 min", "52%", "35", "180", "63%"],
    ["Set/25", "1.890", "9 min", "58%", "45", "320", "68%"],
    ["Out/25", "2.340", "10 min", "62%", "56", "480", "72%"],
    ["Nov/25", "2.780", "11 min", "65%", "68", "620", "75%"],
    ["Dez/25", "2.150", "10 min", "60%", "52", "410", "70%"],
    ["Jan/26", "3.120", "12 min", "70%", "78", "750", "78%"],
    ["Fev/26", "3.450", "13 min", "72%", "85", "890", "76%"],
    ["Mar/26*", "2.720", "12 min", "68%", "72", "680", "73%"],
  ],
  engajamentoAnalise: "O engajamento anual apresentou crescimento exponencial, partindo de 450 sessões em março de 2025 para mais de 3.000 em fevereiro de 2026. O tempo médio por sessão cresceu de 7 para 13 minutos. O uso do Chat IA multiplicou-se por 20x no período. A taxa de retorno subiu de 40% para 72%. A queda em dezembro e julho é sazonal (férias). Recomenda-se manter campanhas durante férias e investir em novas funcionalidades para sustentar o crescimento.",
  trilhasTabela: [
    ["Entendendo a IA", "4", "1.247", "72%", "8.5", "45 min"],
    ["Criando Prompts", "4", "892", "58%", "7.8", "60 min"],
    ["Criando Soluções", "4", "534", "41%", "8.2", "75 min"],
    ["Meu Primeiro App", "4", "312", "28%", "8.7", "90 min"],
  ],
  trilhasAnalise: "No último ano, a trilha 'Entendendo a IA' consolidou-se como porta de entrada com 72% de conclusão. A taxa diminui progressivamente nas trilhas seguintes, o que é esperado dado o aumento de complexidade. A trilha 'Meu Primeiro App' tem a menor taxa (28%), mas a maior nota média (8.7), indicando que os alunos que chegam até ela estão altamente engajados. Recomenda-se criar conteúdos de transição e trilhas opcionais para reduzir a evasão entre trilhas.",
  analiseGeral: "No último ano, a plataforma LabIA cresceu de 400 para 1.247 alunos ativos, um aumento de 212%. O total de missões concluídas atingiu 8.432, com média de 6,8 missões por aluno. A taxa de engajamento subiu de 55% para 73%, demonstrando maturidade crescente da plataforma. O número de escolas parceiras cresceu de 5 para 18. O uso do Chat IA multiplicou-se por 20x, tornando-se uma das funcionalidades mais populares.",
  recomendacoes: [
    { title: "Aumentar atividades de Resolução de Problemas", desc: "Criar missões adicionais focadas em desafios práticos para fortalecer essa habilidade, que apresenta a menor pontuação (65%) entre todas as avaliadas." },
    { title: "Programa de mentoria para nível Iniciante", desc: "Implementar sistema de mentoria onde alunos de nível Cientista e Mestre auxiliem os Iniciantes, reduzindo a taxa de abandono nos primeiros dias." },
    { title: "Gamificação avançada", desc: "Adicionar competições semanais entre escolas e rankings dinâmicos para aumentar o engajamento, especialmente no Colégio Inovação que apresenta a menor taxa (52%)." },
    { title: "Conteúdo adaptativo por escola", desc: "Personalizar trilhas de acordo com o perfil de cada escola parceira, considerando as diferenças de desempenho identificadas no comparativo." },
    { title: "Relatórios para pais e responsáveis", desc: "Criar versão simplificada do relatório de progresso para compartilhar com as famílias, aumentando o engajamento fora da plataforma." },
  ],
};

// ============================================================
// Mapa de dados por período
// ============================================================
const dataMap: Record<PeriodoKey, ReportDataSet> = {
  "7d": data7d,
  "30d": data30d,
  "90d": data90d,
  "1a": data1a,
};

export function getReportData(periodo: PeriodoKey): ReportDataSet {
  return dataMap[periodo];
}

export function getPeriodoLabel(periodo: PeriodoKey): string {
  return dataMap[periodo].periodo.label;
}
