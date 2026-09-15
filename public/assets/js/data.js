/* ==========================================================================
   CA CURSOS - Base de dados do site (cursos, aulas abertas e blog)
   Fonte: base de conhecimento oficial CA Cursos.
   ========================================================================== */

var CA = {};
window.CA = CA;

/* Configurações gerais ---------------------------------------------------- */
CA.config = {
  nome:           "CA Cursos",
  descricao:      "Escola especializada em formação profissional na área de manutenção de celulares.",
  endereco:       "Rua 2, 115, Goiânia, 74013-020, GO, BR",
  site:           "http://www.cacursos.com.br/",
  instagram:      "https://www.instagram.com/cacursos/",
  instagramHandle:"@cacursos",
  facebook:       "https://www.facebook.com/cacursos",
  whatsapp:       "https://wa.me/5562984002318",
  whatsappDisplay:"+55 62 98400-2318",
  youtube:        "https://youtube.com/@manualdocelular",
  responsavel:    "Rafael",
  pecas:          "(62) 99119-7301",
  pecasWa:        "https://wa.me/5562991197301",
  equipamentos:   "(62) 98417-8183",
  equipamentosWa: "https://wa.me/5562984178183",
  /* Avaliações oficiais no Google (perfil ao vivo via Places API) */
  google: {
    name: "Ca Cursos - Escola Técnica em Manutenção de Smartphones",
    placeId: "ChIJ6zwvuGPxXpMRyG7cyC6llfw",
    apiKey: "AIzaSyAh6tU7sf0vJSAPSkMaec9A8dAuW4eqie0",
    rating: 4.8,
    reviewCount: 856,
    /* Só 5 estrelas nos cards; a Places API devolve no máx. ~5 por idioma. */
    minCardRating: 5,
    carouselLimit: 30,
    profileUrl: "https://share.google/6o7S9gzkTDnAGU3CD",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJ6zwvuGPxXpMRyG7cyC6llfw",
    writeUrl: "https://search.google.com/local/writereview?placeid=ChIJ6zwvuGPxXpMRyG7cyC6llfw",
    mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJ6zwvuGPxXpMRyG7cyC6llfw",
    embedUrl: "https://www.google.com/maps?q=Ca%20Cursos%20-%20Escola%20T%C3%A9cnica%20em%20Manuten%C3%A7%C3%A3o%20de%20Smartphones%2C%20Rua%202%2C%20115%2C%20Goi%C3%A2nia%2C%20GO&hl=pt-BR&z=17&output=embed",
    featuredReviews: [
      {
        name: "Erick Patrick",
        relativeDate: "há 6 meses",
        rating: 5,
        text: "Tudo ótimo, a empresa além de ser indonea disponibiliza a bancada pra você sair confortável e todas as peças que você precisar sair a preço de custo, o condutor das aulas Matheus explica bem e aprendi muito com a escola",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocJhXChaGWxDjzl5cE0U6LZ9lJwPIXVe52UtEn73iT24Sa6uIA=s128-c0x00000000-cc-rp-mo",
        url: "https://www.google.com/maps/contrib/100867063440510748512/reviews"
      },
      {
        name: "Lara Tavares",
        relativeDate: "há 4 meses",
        rating: 5,
        text: "Foi uma experiência, sensacional. Didático, prático. De fácil entendimento e muito acolhedor. Foram 5 dias incríveis. E pretendo voltar para mais cursos!!",
        avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUNlpv4A2oMcDRUSVYpJ6IxejOYLtJ4sSZpw7aDCHHIKx2_1oFyiQ=s128-c0x00000000-cc-rp-mo",
        url: "https://www.google.com/maps/contrib/108424754876266286303/reviews"
      },
      {
        name: "Ruan Carlos",
        relativeDate: "há 2 meses",
        rating: 5,
        text: "Ótima escola com bons proficionais e com uma atenção muito boa nas dificuldades que o aluno possa apresentar que trás um otimo aprendizado.",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocL3wvSip0_c7QGd6jM4XLm-3C-Y8oHXmCbseKVslK00xIN4lQ=s128-c0x00000000-cc-rp-mo",
        url: "https://www.google.com/maps/contrib/111051818676290252378/reviews"
      }
    ]
  }
};
CA.wa = (msg) => {
  const base = CA.config.whatsapp;
  const text = msg || "Olá! Quero saber mais sobre os cursos da CA Cursos.";
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(text)}`;
};

/* Categorias -------------------------------------------------------------- */
CA.categorias = [
  {
    id:"iniciante", nome:"Iniciante", icone:"📱", desc:"Do zero à bancada",
    cta:"Ver cursos",
    image:"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    gradient:"linear-gradient(to top, rgba(15,23,42,.92) 8%, rgba(255,106,0,.55) 100%)"
  },
  {
    id:"intermediario", nome:"Intermediário", icone:"🔧", desc:"Reparo em placa",
    cta:"Ver cursos",
    image:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    gradient:"linear-gradient(to top, rgba(15,23,42,.92) 8%, rgba(14,116,144,.65) 100%)"
  },
  {
    id:"avancado", nome:"Avançado", icone:"🔬", desc:"Board Repair e iPhone",
    cta:"Ver cursos",
    image:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    gradient:"linear-gradient(to top, rgba(15,23,42,.94) 8%, rgba(30,41,59,.75) 100%)"
  },
  {
    id:"eventos", nome:"Eventos", icone:"🎤", desc:"Encontro de Técnicos",
    cta:"Ver eventos",
    image:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    gradient:"linear-gradient(to top, rgba(15,23,42,.92) 8%, rgba(180,83,9,.60) 100%)"
  },
  {
    id:"entrada", nome:"Avulso", icone:"📺", desc:"Troca de telas",
    cta:"Ver cursos",
    image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    gradient:"linear-gradient(to top, rgba(15,23,42,.92) 8%, rgba(2,132,199,.60) 100%)"
  }
];

/* Cursos ------------------------------------------------------------------ */
CA.cursos = [
  {
    slug:"curso-presencial-iniciante",
    titulo:"Curso Presencial (Iniciante)",
    categoria:"iniciante", nivel:"Iniciante",
    glyph:"📱", destaque:true, badge:"Mais procurado",
    horas:40, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"Presencial · 100% prático",
    acesso:"1 ano de acesso ao Curso Online (Iniciante)",
    preco:1999.99, precoDe:null, parcelas:"12x de R$ 194,00",
    boleto:"Entrada de R$ 1.000,00 + 4 boletos de R$ 350,00",
    reserva:"R$ 300,00 via PIX (descontado do total)",
    link:null,
    resumo:"Para iniciantes absolutos. Bancada individual, equipamentos da escola e 40 horas 100% práticas para você sair pronto para faturar.",
    para:[
      "Iniciantes absolutos, sem experiência prévia",
      "Quem quer aprender na prática, com bancada individual",
      "Quem mora em Goiânia ou na região e prefere o presencial"
    ],
    aprende:[
      "Troca de tela, bateria e conector (os serviços que mais dão dinheiro)",
      "Reparo de câmera, microfone, alto-falante e carcaça",
      "Desoxidação e primeiros reparos em placa",
      "Atualizações e soluções de software",
      "Identificação de defeitos e diagnóstico dos aparelhos",
      "Uso de ferramentas profissionais: multímetro, fonte e amperímetro"
    ],
    beneficios:[
      "Certificado de conclusão",
      "Garantia de resultado (60 dias)",
      "1 ano de acesso ao Curso Online (Iniciante)",
      "Grupo de suporte",
      "Lista de fornecedores",
      "Programa de estágio, quando disponível",
      "Aluno pode trazer aparelho próprio para praticar"
    ],
    turmas:[
      { periodo:"Integral", dias:"Segunda a sexta, 5 dias", horario:"08:45 às 17:45", data:"17/08/2026" },
      { periodo:"Matutino", dias:"Segunda a sexta, 10 dias", horario:"08:45 às 12:45", data:"17/08/2026" },
      { periodo:"Vespertino", dias:"Segunda a sexta, 10 dias", horario:"13:45 às 17:45", data:"17/08/2026" },
      { periodo:"Noturno", dias:"Segunda a sexta, 10 dias", horario:"18:30 às 22:30", data:"24/08/2026" },
      { periodo:"Intensivo (sábados)", dias:"5 sábados", horario:"08:45 às 17:45", data:"15/08/2026" }
    ],
    modulos:[
      { titulo:"O que você vai aprender", aulas:[
        ["Troca de tela, bateria e conector",""],
        ["Reparo de câmera, microfone, alto-falante e carcaça",""],
        ["Desoxidação e primeiros reparos em placa",""],
        ["Atualizações e soluções de software",""],
        ["Diagnóstico e identificação de defeitos",""],
        ["Multímetro, fonte e amperímetro na prática",""]
      ]}
    ],
    faq:[
      ["Preciso ter experiência anterior?","Não. O curso é para iniciantes absolutos, sem pré-requisitos."],
      ["Qual a carga horária?","40 horas, 100% práticas. Integral e Intensivo: 5 dias/sábados de 8h. Matutino, Vespertino e Noturno: 10 dias de 4h."],
      ["Tem certificado?","Sim, certificado de conclusão."],
      ["Como reservo a vaga?","Reserva de R$ 300,00 via PIX, descontada do valor total. É a única reserva automatizada da CA Cursos."],
      ["Tem garantia?","Sim. Garantia de resultado: meta de faturar R$ 2.000,00 em até 60 dias após a conclusão, com regras de reforço e reembolso se necessário."]
    ]
  },
  {
    slug:"curso-online-iniciante",
    titulo:"Curso Online (Iniciante)",
    categoria:"iniciante", nivel:"Iniciante",
    glyph:"💻", destaque:true, badge:"Online",
    horas:40, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"100% online · aulas gravadas",
    acesso:"1 ano",
    preco:497, precoDe:null, parcelas:"12x de R$ 51,40",
    link:"https://pay.hotmart.com/F85214527E?off=2awmskv6",
    resumo:"Mesmo conteúdo do presencial, em aulas gravadas. Ideal para quem está fora de Goiânia ou tem pouca disponibilidade de horário.",
    para:[
      "Iniciantes, especialmente fora de Goiânia",
      "Quem precisa de flexibilidade de horário",
      "Quem quer o mesmo conteúdo do presencial no formato EAD"
    ],
    aprende:[
      "Troca de tela, bateria e conector",
      "Reparo de câmera, microfone, alto-falante e carcaça",
      "Desoxidação e primeiros reparos em placa",
      "Atualizações e soluções de software",
      "Diagnóstico dos aparelhos",
      "Uso de multímetro, fonte e amperímetro"
    ],
    beneficios:[
      "Certificado de conclusão",
      "Grupo de suporte",
      "Lista de fornecedores",
      "Garantia de resultado",
      "1 ano de acesso"
    ],
    modulos:[
      { titulo:"Conteúdo (mesmo do presencial)", aulas:[
        ["Troca de tela, bateria e conector",""],
        ["Reparo de câmera, microfone, alto-falante e carcaça",""],
        ["Desoxidação e primeiros reparos em placa",""],
        ["Atualizações e soluções de software",""],
        ["Diagnóstico e identificação de defeitos",""],
        ["Ferramentas profissionais na prática",""]
      ]}
    ],
    faq:[
      ["É o mesmo conteúdo do presencial?","Sim. O Curso Online Iniciante tem o mesmo conteúdo do Curso Presencial Iniciante."],
      ["Por quanto tempo tenho acesso?","1 ano de acesso."],
      ["Tem certificado e garantia?","Sim. Certificado de conclusão e garantia de resultado."],
      ["Como me matriculo?","Matrícula direta pelo link de pagamento, sem reserva."]
    ]
  },
  {
    slug:"curso-intermediario-presencial",
    titulo:"Curso Intermediário (Presencial)",
    categoria:"intermediario", nivel:"Intermediário",
    glyph:"🔧", destaque:true, badge:"Presencial",
    horas:0, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"Presencial · ministrado por Rafael · turmas em formação",
    acesso:"Quem faz o presencial ganha acesso ao Intermediário Online",
    preco:2500, precoDe:null, parcelas:"12x de R$ 243,52",
    link:null,
    resumo:"Aprofunde leitura de esquemas, microssolda, reballing e diagnóstico de circuitos em placas Android e iPhone. Para quem já concluiu o Iniciante ou tem experiência equivalente.",
    para:[
      "Quem já concluiu o Curso Presencial (Iniciante)",
      "Quem já possui experiência prática equivalente",
      "Quem precisa resolver casos complexos que hoje recusa ou repassa"
    ],
    aprende:[
      "Leitura de esquemas elétricos",
      "Uso avançado da fonte de bancada",
      "Diagnóstico com multímetro",
      "Microssolda, reballing e jumper",
      "Reconstrução de trilhas",
      "Diagnóstico de circuitos em placas Android e iPhone"
    ],
    beneficios:[
      "Certificado de conclusão",
      "Grupo de suporte",
      "Acesso ao Curso Intermediário Online",
      "Garantia de resultado"
    ],
    modulos:[
      { titulo:"O que você vai aprofundar", aulas:[
        ["Leitura de esquemas elétricos",""],
        ["Uso avançado da fonte de bancada",""],
        ["Diagnóstico com multímetro",""],
        ["Microssolda, reballing e jumper",""],
        ["Reconstrução de trilhas",""],
        ["Diagnóstico em placas Android e iPhone",""]
      ]}
    ],
    faq:[
      ["Preciso ter feito o Iniciante?","Sim, ou ter experiência prática equivalente."],
      ["Quando são as turmas?","Turmas em formação nos formatos Integral e Sábados. Confirme datas no WhatsApp."],
      ["Como me matriculo?","A matrícula é feita com o atendimento humano. Fale conosco no WhatsApp."],
      ["Este curso é o Board Repair?","Não. São cursos diferentes. Intermediário Presencial: R$ 2.500. Board Repair Android: R$ 2.400."]
    ]
  },
  {
    slug:"curso-intermediario-online",
    titulo:"Curso Intermediário Online",
    categoria:"intermediario", nivel:"Intermediário",
    glyph:"💻", destaque:true, badge:"Online",
    horas:0, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"100% online · aulas gravadas",
    acesso:"1 ano",
    preco:997, precoDe:null, parcelas:"12x de R$ 103,11",
    link:"https://pay.hotmart.com/I86632000J",
    resumo:"Mesmo conteúdo do Intermediário presencial, em aulas gravadas. Para quem já tem experiência e prefere o formato online.",
    para:[
      "Quem já tem experiência prévia em manutenção",
      "Quem prefere ou precisa do formato online",
      "Quem busca o conteúdo avançado de placa à distância"
    ],
    aprende:[
      "Leitura de esquemas elétricos",
      "Uso avançado da fonte de bancada",
      "Diagnóstico com multímetro",
      "Microssolda, reballing e jumper",
      "Reconstrução de trilhas",
      "Diagnóstico de circuitos em placas Android e iPhone"
    ],
    beneficios:[
      "Suporte no mesmo grupo do curso presencial",
      "1 ano de acesso",
      "Garantia de resultado"
    ],
    modulos:[
      { titulo:"Conteúdo (mesmo do Intermediário presencial)", aulas:[
        ["Leitura de esquemas elétricos",""],
        ["Fonte de bancada avançada",""],
        ["Diagnóstico com multímetro",""],
        ["Microssolda, reballing e jumper",""],
        ["Reconstrução de trilhas",""],
        ["Placas Android e iPhone",""]
      ]}
    ],
    faq:[
      ["É o mesmo conteúdo do Intermediário presencial?","Sim."],
      ["Por quanto tempo tenho acesso?","1 ano."],
      ["Como me matriculo?","Matrícula direta pelo link de pagamento, sem reserva."]
    ]
  },
  {
    slug:"board-repair-android",
    titulo:"Board Repair Android",
    categoria:"avancado", nivel:"Avançado",
    glyph:"🔬", destaque:true, badge:"Turma confirmada",
    horas:50, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"Presencial · 5 dias corridos · professor convidado",
    acesso:null,
    preco:2400, precoDe:null, parcelas:"até 12x no cartão (juros da operadora)",
    link:null,
    resumo:"Especialização em placas Android para técnicos que já trabalham com manutenção. Turma de 21/09/2026 a 25/09/2026, das 09:00 às aprox. 19:00.",
    para:[
      "Técnicos que já trabalham com manutenção",
      "Quem deseja se especializar em placas Android"
    ],
    aprende:[
      "Dia 1: Imagem, touch e iluminação, com diagnóstico raiz, esquemático, osciloscópio e prática",
      "Dia 2: Carregamento, câmeras e áudio (tensões, DATA/CLK e linhas MIPI)",
      "Dia 3: Rádio frequência e Wi-Fi, com leitura de esquemático",
      "Dia 4: Microssoldagem completa, técnicas de solda e troca de CPU",
      "Dia 5: Inicialização full, consumo na fonte, linhas de comando e comunicação CPU/memória"
    ],
    beneficios:[
      "Certificado de conclusão",
      "Grupo de suporte",
      "Garantia de resultado"
    ],
    turmas:[
      { periodo:"Turma confirmada", dias:"21/09/2026 a 25/09/2026", horario:"09:00 às aprox. 19:00", data:"21/09/2026" }
    ],
    modulos:[
      { titulo:"Grade dos 5 dias", aulas:[
        ["Dia 1 · Imagem, touch e iluminação",""],
        ["Dia 2 · Carregamento, câmeras e áudio",""],
        ["Dia 3 · Rádio frequência e Wi-Fi",""],
        ["Dia 4 · Microssoldagem completa e CPU",""],
        ["Dia 5 · Inicialização full",""]
      ]}
    ],
    faq:[
      ["É o mesmo que o Intermediário Presencial?","Não. São cursos, preços e conteúdos diferentes. Board Repair: R$ 2.400. Intermediário: R$ 2.500."],
      ["Quando é a turma?","21/09/2026 a 25/09/2026, das 09:00 às aproximadamente 19:00."],
      ["Como me matriculo?","Matrícula com o atendimento humano. Fale no WhatsApp."],
      ["Parcelamento?","Até 12x no cartão, com juros da operadora, pago a partir do primeiro dia de aula."]
    ]
  },
  {
    slug:"curso-santos",
    titulo:"Curso Santos · Reparo Avançado em Placas de iPhone",
    categoria:"avancado", nivel:"Avançado",
    glyph:"🍎", destaque:true, badge:"Eagle Team",
    horas:0, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"Presencial · Professor Santos (Eagle Team)",
    acesso:null,
    preco:2500, precoDe:null, parcelas:"Consulte no atendimento",
    precoNota:"Nível 1 e 2: R$ 2.500 · Nível 3: R$ 2.500 · Pacote completo: R$ 4.800",
    reserva:"Sinal de R$ 500,00 para reservar vaga",
    link:null,
    resumo:"Especialização em placas de iPhone com o Professor Santos (Eagle Team). Nível 1 e 2: 31/08 a 03/09/2026. Nível 3: 04/09 a 07/09/2026.",
    para:[
      "Técnicos que já trabalham com manutenção",
      "Quem deseja se especializar em placas de iPhone"
    ],
    aprende:[
      "Conteúdo detalhado disponível em PDF exclusivo do Curso Santos",
      "Nível 1 e 2: 31/08/2026 a 03/09/2026, 09:00 às 19:00 (1h de almoço)",
      "Nível 3: 04/09/2026 a 07/09/2026, 09:00 às 19:00 (1h de almoço)"
    ],
    beneficios:[
      "Certificado de conclusão",
      "Grupo de suporte",
      "Garantia de resultado",
      "PDF exclusivo com o conteúdo detalhado"
    ],
    turmas:[
      { periodo:"Nível 1 e 2", dias:"31/08/2026 a 03/09/2026", horario:"09:00 às 19:00", data:"31/08/2026" },
      { periodo:"Nível 3", dias:"04/09/2026 a 07/09/2026", horario:"09:00 às 19:00", data:"04/09/2026" }
    ],
    modulos:[
      { titulo:"Etapas", aulas:[
        ["Nível 1 e 2 (um único curso) · 31/08 a 03/09/2026",""],
        ["Nível 3 · 04/09 a 07/09/2026",""],
        ["Pacote completo com desconto de R$ 100 por etapa",""]
      ]}
    ],
    faq:[
      ["Qual o preço?","Nível 1 e 2: R$ 2.500. Nível 3: R$ 2.500. Pacote completo (1, 2 e 3): R$ 4.800."],
      ["Tem sinal?","Sim. Sinal de R$ 500,00 para reservar vaga (diferente da reserva de R$ 300 do Iniciante presencial)."],
      ["É o mesmo que o Board Repair?","Não. Curso Santos é iPhone (datas 31/08 a 07/09). Board Repair é Android (21/09 a 25/09), R$ 2.400."],
      ["Quanto rende um reparo de placa de iPhone?","Referência de mercado: cerca de R$ 400 (repasse) a R$ 600 (cliente final)."],
      ["Como me matriculo?","Matrícula com o atendimento humano. Fale no WhatsApp."]
    ]
  },
  {
    slug:"encontro-tecnicos-2026",
    titulo:"Encontro de Técnicos · 3ª Edição 2026",
    categoria:"eventos", nivel:"Todos os níveis",
    glyph:"🎤", destaque:false, badge:"Evento",
    horas:0, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"Presencial · Centro de Convenções de Goiânia",
    acesso:null,
    preco:600, precoDe:null, parcelas:"6x de R$ 103,69 no cartão",
    boleto:"4x de R$ 162,50 (total R$ 650,00)",
    link:null,
    resumo:"Evento de 3 dias com palestras, demonstrações técnicas, networking e área de expositores. 04/12/2026 a 06/12/2026, das 09:00 às 19:00.",
    para:[
      "Profissionais e estudantes da manutenção de celulares",
      "Quem quer networking, palestras e demonstrações técnicas"
    ],
    aprende:[
      "Palestras técnicas",
      "Demonstrações na prática",
      "Networking com outros técnicos",
      "Área de expositores"
    ],
    beneficios:[
      "Entrada nos três dias",
      "Palestras",
      "Certificado",
      "Acesso aos estandes",
      "Camiseta oficial",
      "Sorteios"
    ],
    turmas:[
      { periodo:"Passaporte 3 Dias", dias:"04/12/2026 a 06/12/2026", horario:"09:00 às 19:00", data:"04/12/2026" }
    ],
    modulos:[
      { titulo:"Programação geral", aulas:[
        ["Palestras e demonstrações técnicas",""],
        ["Networking e área de expositores",""],
        ["Sorteios e camiseta oficial",""]
      ]}
    ],
    faq:[
      ["Onde é o evento?","Centro de Convenções de Goiânia."],
      ["Qual o valor do ingresso?","Passaporte 3 Dias: R$ 600,00. Cartão até 6x de R$ 103,69. Boleto: 4x de R$ 162,50 (total R$ 650,00)."],
      ["O que está incluso?","Entrada nos três dias, palestras, certificado, acesso aos estandes, camiseta oficial e sorteios."]
    ]
  },
  {
    slug:"troca-de-telas-lucrativas",
    titulo:"Troca de Telas Lucrativas",
    categoria:"entrada", nivel:"Iniciante",
    glyph:"📺", destaque:false, badge:"Entrada",
    horas:0, aulas:0, alunos:0, nota:0, avaliacoes:0,
    formato:"100% online · 7 módulos",
    acesso:"1 ano, com atualizações incluídas",
    preco:49.90, precoDe:null, parcelas:"Pagamento único",
    link:"https://pay.hotmart.com/R90092704K",
    resumo:"Treinamento online exclusivo sobre troca de telas, do zero. Opção de entrada para quem ainda não consegue investir no curso Iniciante completo.",
    para:[
      "Quem quer começar só com troca de telas",
      "Quem ainda não consegue pagar o Curso Iniciante, nem parcelado"
    ],
    aprende:[
      "Troca de tela de qualquer celular, do zero",
      "7 módulos com várias aulas em cada um"
    ],
    beneficios:[
      "1 ano de acesso com atualizações",
      "Grupo exclusivo no Telegram",
      "Upgrade para o Curso Online Iniciante por R$ 299 após conclusão (via atendimento)"
    ],
    modulos:[
      { titulo:"Formato", aulas:[
        ["7 módulos com várias aulas",""],
        ["Aulas gravadas, 100% online",""],
        ["Atualizações incluídas no período de acesso",""]
      ]}
    ],
    faq:[
      ["Tem a garantia de resultado dos cursos principais?","Não. Este produto não tem a garantia de 60 dias / R$ 2.000."],
      ["Posso migrar para o Online Iniciante depois?","Sim. Quem concluir pode migrar para o Curso Online Iniciante por R$ 299 (valor normal R$ 497), pedindo no grupo do Telegram."],
      ["É o curso principal?","Não. É uma opção de entrada de baixo risco, oferecida quando o Iniciante completo não cabe no orçamento."]
    ]
  }
];

/* Vídeo aulas abertas (gratuitas) ---------------------------------------- */
CA.aulas = [
  { id:"aula-01", yt:"ScMzIvxBSi4", titulo:"Montando sua bancada de assistência técnica do zero",
    categoria:"iniciante", duracao:"18:42", views:"42 mil", data:"2026-07-14",
    desc:"Quais ferramentas comprar primeiro, quanto custa cada item e o que você pode deixar para depois." },
  { id:"aula-02", yt:"ScMzIvxBSi4", titulo:"Multímetro: as 5 medições que resolvem 80% dos casos",
    categoria:"iniciante", duracao:"26:10", views:"38 mil", data:"2026-07-02",
    desc:"Continuidade, tensão, diodo, resistência e consumo na bancada." },
  { id:"aula-03", yt:"ScMzIvxBSi4", titulo:"Aparelho não liga: roteiro completo de diagnóstico",
    categoria:"iniciante", duracao:"31:55", views:"55 mil", data:"2026-06-20",
    desc:"Passo a passo em ordem lógica para descobrir a causa sem trocar peça por tentativa." },
  { id:"aula-04", yt:"ScMzIvxBSi4", titulo:"Como localizar curto na placa usando fonte de bancada",
    categoria:"intermediario", duracao:"24:08", views:"29 mil", data:"2026-06-05",
    desc:"Técnica do álcool isopropílico, leitura de consumo e injeção de tensão." },
  { id:"aula-05", yt:"ScMzIvxBSi4", titulo:"Introdução ao microscópio para microssolda",
    categoria:"intermediario", duracao:"20:36", views:"21 mil", data:"2026-05-22",
    desc:"Escolha, ajuste, iluminação e postura para começar no nível de placa." },
  { id:"aula-06", yt:"ScMzIvxBSi4", titulo:"Flash de firmware Samsung sem brickar o aparelho",
    categoria:"iniciante", duracao:"29:14", views:"33 mil", data:"2026-05-08",
    desc:"Identificando o firmware correto, drivers e flash com segurança." },
  { id:"aula-07", yt:"ScMzIvxBSi4", titulo:"Quanto cobrar por uma troca de tela? Precificação real",
    categoria:"iniciante", duracao:"22:47", views:"47 mil", data:"2026-04-25",
    desc:"Custo da peça, hora de bancada, risco, garantia e margem." },
  { id:"aula-08", yt:"ScMzIvxBSi4", titulo:"Trocando conector de carga: passo a passo com ar quente",
    categoria:"iniciante", duracao:"27:33", views:"26 mil", data:"2026-03-28",
    desc:"Temperatura, fluxo, remoção, limpeza dos pads e instalação." },
  { id:"aula-09", yt:"ScMzIvxBSi4", titulo:"Lei de Ohm aplicada ao reparo de celular",
    categoria:"intermediario", duracao:"23:05", views:"15 mil", data:"2026-03-12",
    desc:"Sem fórmula decorada: tensão e corrente na placa, na prática." },
  { id:"aula-10", yt:"ScMzIvxBSi4", titulo:"Vedação e teste depois do reparo",
    categoria:"iniciante", duracao:"14:28", views:"20 mil", data:"2026-02-11",
    desc:"Materiais, aplicação correta e o teste final de proteção." }
];

/* Blog -------------------------------------------------------------------- */
CA.posts = [
  { slug:"quanto-ganha-tecnico-de-celular", glyph:"💰", categoria:"Carreira", destaque:true,
    titulo:"Quanto ganha um técnico de celular? Resultados reais da CA Cursos",
    resumo:"Casos documentados de alunos: renda extra de R$ 7.000/mês, R$ 2.200 em uma semana durante o curso e loja no primeiro mês.",
    data:"2026-08-18", leitura:"8 min", autor:"Equipe CA Cursos" },
  { slug:"erros-que-queimam-placa", glyph:"🔥", categoria:"Técnico", destaque:false,
    titulo:"7 erros de iniciante que queimam a placa do cliente",
    resumo:"Temperatura errada no ar quente, fluxo vencido, medição com o aparelho ligado. Os deslizes mais caros e como evitar cada um.",
    data:"2026-08-04", leitura:"6 min", autor:"Equipe CA Cursos" },
  { slug:"kit-de-ferramentas-iniciante", glyph:"🧰", categoria:"Ferramentas", destaque:false,
    titulo:"Kit de ferramentas para começar: o que comprar primeiro",
    resumo:"A lista honesta do que realmente resolve nos primeiros meses, com faixa de preço e o que dá para adiar sem perder serviço.",
    data:"2026-07-21", leitura:"7 min", autor:"Equipe CA Cursos" },
  { slug:"como-precificar-reparos", glyph:"🧮", categoria:"Negócios", destaque:false,
    titulo:"Como precificar reparos sem trabalhar de graça",
    resumo:"O método de precificação por complexidade que protege sua margem mesmo quando o cliente pesquisa preço no grupo do WhatsApp.",
    data:"2026-07-07", leitura:"9 min", autor:"Equipe CA Cursos" },
  { slug:"board-repair-ou-intermediario", glyph:"🔬", categoria:"Carreira", destaque:false,
    titulo:"Board Repair ou Intermediário? Como escolher o curso avançado",
    resumo:"São produtos diferentes: preços, datas e conteúdos distintos. Veja quando cada um faz sentido.",
    data:"2026-06-23", leitura:"6 min", autor:"Equipe CA Cursos" },
  { slug:"presencial-ou-online", glyph:"📍", categoria:"Carreira", destaque:false,
    titulo:"Presencial ou online: qual formato do Iniciante escolher?",
    resumo:"Mesmo conteúdo, formatos diferentes. Veja o que muda em preço, prática e acesso.",
    data:"2026-06-09", leitura:"5 min", autor:"Equipe CA Cursos" },
  { slug:"garantia-de-resultado", glyph:"🛡️", categoria:"Negócios", destaque:false,
    titulo:"Como funciona a garantia de resultado da CA Cursos",
    resumo:"Meta de R$ 2.000 em 60 dias, reforço do curso e reembolso se necessário. Entenda as regras oficiais.",
    data:"2026-05-26", leitura:"5 min", autor:"Equipe CA Cursos" },
  { slug:"abrir-mei-assistencia-tecnica", glyph:"📄", categoria:"Negócios", destaque:false,
    titulo:"Abrir MEI para assistência técnica: passo a passo",
    resumo:"CNAE, limites de faturamento, nota fiscal e o que muda quando você contrata o primeiro funcionário.",
    data:"2026-05-12", leitura:"8 min", autor:"Equipe CA Cursos" },
  { slug:"diagnostico-antes-de-abrir", glyph:"🔎", categoria:"Técnico", destaque:false,
    titulo:"Por que diagnosticar antes de abrir o aparelho muda tudo",
    resumo:"Um roteiro de perguntas e testes que reduz retrabalho, evita discussão com o cliente e acelera o reparo.",
    data:"2026-04-28", leitura:"6 min", autor:"Equipe CA Cursos" }
];

/* Avaliações: usar o perfil oficial do Google (CA.config.google).
   Depoimentos inventados foram removidos. */
CA.depoimentos = [];

/* Helpers ----------------------------------------------------------------- */
CA.brl = (n) => n.toLocaleString("pt-BR",{ style:"currency", currency:"BRL" });
CA.dataBR = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR",{ day:"2-digit", month:"long", year:"numeric" });
CA.catNome = (id) => (CA.categorias.find(c => c.id === id) || {}).nome || id;
CA.curso = (slug) => CA.cursos.find(c => c.slug === slug);
CA.post  = (slug) => CA.posts.find(p => p.slug === slug);

/* Conteúdo dos artigos (HTML) -------------------------------------------- */
CA.conteudo = {

"quanto-ganha-tecnico-de-celular": `
<p>Essa é a pergunta que mais recebemos. Em vez de faixas inventadas, reunimos resultados reais documentados pela CA Cursos e publicados no Instagram @cacursos.</p>

