export const replayCategories = ['Todas', 'Fundamental', 'Avançado', 'NoGi', 'Kids', 'Open Mat'];

export const replays = [
  { id: 'guarda-fechada', title: 'Aula Fundamental · Guarda fechada', meta: 'HOJE · 18H30 · PROF. HENRIQUE', camera: 'TATAME 1', duration: '58:12', sampleDuration: 16, category: 'Fundamental', level: 'Faixa branca e azul', description: 'Quebra de postura, controle das pegadas e uma sequência segura até a finalização.', src: '/uploads/demo-guarda.mp4' },
  { id: 'passagem-guarda', title: 'Avançado · Passagem de guarda', meta: 'HOJE · 19H30 · PROF. HENRIQUE', camera: 'TATAME 1', duration: '1:02:47', sampleDuration: 16, category: 'Avançado', level: 'A partir da faixa azul', description: 'Pressão, domínio da linha dos joelhos e ajustes para estabilizar os três pontos.', src: '/uploads/demo-passagem.mp4' },
  { id: 'ataques-perna', title: 'NoGi · Ataques de perna', meta: 'SEX · 12H · PROF. HENRIQUE', camera: 'TATAME 2', duration: '49:05', sampleDuration: 16, category: 'NoGi', level: 'Intermediário', description: 'Entradas controladas, posicionamento do quadril e segurança nos ataques de perna.', src: '/uploads/demo-guarda.mp4' },
  { id: 'open-mat', title: 'Open Mat · Rolas livres', meta: 'SÁB · 10H · TODOS OS NÍVEIS', camera: 'TATAME 1+2', duration: '1:31:20', sampleDuration: 16, category: 'Open Mat', level: 'Todos os níveis', description: 'Os melhores rounds do sábado com visão completa dos dois tatames.', src: '/uploads/demo-passagem.mp4' },
  { id: 'kids-quedas', title: 'Kids 6–9 · Quedas e controle', meta: 'SEG · 18H30 · TURMA INFANTIL', camera: 'TATAME 2', duration: '41:33', sampleDuration: 6, category: 'Kids', level: 'Kids 6–9 anos', description: 'Uma aula lúdica de base, equilíbrio, quedas e controle com segurança.', src: '/uploads/demo-kids.mp4' },
  { id: 'super-aula', title: 'Super Aula · Gi e NoGi', meta: 'SEX · 18H30 · AULA ABERTA', camera: 'TATAME 1', duration: '1:12:08', sampleDuration: 16, category: 'NoGi', level: 'Todos os níveis', description: 'Conceitos que funcionam com e sem kimono, seguidos de rounds situacionais.', src: '/uploads/demo-passagem.mp4' }
];

export const schedules = [
  { name: 'ADULTOS', times: 'Seg–Qui · 6h · 7h · 9h30 · 12h · 15h30 · 18h30 (Fundamental) · 19h30 — Sex · 12h (NoGi) · 18h30 (Super Aula)', location: 'AGORA', live: true },
  { name: 'KIDS', times: 'Seg/Qua · 9h30 (3–5 anos) · 18h30 (6–9 anos) — Ter/Qui · 18h30 (9–12 anos)', location: 'TATAME 2' },
  { name: 'PERFORMANCE', times: 'Ter/Qui · 10h30 (a partir da faixa azul) — NoGi Performance · Seg/Qua · 19h30', location: 'TATAME 1' },
  { name: 'OPEN MAT', times: 'Sábado · 10h — câmera ligada o treino inteiro, replay disponível até segunda', location: 'TATAME 1' }
];