<h2>Renda extra: Edilson (São Paulo)</h2>
<p>Edilson fatura R$ 7.000,00 por mês com manutenção de celular como renda extra, além do emprego principal. Ele mesmo descreve como o que ganha “quando chega do trabalho”. O vídeo está no Instagram @cacursos.</p>

<h2>Ainda durante o curso presencial</h2>
<p>Há registro de aluno que, ainda durante o curso presencial, atendeu e consertou aparelhos em sala e faturou R$ 2.200,00 em uma semana.</p>

<h2>Profissão principal: loja no primeiro mês</h2>
<p>Felipe montou uma lojinha física simples depois do curso e já no primeiro mês de loja teve lucro. O depoimento dele também está no Instagram @cacursos.</p>
<p>O maior faturamento registrado no primeiro mês entre os casos acompanhados pela escola chega a R$ 12.000,00.</p>

<h2>Padrão de ex-motoristas de aplicativo</h2>
<p>Vários ex-motoristas de aplicativo (Uber) pararam de rodar depois que começaram a atender e ganhar dinheiro ainda durante o curso. A comparação que eles mesmos fazem: 12 horas dirigindo rendem entre R$ 200 e R$ 300, enquanto um único serviço de manutenção pode render R$ 200 em menos de uma hora.</p>
<p>Esse padrão foi confirmado pelo Rafael a partir de conversas com alunos na escola. Não há um vídeo específico desse padrão no Instagram; o convite ao @cacursos serve para ver outros resultados reais.</p>

<h2>Conclusão</h2>
<p>Não existe um salário fixo para técnico de celular. Existe um ofício que você pode operar como renda extra ou como profissão principal. Os casos acima são prova social documentada, não promessa de resultado idêntico para todo mundo.</p>`,

"erros-que-queimam-placa": `
<p>Todo técnico já queimou alguma coisa. A diferença entre quem evolui e quem repete o prejuízo está em entender exatamente o que aconteceu. Estes são os sete erros que mais aparecem nas fotos que os alunos mandam no grupo.</p>

<h2>1. Ar quente muito alto e muito perto</h2>
<p>O reflexo de quem tem pressa é aumentar a temperatura. O resultado é levantar componentes vizinhos, empenar a placa e cozinhar o CI que você queria salvar. Trabalhe com temperatura mais baixa, fluxo de ar moderado e paciência: o calor precisa de tempo, não de intensidade.</p>

<h2>2. Fluxo velho ou de má qualidade</h2>
<p>Fluxo vencido não ativa direito, e você compensa com mais calor. É um erro que causa outro. Fluxo é barato perto do estrago que ele evita: troque com frequência e guarde longe do sol.</p>

<h2>3. Medir com o aparelho ligado sem saber o que está medindo</h2>
<p>Encostar a ponta de prova no lugar errado com a placa energizada é o caminho mais rápido para um curto novo. Antes de energizar, saiba qual linha você quer medir e qual valor espera encontrar.</p>

<h2>4. Pular a inspeção visual</h2>
<p>Oxidação, componente com marca de queima, trilha rompida, cola de reparo anterior. Cinco minutos no microscópio antes de qualquer intervenção economizam horas de tentativa e erro.</p>

<h2>5. Não isolar o que está ao redor</h2>
<p>Fita kapton existe por um motivo. Proteger conectores plásticos, flats e componentes sensíveis ao calor é rotina, não excesso de zelo.</p>

<h2>6. Alimentar direto na bateria sem limitar corrente</h2>
<p>A fonte de bancada com limite de corrente é a sua rede de segurança. Se há curto, ela avisa antes de transformar um componente queimado em uma trilha derretida.</p>

<h2>7. Fazer reballing por hábito</h2>
<p>Reballing virou reflexo para muita gente, mas nem todo problema é solda fria. Retrabalhar um CI sadio adiciona estresse térmico à placa e pode criar o defeito que não existia.</p>

<div class="callout">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
  <div><b>Regra de ouro</b>
  <p>Se você não sabe explicar por que está fazendo aquele procedimento, ainda não é hora de fazê-lo. Volte ao diagnóstico.</p></div>
</div>

<h2>Fechando</h2>
<p>Nenhum desses erros é sinal de falta de talento: todos são sinal de pressa. Diminuir o ritmo nos primeiros meses é o que constrói a mão firme que você vai ter depois.</p>`,

"kit-de-ferramentas-iniciante": `
<p>A lista de ferramentas que circula na internet costuma ter duas versões: a barata demais, que te deixa na mão no primeiro serviço, e a cara demais, que trava seu capital em coisas que você só vai usar daqui a um ano. Esta é uma terceira lista: a que nossos alunos realmente usam nos primeiros meses.</p>

<h2>Compre já</h2>
<ul>
  <li><b>Kit de chaves de precisão</b> com pontas magnéticas. É o item que você mais vai usar; não economize aqui.</li>
  <li><b>Multímetro digital</b> com função de diodo e continuidade sonora.</li>
  <li><b>Ferro de solda com controle de temperatura.</b> Ferro sem controle é fonte de defeito.</li>
  <li><b>Manta térmica ou separador de telas:</b> mesmo o modelo simples reduz muito a taxa de quebra na abertura.</li>
  <li><b>Palhetas, ventosa e espátulas plásticas.</b></li>
  <li><b>Álcool isopropílico e pincel antiestático.</b></li>
</ul>

<h2>Compre no segundo mês</h2>
<ul>
  <li><b>Estação de ar quente.</b></li>
  <li><b>Fonte de bancada com limitador de corrente.</b></li>
  <li><b>Kit de vedação</b> e cola apropriada.</li>
</ul>

<h2>Pode esperar</h2>
<ul>
  <li><b>Microscópio.</b> Só quando você decidir entrar em nível de placa para valer.</li>
  <li><b>Box e ferramentas de software pagas.</b></li>
  <li><b>Ultrassônica.</b></li>
</ul>

<p>Para compra de peças (telas, baterias, conectores, placas), fale no WhatsApp (62) 99119-7301. Para equipamentos (ferramentas, fonte, estação, multímetro), (62) 98417-8183.</p>

<h2>Onde as pessoas erram</h2>
<p>O erro mais comum não é comprar barato: é comprar tudo de uma vez. Ferramenta parada é dinheiro parado.</p>`,

"como-precificar-reparos": `
<p>Se o cliente sempre acha caro e você sempre acha que trabalhou demais para o que recebeu, o problema quase nunca é o cliente: é o método de precificação.</p>

<h2>Passo 1: descubra quanto custa uma hora da sua bancada</h2>
<p>Some o que você gasta por mês para a bancada existir e divida pelo número de horas que você realmente consegue produzir no mês, não pelas horas em que fica disponível.</p>

<h2>Passo 2: classifique os reparos por complexidade</h2>
<ul>
  <li><b>Simples:</b> troca de bateria, limpeza, atualização.</li>
  <li><b>Médio:</b> troca de tela, conector de carga, câmera.</li>
  <li><b>Complexo:</b> reparo em placa, oxidação leve, troca de CI.</li>
  <li><b>Crítico:</b> aparelho molhado, placa com histórico de reparo.</li>
</ul>

<h2>Passo 3: some o risco e a garantia</h2>
<p>Todo serviço tem uma taxa de retorno. Se historicamente parte das telas volta para ajuste, esse custo precisa estar dentro do preço.</p>

<h2>Passo 4: aplique a margem</h2>
<p>Custo da peça + (custo-hora × tempo estimado) + risco = ponto de equilíbrio. A margem vem em cima disso.</p>

<blockquote>Referência de mercado para reparo de placa de iPhone: cerca de R$ 400 (repasse para lojista) a R$ 600 (cliente final).</blockquote>`,

"board-repair-ou-intermediario": `
<p>Na CA Cursos, “curso avançado” pode significar coisas diferentes. Não misture os produtos.</p>

<h2>Curso Intermediário (Presencial)</h2>
<p>Preço à vista: R$ 2.500,00. Parcelamento: até 12x de R$ 243,52. Ministrado pelo Rafael. Turmas em formação (Integral e Sábados). Conteúdo: esquemas, fonte, multímetro, microssolda, reballing, jumper, trilhas, Android e iPhone.</p>

<h2>Board Repair Android</h2>
<p>Preço: R$ 2.400,00. Turma confirmada: 21/09/2026 a 25/09/2026. Professor convidado. Foco exclusivo em placas Android, com grade dia a dia (imagem/touch, carregamento/câmeras/áudio, RF/Wi-Fi, microssoldagem/CPU, inicialização full).</p>

<h2>Curso Santos (iPhone)</h2>
<p>Nível 1 e 2: R$ 2.500 (31/08 a 03/09/2026). Nível 3: R$ 2.500 (04/09 a 07/09/2026). Pacote completo: R$ 4.800. Sinal: R$ 500.</p>

<p>Se a conversa falar só em “avançado”, pergunte se o interesse é Android, iPhone ou o Intermediário geral de placa.</p>`,

"presencial-ou-online": `
<p>O Curso Iniciante existe em dois formatos com o mesmo conteúdo.</p>

<h2>Presencial</h2>
<p>R$ 1.999,99 à vista, ou 12x de R$ 194,00. Também há boleto: entrada de R$ 1.000 + 4 boletos de R$ 350 (somente neste curso). Reserva de vaga: R$ 300 via PIX. 40 horas 100% práticas, bancada individual, equipamentos da escola. Turmas Integral, Matutino, Vespertino, Noturno e Intensivo (sábados) em Goiânia (Rua 2, 115).</p>

<h2>Online</h2>
<p>R$ 497,00 à vista, ou 12x de R$ 51,40. Aulas gravadas, 1 ano de acesso, matrícula direta pelo link de pagamento, sem reserva.</p>

<p>Quem faz o presencial também ganha 1 ano de acesso ao Curso Online Iniciante.</p>`,

"garantia-de-resultado": `
<p>A garantia de resultado se aplica ao Curso Presencial (Iniciante), Curso Online (Iniciante), Curso Intermediário (Presencial), Curso Intermediário Online, Board Repair e Curso Santos.</p>
<ul>
  <li><b>Prazo:</b> 60 dias após a conclusão do curso.</li>
  <li><b>Meta:</b> faturar pelo menos R$ 2.000,00 aplicando o conteúdo aprendido.</li>
  <li>Se a meta não for atingida: o aluno refaz o curso, no mínimo 2 vezes, com foco no ponto de maior dificuldade.</li>
  <li>Se, mesmo após refazer, o resultado não vier: o valor investido é devolvido.</li>
  <li>Em todos os casos, o aluno precisa comprovar que seguiu as indicações da escola.</li>
</ul>
<p>O treinamento Troca de Telas Lucrativas <b>não</b> tem essa garantia.</p>
<p>A CA Cursos não oferece desconto ou promoção para ninguém, sob nenhuma alegação.</p>`

};

/* Estrutura padrão para artigos ainda sem corpo dedicado ------------------ */
CA.conteudoPadrao = (p) => `
<p>${p.resumo}</p>
<h2>Por que isso importa na prática</h2>
<p>Este é um dos temas que mais aparecem nas dúvidas dos nossos alunos, porque afeta diretamente o resultado do mês: seja pelo tempo de bancada, pelo retrabalho evitado ou pelo valor que se consegue cobrar.</p>
<h2>O que observar antes de decidir</h2>
<ul>
  <li>Qual é o seu volume atual de serviço e onde ele trava.</li>
  <li>Quanto do seu tempo é gasto refazendo algo que já tinha sido feito.</li>
  <li>Se o custo envolvido volta em faturamento nos próximos três meses.</li>
</ul>
<h2>Próximo passo</h2>
<p>Se você quer se aprofundar neste assunto com prática guiada, fale com a CA Cursos no WhatsApp e descubra qual trilha faz sentido para o seu nível.</p>`;
