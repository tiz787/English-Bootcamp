const TOTAL_DAYS = 52;

// --- SISTEMA DE INTENTOS Y EXÁMENES ---
const quizAttempts = {}; // Almacena intentos por día: { d1: { attempts: 2, maxAttempts: 3 } }
const weeklyExamAttempts = {}; // { week1: { attempts: 1, maxAttempts: 2, scores: [] } }
const skipExamResults = {}; // Resultados de exámenes de salto

// Preguntas adicionales para exámenes de semana y salto
const weeklyExamQuestions = {
  week1: [
    {
      q: "¿Qué técnica implica hablar al mismo tiempo que un audio?",
      options: ["Active Recall", "Shadowing", "Spaced Repetition"],
      correct: 1,
      feedback: "Shadowing activa las neuronas espejo.",
      topic: "Técnicas",
    },
    {
      q: "'The code _____ perfectly' (3ra persona)",
      options: ["run", "runs", "running"],
      correct: 1,
      feedback: "Tercera persona singular necesita 'S'.",
      topic: "Present Simple",
    },
    {
      q: "Para preguntar en inglés, ¿qué auxiliar usamos?",
      options: ["Is/Are", "Do/Does", "Have/Has"],
      correct: 1,
      feedback: "Do/Does para verbos de acción en presente.",
      topic: "Preguntas",
    },
    {
      q: "'There _____ many bugs in the code' (plural)",
      options: ["is", "are", "be"],
      correct: 1,
      feedback: "'There are' para plural.",
      topic: "Existencia",
    },
    {
      q: "La preposición correcta: 'The file is ___ the folder'",
      options: ["on", "at", "in"],
      correct: 2,
      feedback: "IN = dentro de algo.",
      topic: "Preposiciones",
    },
    {
      q: "¿Cuál es la estructura básica de una oración en inglés?",
      options: [
        "Verbo + Sujeto + Objeto",
        "Sujeto + Verbo + Objeto",
        "Objeto + Sujeto + Verbo",
      ],
      correct: 1,
      feedback: "SVO: Subject-Verb-Object",
      topic: "Estructura",
    },
  ],
  week2: [
    {
      q: "¿Cómo suena '-ed' en 'worked'?",
      options: ["/ɪd/ (work-ed)", "/t/ (workt)", "/d/ (workd)"],
      correct: 1,
      feedback: "Después de consonantes sordas: sonido /t/.",
      topic: "Fonética",
    },
    {
      q: "Pasado de 'go':",
      options: ["goed", "went", "gone"],
      correct: 1,
      feedback: "Go-Went-Gone (irregular).",
      topic: "Verbos Irregulares",
    },
    {
      q: "Pasado de 'write':",
      options: ["writed", "wrote", "written"],
      correct: 1,
      feedback: "Write-Wrote-Written.",
      topic: "Verbos Irregulares",
    },
    {
      q: "'I _____ the bug yesterday' (fix)",
      options: ["fix", "fixed", "fixing"],
      correct: 1,
      feedback: "Pasado simple: +ED.",
      topic: "Past Simple",
    },
    {
      q: "¿Cuándo suena la 'e' en '-ed'?",
      options: ["Siempre", "Después de 't' o 'd'", "Nunca"],
      correct: 1,
      feedback: "Solo en wanted, needed, started, etc.",
      topic: "Fonética",
    },
    {
      q: "Pasado de 'buy':",
      options: ["buyed", "bought", "buys"],
      correct: 1,
      feedback: "Buy-Bought-Bought.",
      topic: "Verbos Irregulares",
    },
  ],
  week3: [
    {
      q: "'I _____ fix it right now!' (decisión espontánea)",
      options: ["going to", "will", "am"],
      correct: 1,
      feedback: "'Will' para decisiones del momento.",
      topic: "Futuro",
    },
    {
      q: "'Tomorrow I _____ deploy the update' (plan previo)",
      options: ["will", "am going to", "go"],
      correct: 1,
      feedback: "'Going to' para planes decididos.",
      topic: "Futuro",
    },
    {
      q: "'If the test _____, I will merge' (condicional real)",
      options: ["passes", "will pass", "passed"],
      correct: 0,
      feedback: "If + presente, will + base.",
      topic: "Condicionales",
    },
    {
      q: "'If I _____ more time, I would refactor' (hipotético)",
      options: ["have", "had", "will have"],
      correct: 1,
      feedback: "If + pasado, would + base.",
      topic: "Condicionales",
    },
    {
      q: "¿Cuál expresa una posibilidad menor?",
      options: ["will", "might", "going to"],
      correct: 1,
      feedback: "'Might' = posibilidad no segura.",
      topic: "Modales",
    },
    {
      q: "'_____ you review my code?' (cortés)",
      options: ["Can", "Could", "Will"],
      correct: 1,
      feedback: "'Could' es más formal y cortés.",
      topic: "Modales",
    },
  ],
  week4: [
    {
      q: "Inicio formal de email:",
      options: ["Hey!", "Dear Mr. Smith,", "Hi there!"],
      correct: 1,
      feedback: "'Dear' es el estándar formal.",
      topic: "Emails",
    },
    {
      q: "'I _____ 5 years of experience' (entrevista)",
      options: ["has", "have", "am"],
      correct: 1,
      feedback: "'I have' - primera persona.",
      topic: "Entrevistas",
    },
    {
      q: "Cierre profesional de email:",
      options: ["Bye!", "Best regards,", "Later!"],
      correct: 1,
      feedback: "'Best regards' es profesional.",
      topic: "Emails",
    },
    {
      q: "'Tell me about _____' (entrevista)",
      options: ["you", "yourself", "your"],
      correct: 1,
      feedback: "'Yourself' es reflexivo.",
      topic: "Entrevistas",
    },
    {
      q: "Para adjuntos: 'Please find _____'",
      options: ["attached", "attach", "attaching"],
      correct: 0,
      feedback: "'Please find attached...' es estándar.",
      topic: "Emails",
    },
    {
      q: "'Looking forward to _____ from you'",
      options: ["hear", "hearing", "heard"],
      correct: 1,
      feedback: "'Looking forward to' + gerundio (-ing).",
      topic: "Emails",
    },
  ],
};

// Preguntas para examen de salto (validación para saltarse semanas)
const skipExamQuestions = {
  toWeek2: [...weeklyExamQuestions.week1],
  toWeek3: [...weeklyExamQuestions.week1, ...weeklyExamQuestions.week2],
  toWeek4: [
    ...weeklyExamQuestions.week1,
    ...weeklyExamQuestions.week2,
    ...weeklyExamQuestions.week3,
  ],
};

// --- 1. BANCO DE PREGUNTAS EXTENDIDO ---
const questions = {
  d1: [
    {
      q: "En la técnica de Shadowing, tú debes...",
      options: [
        "Escuchar y luego repetir",
        "Hablar al mismo tiempo que el audio",
        "Leer en silencio",
      ],
      correct: 1,
      feedback: "Hablar simultáneamente fuerza la copia del ritmo.",
      topic: "Técnica de Estudio",
    },
    {
      q: "Si digo 'Python run fast', ¿qué falta?",
      options: ["Nada", "El sujeto", "La 'S' en el verbo (runs)"],
      correct: 2,
      feedback: "En presente, la 3ra persona necesita S: 'Runs'.",
      topic: "Gramática Básica",
    },
    {
      q: "¿Cuál oración es correcta estructuralmente?",
      options: ["I code everyday", "Code everyday", "I coding everyday"],
      correct: 0,
      feedback: "Sujeto (I) + Verbo (code).",
      topic: "Estructura",
    },
    {
      q: "¿Qué pronombre usas para 'My computer'?",
      options: ["He", "She", "It"],
      correct: 2,
      feedback: "Objetos singulares usan 'It'.",
      topic: "Gramática Básica",
    },
    {
      q: "El verbo 'To Be' para 'I' es:",
      options: ["Is", "Are", "Am"],
      correct: 2,
      feedback: "I am a programmer.",
      topic: "Gramática Básica",
    },
  ],
  d2: [
    {
      q: "Para preguntar '¿Estudias?', usas el algoritmo:",
      options: ["You study?", "Study you?", "Do you study?"],
      correct: 2,
      feedback: "El auxiliar 'Do' inicia la pregunta.",
      topic: "Preguntas",
    },
    {
      q: "¿Qué hace el 'Active Recall'?",
      options: [
        "Releer muchas veces",
        "Forzar al cerebro a recuperar info",
        "Subrayar texto",
      ],
      correct: 1,
      feedback: "El esfuerzo de recordar crea la memoria.",
      topic: "Técnica de Estudio",
    },
    {
      q: "Where ____ you work?",
      options: ["do", "are", "is"],
      correct: 0,
      feedback: "Usamos 'Do' con verbos de acción.",
      topic: "Gramática Auxiliares",
    },
    {
      q: "Respuesta corta negativa a 'Do you code?':",
      options: ["No, I not code", "No, I don't", "No, I no"],
      correct: 1,
      feedback: "Se responde con el auxiliar: No, I don't.",
      topic: "Respuestas Cortas",
    },
    {
      q: "¿Cuál es una pregunta cerrada (Yes/No)?",
      options: [
        "Where do you live?",
        "Do you like Java?",
        "What is your name?",
      ],
      correct: 1,
      feedback: "Empieza con auxiliar, se responde sí o no.",
      topic: "Tipos de Preguntas",
    },
  ],
  d3: [
    {
      q: "Hay un error (singular). Se dice:",
      options: ["There are a bug", "There is a bug", "Have a bug"],
      correct: 1,
      feedback: "'There is' para uno solo.",
      topic: "Existencia",
    },
    {
      q: "El laptop está SOBRE la mesa:",
      options: ["In the table", "On the table", "At the table"],
      correct: 1,
      feedback: "ON = Superficie.",
      topic: "Preposiciones",
    },
    {
      q: "¿Cómo dices 'Hay 5 errores'?",
      options: ["There is 5 bugs", "There are 5 bugs", "Have 5 bugs"],
      correct: 1,
      feedback: "Plural usa 'There are'.",
      topic: "Existencia",
    },
    {
      q: "El código está DENTRO del archivo:",
      options: ["On the file", "In the file", "At the file"],
      correct: 1,
      feedback: "IN = Dentro de un contenedor.",
      topic: "Preposiciones",
    },
    {
      q: "Diferencia entre 'There is' y 'It is':",
      options: [
        "Son iguales",
        "There is = Existencia, It is = Descripción",
        "No sé",
      ],
      correct: 1,
      feedback: "There is a bug (existe). It is critical (descripción).",
      topic: "Gramática",
    },
  ],
  d4: [
    {
      q: "Pronunciación correcta de 'Worked':",
      options: ["Work-ed (2 sílabas)", "Workt (1 sílaba)", "Working"],
      correct: 1,
      feedback: "Un solo golpe de sonido: Workt.",
      topic: "Fonética",
    },
    {
      q: "Pronunciación correcta de 'Played':",
      options: ["Play-ed", "Playd (suave)", "Playid"],
      correct: 1,
      feedback: "Sonido vibrante suave.",
      topic: "Fonética",
    },
    {
      q: "Pronunciación de 'Wanted':",
      options: ["Want-t", "Wan-ted (2 sílabas)", "Wantd"],
      correct: 1,
      feedback: "Termina en T/D, se pronuncia la E extra: Wan-ted.",
      topic: "Fonética",
    },
    {
      q: "¿Cuándo suena la 'E' en -ED?",
      options: ["Siempre", "Nunca", "Cuando el verbo termina en T o D"],
      correct: 2,
      feedback: "Solo en verbos como Need (Needed) o Want (Wanted).",
      topic: "Regla Fonética",
    },
    {
      q: "Pasado de 'Call' (Llamar):",
      options: ["Callt", "Calld (suave)", "Call-ed"],
      correct: 1,
      feedback: "Sonido vibrante (L), final suave: Calld.",
      topic: "Fonética",
    },
  ],
  d5: [
    {
      q: "Pasado de 'Buy':",
      options: ["Buyed", "Bought", "Bot"],
      correct: 1,
      feedback: "Irregular: Buy -> Bought.",
      topic: "Verbos Irregulares",
    },
    {
      q: "Pasado de 'Go':",
      options: ["Goed", "Went", "Gone"],
      correct: 1,
      feedback: "Irregular: Go -> Went.",
      topic: "Verbos Irregulares",
    },
    {
      q: "Pasado de 'Write':",
      options: ["Writed", "Wrote", "Written"],
      correct: 1,
      feedback: "Irregular: Write -> Wrote.",
      topic: "Verbos Irregulares",
    },
    {
      q: "Pasado de 'Think':",
      options: ["Thinked", "Thought", "Thank"],
      correct: 1,
      feedback: "Irregular: Think -> Thought.",
      topic: "Verbos Irregulares",
    },
    {
      q: "¿Qué técnica ayuda a memorizar verbos?",
      options: [
        "Leer la lista entera",
        "Chunking (bloques pequeños)",
        "No dormir",
      ],
      correct: 1,
      feedback: "Aprender de 5 en 5 es más efectivo.",
      topic: "Técnica de Estudio",
    },
  ],
  d6: [
    {
      q: "Estructura del Present Perfect:",
      options: [
        "Subject + Verb-ed",
        "Subject + Have/Has + Participio",
        "Subject + Am + -ing",
      ],
      correct: 1,
      feedback: "I have eaten.",
      topic: "Estructura",
    },
    {
      q: "'I have ____ (write) the code':",
      options: ["wrote", "written", "write"],
      correct: 1,
      feedback: "Participio de Write es Written.",
      topic: "Participios",
    },
    {
      q: "¿Cuándo usas Present Perfect?",
      options: [
        "Ayer a las 5pm",
        "Experiencias pasadas sin fecha exacta",
        "Futuro",
      ],
      correct: 1,
      feedback: "Conecta pasado con presente. El tiempo no importa.",
      topic: "Uso",
    },
    {
      q: "'She ____ finished the task':",
      options: ["have", "has", "is"],
      correct: 1,
      feedback: "She usa Has.",
      topic: "Auxiliares",
    },
    {
      q: "Significado de 'I have lived here for 2 years':",
      options: ["Ya no vivo aquí", "Sigo viviendo aquí", "Viviré aquí"],
      correct: 1,
      feedback: "Empezó en el pasado y continúa.",
      topic: "Significado",
    },
  ],
  d7: [
    {
      q: "Significado de 'Set up':",
      options: ["Sentarse", "Configurar/Instalar", "Arriba"],
      correct: 1,
      feedback: "Set up the environment.",
      topic: "Phrasal Verbs",
    },
    {
      q: "Significado de 'Figure out':",
      options: ["Dibujar", "Resolver/Entender", "Salir"],
      correct: 1,
      feedback: "I need to figure out the problem.",
      topic: "Phrasal Verbs",
    },
    {
      q: "'Look into' significa:",
      options: ["Mirar adentro", "Investigar", "Ignorar"],
      correct: 1,
      feedback: "I will look into the issue.",
      topic: "Phrasal Verbs",
    },
    {
      q: "'Run into' un problema:",
      options: ["Correr hacia", "Encontrarse con", "Huir de"],
      correct: 1,
      feedback: "I ran into a bug.",
      topic: "Phrasal Verbs",
    },
    {
      q: "¿Qué es un Phrasal Verb?",
      options: [
        "Un verbo largo",
        "Verbo + Preposición con nuevo significado",
        "Un modismo",
      ],
      correct: 1,
      feedback: "Cambia el significado original del verbo.",
      topic: "Definición",
    },
  ],
  d8: [
    {
      q: "Para iniciar una reunión:",
      options: ["Let's get started", "Start now", "Go"],
      correct: 0,
      feedback: "Formal y directo: Let's get started.",
      topic: "Meetings",
    },
    {
      q: "Para pedir aclaración:",
      options: ["What?", "Could you elaborate?", "Repeat"],
      correct: 1,
      feedback: "Educado: Could you elaborate?",
      topic: "Meetings",
    },
    {
      q: "Para dar tu opinión:",
      options: ["I think...", "From my perspective...", "Ambas"],
      correct: 2,
      feedback: "Ambas son válidas.",
      topic: "Meetings",
    },
    {
      q: "Si estás de acuerdo:",
      options: ["I agree", "I am agree", "Agreeing"],
      correct: 0,
      feedback: "Nunca digas 'I am agree'. Solo 'I agree'.",
      topic: "Errores Comunes",
    },
    {
      q: "Para terminar la reunión:",
      options: ["Bye", "Let's wrap up", "Finish"],
      correct: 1,
      feedback: "'Wrap up' es común para 'concluir'.",
      topic: "Meetings",
    },
  ],
  d9: [
    {
      q: "Comparativo de 'Fast':",
      options: ["More fast", "Faster", "Fastest"],
      correct: 1,
      feedback: "Adjetivo corto + er.",
      topic: "Comparativos",
    },
    {
      q: "Comparativo de 'Efficient':",
      options: ["Efficienter", "More efficient", "Most efficient"],
      correct: 1,
      feedback: "Adjetivo largo usa 'More'.",
      topic: "Comparativos",
    },
    {
      q: "Superlativo de 'Good':",
      options: ["Goodest", "Best", "The Best"],
      correct: 2,
      feedback: "Irregular: Good -> The Best.",
      topic: "Superlativos",
    },
    {
      q: "'Python is ____ than C++' (fácil):",
      options: ["easier", "more easy", "easyer"],
      correct: 0,
      feedback: "Termina en Y -> ier.",
      topic: "Comparativos",
    },
    {
      q: "Este es el bug ____ (malo):",
      options: ["baddest", "worse", "worst"],
      correct: 2,
      feedback: "Bad -> Worse -> The Worst.",
      topic: "Superlativos",
    },
  ],
  d10: [
    {
      q: "Decisión espontánea: 'The server is down! I ____ fix it.'",
      options: ["going to", "will", "am fix"],
      correct: 1,
      feedback: "'Will' para decisiones del momento.",
      topic: "Futuro",
    },
    {
      q: "Plan previo: 'Tomorrow I ____ deploy the update.'",
      options: ["will", "am going to", "go"],
      correct: 1,
      feedback: "'Going to' para planes ya decididos.",
      topic: "Futuro",
    },
    {
      q: "'I ____ start a new project next month.' (intención)",
      options: ["will", "am going to", "do"],
      correct: 1,
      feedback: "'Going to' para intenciones y planes.",
      topic: "Futuro",
    },
    {
      q: "Prediction based on evidence: 'Look at those errors! The system ____ crash.'",
      options: ["is going to", "will", "is"],
      correct: 0,
      feedback: "Evidencia presente -> Going to.",
      topic: "Futuro",
    },
    {
      q: "Promise: 'I ____ finish the ticket by Friday.'",
      options: ["will", "am going to", "am"],
      correct: 0,
      feedback: "Promesas -> Will.",
      topic: "Futuro",
    },
  ],
  d11: [
    {
      q: "If the code ____, I will push it.",
      options: ["works", "will work", "working"],
      correct: 0,
      feedback: "Primer condicional: If + presente, will + verbo.",
      topic: "Condicionales",
    },
    {
      q: "If I ____ more time, I would refactor everything.",
      options: ["have", "had", "will have"],
      correct: 1,
      feedback: "Segundo condicional (hipotético): If + pasado.",
      topic: "Condicionales",
    },
    {
      q: "If the test ____ pass, the deployment will fail.",
      options: ["doesn't", "won't", "didn't"],
      correct: 0,
      feedback: "Primer condicional: If + presente negativo.",
      topic: "Condicionales",
    },
    {
      q: "Zero Conditional (Facts): 'If you ____ (click) here, the modal opens.'",
      options: ["click", "clicked", "will click"],
      correct: 0,
      feedback: "Hechos generales -> Presente + Presente.",
      topic: "Condicionales",
    },
    {
      q: "Third Conditional (Regret): 'If I ____ (know) about the bug, I would have fixed it.'",
      options: ["had known", "knew", "have known"],
      correct: 0,
      feedback: "Pasado irreal -> Had + Participio.",
      topic: "Condicionales",
    },
  ],
  d12: [
    {
      q: "En una entrevista: 'Tell me about ____'",
      options: ["you", "yourself", "your"],
      correct: 1,
      feedback: "'Yourself' es reflexivo correcto.",
      topic: "Entrevistas",
    },
    {
      q: "'I ____ 3 years of experience in React'",
      options: ["has", "have", "am"],
      correct: 1,
      feedback: "'I have' - primera persona.",
      topic: "Entrevistas",
    },
    {
      q: "'In my previous role, I ____ responsible for...'",
      options: ["am", "was", "be"],
      correct: 1,
      feedback: "Hablar del pasado: 'was' (era/estaba).",
      topic: "Entrevistas",
    },
    {
      q: "Weakness: 'My weakness is that I ____ (focus) too much on details.'",
      options: ["focus", "focused", "focusing"],
      correct: 0,
      feedback: "Presente simple para describir hábitos/rasgos.",
      topic: "Entrevistas",
    },
    {
      q: "Strength: 'I am good at ____ (solve) problems.'",
      options: ["solve", "solving", "solved"],
      correct: 1,
      feedback: "Good at + Verbo-ING (Gerundio).",
      topic: "Entrevistas",
    },
  ],
  d13: [
    {
      q: "Inicio formal de email:",
      options: ["Hey!", "Dear Mr. Smith,", "Yo,"],
      correct: 1,
      feedback: "'Dear' es formal y profesional.",
      topic: "Emails",
    },
    {
      q: "Cierre profesional de email:",
      options: ["Bye!", "Best regards,", "Later!"],
      correct: 1,
      feedback: "'Best regards' es estándar profesional.",
      topic: "Emails",
    },
    {
      q: "'I'm writing to ____ about the project status.'",
      options: ["tell", "inquire", "say"],
      correct: 1,
      feedback: "'Inquire' es formal para preguntar.",
      topic: "Emails",
    },
    {
      q: "Attachment: 'Please find ____ the report.'",
      options: ["attached", "attaching", "attach"],
      correct: 0,
      feedback: "Frase estándar: Please find attached.",
      topic: "Emails",
    },
    {
      q: "Apology: 'I apologize ____ the delay.'",
      options: ["for", "of", "about"],
      correct: 0,
      feedback: "Apologize FOR something.",
      topic: "Emails",
    },
  ],
  d14: [
    {
      q: "Para empezar presentación: 'Today I'm ____ to show you...'",
      options: ["go", "going", "went"],
      correct: 1,
      feedback: "'I'm going to' para introducir presentaciones.",
      topic: "Presentaciones",
    },
    {
      q: "'Let me ____ you through the demo.'",
      options: ["walk", "go", "run"],
      correct: 0,
      feedback: "'Walk someone through' = guiar paso a paso.",
      topic: "Presentaciones",
    },
    {
      q: "'Are there ____ questions?'",
      options: ["some", "any", "a"],
      correct: 1,
      feedback: "'Any' para preguntas.",
      topic: "Presentaciones",
    },
    {
      q: "Transition: 'Moving ____ to the next slide.'",
      options: ["on", "up", "in"],
      correct: 0,
      feedback: "Move on = Avanzar/Continuar.",
      topic: "Presentaciones",
    },
    {
      q: "Conclusion: 'To ____ up, we achieved the goal.'",
      options: ["sum", "add", "count"],
      correct: 0,
      feedback: "Sum up = Resumir.",
      topic: "Presentaciones",
    },
  ],
  d15: [
    {
      q: "'By next month, I ____ finished the project.' (futuro perfecto)",
      options: ["will have", "have", "had"],
      correct: 0,
      feedback: "Future Perfect: will have + participio.",
      topic: "Future Perfect",
    },
    {
      q: "'I wish I ____ more time.' (deseo hipotético)",
      options: ["have", "had", "will have"],
      correct: 1,
      feedback: "'Wish + past' para deseos irreales.",
      topic: "Wishes",
    },
    {
      q: "'The code ____ been reviewed.' (voz pasiva)",
      options: ["have", "has", "is"],
      correct: 1,
      feedback: "Passive: has/have been + participio.",
      topic: "Passive Voice",
    },
    {
      q: "Phrasal Verb: 'Can you ____ (turn) on the server?'",
      options: ["turn", "turned", "turning"],
      correct: 0,
      feedback: "Can + Verbo base.",
      topic: "Phrasal Verbs",
    },
    {
      q: "Modal: 'You ____ (should) check the logs.'",
      options: ["should", "ought", "must to"],
      correct: 0,
      feedback: "Should = Debería (consejo).",
      topic: "Modals",
    },
  ],
};

// --- FLASHCARDS DATA POR DÍA (EXPANDIDO A 75+) ---
const flashcardsDataByDay = {
  d1: [
    {
      word: "Code",
      pronunciation: "coud",
      hint: "Verb/Noun (programming)",
      translation: "Código / Codificar",
      example: "I code every day.",
      topic: "Shadowing & Basics",
      usage:
        "Se usa para referirse a escribir programas o al código fuente. Es fundamental en programación.",
    },
    {
      word: "Debug",
      pronunciation: "di-bóg",
      hint: "Verb (programming)",
      translation: "Depurar / Corregir errores",
      example: "I need to debug this function.",
      topic: "Shadowing & Basics",
      usage:
        "Proceso de encontrar y corregir errores en el código. Esencial para desarrolladores.",
    },
    {
      word: "Run",
      pronunciation: "ran",
      hint: "Verb",
      translation: "Ejecutar",
      example: "Run the program.",
      topic: "Present Simple",
      usage:
        "Ejecutar código o un programa. Muy común en desarrollo de software.",
    },
    {
      word: "Subject",
      pronunciation: "sáb-yekt",
      hint: "Noun (grammar)",
      translation: "Sujeto",
      example: "The subject comes first.",
      topic: "Grammar Structure",
      usage:
        "En gramática inglesa, el sujeto siempre va primero. I, You, He, She, It, We, They.",
    },
    {
      word: "Compile",
      pronunciation: "com-páil",
      hint: "Verb (programming)",
      translation: "Compilar",
      example: "Compile the code before running.",
      topic: "Shadowing & Basics",
      usage:
        "Convertir código fuente a código máquina. Necesario en lenguajes como C++, Java.",
    },
  ],
  d2: [
    {
      word: "Question",
      pronunciation: "cuésh-chon",
      hint: "Noun",
      translation: "Pregunta",
      example: "Do you have a question?",
      topic: "Active Recall",
      usage:
        "Las preguntas en inglés requieren auxiliares como DO/DOES al inicio.",
    },
    {
      word: "Ask",
      pronunciation: "ask",
      hint: "Verb",
      translation: "Preguntar",
      example: "Ask me anything.",
      topic: "Questions with DO",
      usage:
        "Para hacer preguntas formales. 'Ask' vs 'Tell': Ask para preguntar, Tell para decir/ordenar.",
    },
    {
      word: "Answer",
      pronunciation: "án-ser",
      hint: "Verb/Noun",
      translation: "Respuesta / Responder",
      example: "I will answer your question.",
      topic: "Questions",
      usage:
        "Responder a preguntas. En entrevistas: 'Answer clearly and concisely.'",
    },
    {
      word: "Work",
      pronunciation: "wérk",
      hint: "Verb",
      translation: "Trabajar / Funcionar",
      example: "Does it work?",
      topic: "DO/DOES",
      usage:
        "Doble significado: trabajar (empleo) o funcionar (máquina/código).",
    },
    {
      word: "Understand",
      pronunciation: "ander-stánd",
      hint: "Verb",
      translation: "Entender",
      example: "Do you understand?",
      topic: "Questions",
      usage:
        "Verbo importante para confirmar comprensión. 'I understand' = Entiendo.",
    },
  ],
  d3: [
    {
      word: "On",
      pronunciation: "on",
      hint: "Preposition",
      translation: "Sobre (superficie)",
      example: "The laptop is on the desk.",
      topic: "Prepositions",
      usage:
        "ON = superficie física. También: on Monday, on time, on the phone.",
    },
    {
      word: "In",
      pronunciation: "in",
      hint: "Preposition",
      translation: "Dentro de",
      example: "The file is in the folder.",
      topic: "Prepositions",
      usage:
        "IN = dentro de algo. También: in the morning, in 2024, in English.",
    },
    {
      word: "At",
      pronunciation: "at",
      hint: "Preposition",
      translation: "En (lugar específico)",
      example: "I'm at the office.",
      topic: "Prepositions",
      usage: "AT = punto específico. También: at 5pm, at the meeting, at home.",
    },
    {
      word: "There is/are",
      pronunciation: "der is/ar",
      hint: "Expression",
      translation: "Hay",
      example: "There is a bug in the code.",
      topic: "Existence",
      usage:
        "'There is' = singular. 'There are' = plural. Para indicar existencia.",
    },
    {
      word: "Between",
      pronunciation: "bi-tuín",
      hint: "Preposition",
      translation: "Entre (dos)",
      example: "Between you and me.",
      topic: "Prepositions",
      usage: "Entre dos cosas. Para más de dos: 'among'.",
    },
  ],
  d4: [
    {
      word: "Worked",
      pronunciation: "wérkt",
      hint: "Past tense",
      translation: "Trabajé/Trabajó",
      example: "I worked yesterday. (Workt)",
      topic: "Phonetics -ED",
      usage:
        "Sonido /t/ después de consonantes sordas (k, p, s, ch, sh, f). NO se pronuncia la 'e'.",
    },
    {
      word: "Played",
      pronunciation: "pléid",
      hint: "Past tense",
      translation: "Jugué/Jugó",
      example: "We played games. (Playd)",
      topic: "Phonetics -ED",
      usage:
        "Sonido /d/ después de vocales y consonantes sonoras. Suena como 'playd'.",
    },
    {
      word: "Wanted",
      pronunciation: "wón-ted",
      hint: "Past tense",
      translation: "Quise/Quiso",
      example: "She wanted to learn. (Want-ed)",
      topic: "Phonetics -ED",
      usage:
        "Sonido /ɪd/ solo después de 't' o 'd'. Aquí SÍ se pronuncia la 'e'.",
    },
    {
      word: "Fixed",
      pronunciation: "fikst",
      hint: "Past tense",
      translation: "Arreglé/Arregló",
      example: "I fixed the bug. (Fixt)",
      topic: "Phonetics -ED",
      usage: "Sonido /t/ - una sola sílaba. Muy común en programación.",
    },
    {
      word: "Started",
      pronunciation: "stár-ted",
      hint: "Past tense",
      translation: "Empecé/Empezó",
      example: "I started coding.",
      topic: "Phonetics -ED",
      usage: "Sonido /ɪd/ porque termina en 't'. Se dice 'star-ted'.",
    },
  ],
  d5: [
    {
      word: "Buy → Bought",
      pronunciation: "bai → bot",
      hint: "Irregular verb",
      translation: "Comprar → Compré",
      example: "I bought a new laptop.",
      topic: "Irregular Verbs",
      usage:
        "Verbo irregular muy común. Buy-Bought-Bought (presente-pasado-participio).",
    },
    {
      word: "Go → Went",
      pronunciation: "gou → went",
      hint: "Irregular verb",
      translation: "Ir → Fui",
      example: "I went to the meeting.",
      topic: "Irregular Verbs",
      usage:
        "Cambio total. Go-Went-Gone. 'I'm going' (presente continuo) también muy usado.",
    },
    {
      word: "Make → Made",
      pronunciation: "meik → meid",
      hint: "Irregular verb",
      translation: "Hacer → Hice",
      example: "I made a website.",
      topic: "Irregular Verbs",
      usage: "Make vs Do: Make = crear algo. Do = realizar una acción.",
    },
    {
      word: "Write → Wrote",
      pronunciation: "rait → rout",
      hint: "Irregular verb",
      translation: "Escribir → Escribí",
      example: "I wrote the documentation.",
      topic: "Irregular Verbs",
      usage: "Write-Wrote-Written. Esencial para documentación y código.",
    },
    {
      word: "See → Saw",
      pronunciation: "si → so",
      hint: "Irregular verb",
      translation: "Ver → Vi",
      example: "I saw the error.",
      topic: "Irregular Verbs",
      usage:
        "See-Saw-Seen. 'I see' también significa 'entiendo' en conversación.",
    },
  ],
  d6: [
    {
      word: "Have done",
      pronunciation: "jav dan",
      hint: "Present Perfect",
      translation: "He hecho / He terminado",
      example: "I have done the task.",
      topic: "Present Perfect",
      usage:
        "Present Perfect para acciones completadas con relevancia actual. Have/Has + participio pasado.",
    },
    {
      word: "Have been",
      pronunciation: "jav bin",
      hint: "Present Perfect",
      translation: "He estado / He sido",
      example: "I have been working here for 3 years.",
      topic: "Present Perfect",
      usage: "Para experiencias o estados que continúan hasta el presente.",
    },
    {
      word: "Ever",
      pronunciation: "éver",
      hint: "Adverb",
      translation: "Alguna vez",
      example: "Have you ever been to London?",
      topic: "Present Perfect",
      usage:
        "Usado en preguntas para experiencias de vida. 'Have you ever...?'",
    },
    {
      word: "Never",
      pronunciation: "néver",
      hint: "Adverb",
      translation: "Nunca",
      example: "I have never seen this error.",
      topic: "Present Perfect",
      usage: "Negación de experiencias. 'I have never + participio'.",
    },
    {
      word: "Already",
      pronunciation: "ol-rédi",
      hint: "Adverb",
      translation: "Ya",
      example: "I have already finished.",
      topic: "Present Perfect",
      usage: "Para indicar que algo se completó antes de lo esperado.",
    },
  ],
  d7: [
    {
      word: "Set up",
      pronunciation: "set ap",
      hint: "Phrasal verb",
      translation: "Configurar / Instalar",
      example: "I need to set up the environment.",
      topic: "Phrasal Verbs",
      usage: "Muy común en tech. 'Set up a server' = configurar un servidor.",
    },
    {
      word: "Figure out",
      pronunciation: "fíg-yer aut",
      hint: "Phrasal verb",
      translation: "Descubrir / Resolver",
      example: "I figured out the bug.",
      topic: "Phrasal Verbs",
      usage: "Entender o resolver algo. 'Let me figure it out'.",
    },
    {
      word: "Look into",
      pronunciation: "luk íntu",
      hint: "Phrasal verb",
      translation: "Investigar",
      example: "I'll look into that issue.",
      topic: "Phrasal Verbs",
      usage: "Investigar algo más a fondo. Profesional en emails.",
    },
    {
      word: "Run into",
      pronunciation: "ran íntu",
      hint: "Phrasal verb",
      translation: "Encontrarse con (problema)",
      example: "I ran into an error.",
      topic: "Phrasal Verbs",
      usage: "Para problemas inesperados. También para encontrar personas.",
    },
    {
      word: "Come up with",
      pronunciation: "cam ap wiz",
      hint: "Phrasal verb",
      translation: "Idear / Proponer",
      example: "I came up with a solution.",
      topic: "Phrasal Verbs",
      usage: "Crear una idea o solución. Muy valorado en entrevistas.",
    },
  ],
  d8: [
    {
      word: "Let's get started",
      pronunciation: "lets get stárted",
      hint: "Meeting phrase",
      translation: "Comencemos",
      example: "OK, let's get started.",
      topic: "Tech Meetings",
      usage: "Frase para iniciar reuniones. Profesional y directa.",
    },
    {
      word: "Could you elaborate",
      pronunciation: "cud yu ilá-bo-reit",
      hint: "Meeting phrase",
      translation: "¿Podrías explicar más?",
      example: "Could you elaborate on that?",
      topic: "Tech Meetings",
      usage: "Pedir más detalles educadamente. Muy usado en reuniones.",
    },
    {
      word: "To sum up",
      pronunciation: "tu sam ap",
      hint: "Meeting phrase",
      translation: "Para resumir",
      example: "To sum up, we need to...",
      topic: "Tech Meetings",
      usage: "Resumir puntos antes de terminar. 'In summary' es alternativa.",
    },
    {
      word: "Action items",
      pronunciation: "ák-shon ái-tems",
      hint: "Meeting term",
      translation: "Tareas / Acciones a seguir",
      example: "Let's define the action items.",
      topic: "Tech Meetings",
      usage: "Tareas que resultan de la reunión. Muy común en Agile.",
    },
    {
      word: "Align on",
      pronunciation: "a-láin on",
      hint: "Meeting phrase",
      translation: "Ponerse de acuerdo en",
      example: "Let's align on the timeline.",
      topic: "Tech Meetings",
      usage: "Asegurar que todos estén de acuerdo. Término corporativo común.",
    },
  ],
  d9: [
    {
      word: "Faster",
      pronunciation: "fás-ter",
      hint: "Comparative",
      translation: "Más rápido",
      example: "This code is faster than before.",
      topic: "Comparatives",
      usage: "Adjetivo corto + ER. Fast → Faster → Fastest.",
    },
    {
      word: "More efficient",
      pronunciation: "mor i-fí-shent",
      hint: "Comparative",
      translation: "Más eficiente",
      example: "React is more efficient.",
      topic: "Comparatives",
      usage: "MORE + adjetivo largo para comparar.",
    },
    {
      word: "The best",
      pronunciation: "de best",
      hint: "Superlative",
      translation: "El mejor",
      example: "This is the best solution.",
      topic: "Superlatives",
      usage: "Superlativos siempre con THE. Good → Better → The Best.",
    },
    {
      word: "Than",
      pronunciation: "dan",
      hint: "Conjunction",
      translation: "Que (comparativo)",
      example: "Python is easier than C++.",
      topic: "Comparatives",
      usage: "Siempre después del comparativo: X is [adj]-er THAN Y.",
    },
    {
      word: "As...as",
      pronunciation: "as...as",
      hint: "Comparison structure",
      translation: "Tan...como",
      example: "It's as fast as the old version.",
      topic: "Comparisons",
      usage: "Para igualdad. 'Not as...as' para diferencia.",
    },
  ],
  d10: [
    {
      word: "Will",
      pronunciation: "wil",
      hint: "Future (spontaneous)",
      translation: "Futuro espontáneo",
      example: "I will fix it now!",
      topic: "Future Tense",
      usage: "Decisiones en el momento. También para promesas y predicciones.",
    },
    {
      word: "Going to",
      pronunciation: "góuin tu",
      hint: "Future (planned)",
      translation: "Futuro planeado",
      example: "I'm going to deploy tomorrow.",
      topic: "Future Tense",
      usage: "Para planes ya decididos. En conversación suena como 'gonna'.",
    },
    {
      word: "Deploy",
      pronunciation: "di-plói",
      hint: "Verb (DevOps)",
      translation: "Desplegar",
      example: "We will deploy the app.",
      topic: "Future Actions",
      usage: "Publicar código en producción. Término clave en DevOps.",
    },
    {
      word: "Launch",
      pronunciation: "lónch",
      hint: "Verb",
      translation: "Lanzar",
      example: "We're going to launch next week.",
      topic: "Future Plans",
      usage:
        "Lanzamiento de producto/app. 'Product launch' = lanzamiento de producto.",
    },
    {
      word: "Schedule",
      pronunciation: "skéd-yul (US) / shéd-yul (UK)",
      hint: "Verb/Noun",
      translation: "Programar / Horario",
      example: "I'll schedule a meeting.",
      topic: "Future Plans",
      usage:
        "Muy usado en ambiente laboral. 'According to schedule' = según lo planeado.",
    },
  ],
  d11: [
    {
      word: "If...then",
      pronunciation: "if...den",
      hint: "Conditional",
      translation: "Si...entonces",
      example: "If it works, then I'll commit.",
      topic: "Conditionals",
      usage: "Estructura condicional básica. El 'then' es opcional en inglés.",
    },
    {
      word: "Would",
      pronunciation: "wud",
      hint: "Conditional",
      translation: "Condicional",
      example: "I would refactor if I had time.",
      topic: "Second Conditional",
      usage:
        "Situaciones hipotéticas. 'Would you...?' = forma cortés de pedir algo.",
    },
    {
      word: "Could",
      pronunciation: "cud",
      hint: "Modal verb",
      translation: "Podría",
      example: "Could you review my code?",
      topic: "Conditionals",
      usage: "Posibilidad o petición cortés. Más formal que 'can'.",
    },
    {
      word: "Unless",
      pronunciation: "an-lés",
      hint: "Conjunction",
      translation: "A menos que",
      example: "Unless there's a bug, we ship.",
      topic: "Conditionals",
      usage: "'Unless' = 'if not'. Muy útil para condiciones negativas.",
    },
    {
      word: "Might",
      pronunciation: "máit",
      hint: "Modal verb",
      translation: "Podría (posibilidad)",
      example: "It might take longer.",
      topic: "Conditionals",
      usage: "Posibilidad menor que 'may'. 'It might work' = Podría funcionar.",
    },
  ],
  d12: [
    {
      word: "Experience",
      pronunciation: "ex-pír-iens",
      hint: "Noun",
      translation: "Experiencia",
      example: "I have 3 years of experience.",
      topic: "Interviews",
      usage: "Clave en entrevistas. 'Work experience' = experiencia laboral.",
    },
    {
      word: "Responsible for",
      pronunciation: "ri-spón-sibl for",
      hint: "Expression",
      translation: "Responsable de",
      example: "I was responsible for the API.",
      topic: "Interviews",
      usage:
        "Para describir tus funciones. 'I was in charge of...' es alternativa.",
    },
    {
      word: "Tell me about yourself",
      pronunciation: "tel mi abáut yor-self",
      hint: "Interview phrase",
      translation: "Cuéntame sobre ti",
      example: "Tell me about yourself.",
      topic: "Interviews",
      usage:
        "Primera pregunta típica. Prepara un 'elevator pitch' de 1-2 minutos.",
    },
    {
      word: "Strength",
      pronunciation: "strénkz",
      hint: "Noun",
      translation: "Fortaleza",
      example: "My strength is problem-solving.",
      topic: "Interviews",
      usage:
        "Pregunta común: 'What are your strengths?' Prepara ejemplos concretos.",
    },
    {
      word: "Challenge",
      pronunciation: "chá-lensh",
      hint: "Noun/Verb",
      translation: "Desafío / Retar",
      example: "The biggest challenge was...",
      topic: "Interviews",
      usage:
        "Para describir problemas que resolviste. 'Faced a challenge' = enfrenté un desafío.",
    },
  ],
  d13: [
    {
      word: "Dear",
      pronunciation: "dir",
      hint: "Greeting (formal)",
      translation: "Estimado/a",
      example: "Dear Mr. Smith,",
      topic: "Emails",
      usage: "Saludo formal. 'Dear Sir/Madam' si no conoces el nombre.",
    },
    {
      word: "Best regards",
      pronunciation: "best ri-gárds",
      hint: "Closing",
      translation: "Saludos cordiales",
      example: "Best regards, John",
      topic: "Emails",
      usage:
        "Cierre semi-formal. 'Kind regards' es similar. 'Sincerely' más formal.",
    },
    {
      word: "I'm writing to",
      pronunciation: "aim ráiting tu",
      hint: "Email phrase",
      translation: "Le escribo para",
      example: "I'm writing to request...",
      topic: "Emails",
      usage: "Introduce el propósito del email. Directo y profesional.",
    },
    {
      word: "Please find attached",
      pronunciation: "plis faind atácht",
      hint: "Email phrase",
      translation: "Adjunto encontrará",
      example: "Please find attached the report.",
      topic: "Emails",
      usage: "Frase estándar para adjuntos. Alternativa: 'I have attached...'",
    },
    {
      word: "Looking forward to",
      pronunciation: "lúking fór-werd tu",
      hint: "Email phrase",
      translation: "Esperando con ansias",
      example: "Looking forward to your reply.",
      topic: "Emails",
      usage:
        "Cierre positivo. Siempre seguido de sustantivo o -ing: 'Looking forward to hearing from you.'",
    },
  ],
  d14: [
    {
      word: "Today I'm going to",
      pronunciation: "tu-déi aim góuing tu",
      hint: "Presentation opener",
      translation: "Hoy voy a...",
      example: "Today I'm going to show you our new feature.",
      topic: "Presentations",
      usage: "Forma estándar de comenzar una presentación.",
    },
    {
      word: "Walk you through",
      pronunciation: "wok yu zru",
      hint: "Presentation phrase",
      translation: "Guiarte paso a paso",
      example: "Let me walk you through the demo.",
      topic: "Presentations",
      usage: "Explicar algo detalladamente. Muy profesional.",
    },
    {
      word: "As you can see",
      pronunciation: "as yu can si",
      hint: "Presentation phrase",
      translation: "Como pueden ver",
      example: "As you can see, the results improved.",
      topic: "Presentations",
      usage: "Señalar algo visible en slides o demos.",
    },
    {
      word: "Any questions?",
      pronunciation: "éni cuéshons",
      hint: "Q&A phrase",
      translation: "¿Alguna pregunta?",
      example: "Are there any questions?",
      topic: "Presentations",
      usage: "Invitar preguntas al final. Usa 'any' en preguntas.",
    },
    {
      word: "In conclusion",
      pronunciation: "in con-clú-shon",
      hint: "Closing phrase",
      translation: "En conclusión",
      example: "In conclusion, this solution saves time.",
      topic: "Presentations",
      usage: "Señalar el cierre de la presentación.",
    },
  ],
  d15: [
    {
      word: "Will have finished",
      pronunciation: "wil jav fínisht",
      hint: "Future Perfect",
      translation: "Habré terminado",
      example: "By Friday, I will have finished the project.",
      topic: "Future Perfect",
      usage:
        "Acciones completadas antes de un momento futuro. Will have + participio.",
    },
    {
      word: "I wish I had",
      pronunciation: "ai wish ai jad",
      hint: "Wish clause",
      translation: "Desearía tener/haber",
      example: "I wish I had more time.",
      topic: "Wishes",
      usage:
        "Para deseos sobre situaciones presentes irreales. Wish + past simple.",
    },
    {
      word: "Has been reviewed",
      pronunciation: "jas bin rivíud",
      hint: "Passive voice",
      translation: "Ha sido revisado",
      example: "The code has been reviewed.",
      topic: "Passive Voice",
      usage: "Voz pasiva perfecta: has/have been + participio.",
    },
    {
      word: "Should have done",
      pronunciation: "shud jav dan",
      hint: "Modal perfect",
      translation: "Debería haber hecho",
      example: "I should have tested it first.",
      topic: "Modal Perfects",
      usage:
        "Arrepentimiento o crítica sobre el pasado. Should have + participio.",
    },
    {
      word: "By the time",
      pronunciation: "bai de taim",
      hint: "Conjunction",
      translation: "Para cuando",
      example: "By the time you arrive, I will have left.",
      topic: "Future Perfect",
      usage: "Conecta dos acciones en el futuro con different completions.",
    },
  ],
};

// Función para obtener flashcards acumuladas hasta un día específico
function getFlashcardsUpToDay(dayNum) {
  let cards = [];
  for (let i = 1; i <= dayNum; i++) {
    const dayKey = `d${i}`;
    if (flashcardsDataByDay[dayKey]) {
      cards = cards.concat(flashcardsDataByDay[dayKey]);
    }
  }
  return cards;
}

// Variable para flashcards actual (se actualiza con filtro)
let currentFlashcardsData = [];
let currentFlashcardDayFilter = "all";

// --- VOCABULARIO DATA POR DÍA (EXPANDIDO) ---
const vocabByDay = {
  d1: {
    programming: [
      { word: "Code", meaning: "Código", example: "Write clean code" },
      { word: "Variable", meaning: "Variable", example: "Declare a variable" },
      { word: "Function", meaning: "Función", example: "Call the function" },
      { word: "Bug", meaning: "Error en el código", example: "Fix this bug" },
      {
        word: "Algorithm",
        meaning: "Algoritmo",
        example: "Efficient algorithm",
      },
      { word: "Syntax", meaning: "Sintaxis", example: "Syntax error" },
    ],
    business: [
      { word: "Meeting", meaning: "Reunión", example: "Schedule a meeting" },
      { word: "Team", meaning: "Equipo", example: "Team collaboration" },
      { word: "Project", meaning: "Proyecto", example: "Start a project" },
    ],
    phrases: [
      { word: "I code every day", meaning: "Codifico todos los días" },
      { word: "She codes well", meaning: "Ella codifica bien" },
      { word: "The code runs", meaning: "El código se ejecuta" },
    ],
  },
  d2: {
    programming: [
      {
        word: "Repository",
        meaning: "Repositorio de código",
        example: "Clone the repository",
      },
      {
        word: "Array",
        meaning: "Arreglo/Lista",
        example: "Initialize an array",
      },
      {
        word: "String",
        meaning: "Cadena de texto",
        example: "Parse the string",
      },
      {
        word: "Boolean",
        meaning: "Booleano (true/false)",
        example: "Boolean value",
      },
      { word: "Integer", meaning: "Número entero", example: "Integer type" },
      {
        word: "Parameter",
        meaning: "Parámetro",
        example: "Function parameter",
      },
    ],
    business: [
      {
        word: "Deadline",
        meaning: "Fecha límite",
        example: "Meet the deadline",
      },
      {
        word: "Schedule",
        meaning: "Calendario/Horario",
        example: "Check the schedule",
      },
      { word: "Task", meaning: "Tarea", example: "Complete the task" },
    ],
    phrases: [
      { word: "Do you understand?", meaning: "¿Entiendes?" },
      { word: "Does it work?", meaning: "¿Funciona?" },
      { word: "Where does it fail?", meaning: "¿Dónde falla?" },
    ],
  },
  d3: {
    programming: [
      { word: "Object", meaning: "Objeto", example: "Create an object" },
      { word: "Loop", meaning: "Bucle/Ciclo", example: "For loop" },
      { word: "Class", meaning: "Clase", example: "Define a class" },
      { word: "Method", meaning: "Método", example: "Call the method" },
      { word: "Property", meaning: "Propiedad", example: "Object property" },
      { word: "Instance", meaning: "Instancia", example: "Class instance" },
    ],
    business: [
      { word: "Office", meaning: "Oficina", example: "Work at the office" },
      { word: "Desk", meaning: "Escritorio", example: "Sit at the desk" },
      { word: "Department", meaning: "Departamento", example: "IT department" },
    ],
    phrases: [
      {
        word: "The file is in the folder",
        meaning: "El archivo está en la carpeta",
      },
      { word: "There is a bug", meaning: "Hay un error" },
      { word: "There are many files", meaning: "Hay muchos archivos" },
    ],
  },
  d4: {
    programming: [
      {
        word: "Compiled",
        meaning: "Compilado",
        example: "Successfully compiled",
      },
      { word: "Executed", meaning: "Ejecutado", example: "Code executed" },
      { word: "Debugged", meaning: "Depurado", example: "I debugged it" },
      { word: "Tested", meaning: "Probado", example: "Fully tested" },
      {
        word: "Committed",
        meaning: "Commiteado",
        example: "Changes committed",
      },
      { word: "Merged", meaning: "Fusionado", example: "Branch merged" },
    ],
    business: [
      { word: "Worked", meaning: "Trabajó", example: "We worked hard" },
      { word: "Finished", meaning: "Terminó", example: "Task finished" },
      {
        word: "Completed",
        meaning: "Completado",
        example: "Project completed",
      },
    ],
    phrases: [
      { word: "I worked yesterday", meaning: "Trabajé ayer" },
      { word: "We finished the project", meaning: "Terminamos el proyecto" },
      { word: "They pushed the code", meaning: "Ellos subieron el código" },
    ],
  },
  d5: {
    programming: [
      {
        word: "Wrote",
        meaning: "Escribió (pasado)",
        example: "She wrote the tests",
      },
      {
        word: "Built",
        meaning: "Construyó (pasado)",
        example: "We built the API",
      },
      { word: "Ran", meaning: "Ejecutó (pasado)", example: "The script ran" },
      {
        word: "Broke",
        meaning: "Rompió (pasado)",
        example: "It broke the build",
      },
      {
        word: "Found",
        meaning: "Encontró (pasado)",
        example: "Found a solution",
      },
      { word: "Made", meaning: "Hizo (pasado)", example: "Made progress" },
    ],
    business: [
      {
        word: "Bought",
        meaning: "Compró (pasado)",
        example: "We bought licenses",
      },
      { word: "Sent", meaning: "Envió (pasado)", example: "Email sent" },
      { word: "Had", meaning: "Tuvo (pasado)", example: "Had a meeting" },
    ],
    phrases: [
      { word: "I went to the office", meaning: "Fui a la oficina" },
      { word: "She made a website", meaning: "Ella hizo un sitio web" },
      { word: "We wrote documentation", meaning: "Escribimos documentación" },
    ],
  },
  d6: {
    programming: [
      { word: "Deploy", meaning: "Desplegar", example: "Deploy to production" },
      { word: "Release", meaning: "Lanzamiento", example: "New release ready" },
      { word: "Update", meaning: "Actualizar", example: "Update dependencies" },
      { word: "Migrate", meaning: "Migrar", example: "Migrate the database" },
      { word: "Scale", meaning: "Escalar", example: "Scale the servers" },
      {
        word: "Monitor",
        meaning: "Monitorear",
        example: "Monitor performance",
      },
    ],
    business: [
      { word: "Launch", meaning: "Lanzar", example: "Product launch" },
      { word: "Plan", meaning: "Plan/Planear", example: "Follow the plan" },
      {
        word: "Strategy",
        meaning: "Estrategia",
        example: "Marketing strategy",
      },
    ],
    phrases: [
      { word: "I will fix it", meaning: "Lo arreglaré" },
      { word: "I'm going to deploy", meaning: "Voy a desplegar" },
      { word: "We will release tomorrow", meaning: "Lanzaremos mañana" },
    ],
  },
  d7: {
    programming: [
      {
        word: "Conditional",
        meaning: "Condicional",
        example: "Conditional statement",
      },
      { word: "Exception", meaning: "Excepción", example: "Handle exceptions" },
      {
        word: "Validation",
        meaning: "Validación",
        example: "Input validation",
      },
      {
        word: "Authentication",
        meaning: "Autenticación",
        example: "User authentication",
      },
      {
        word: "Authorization",
        meaning: "Autorización",
        example: "Role authorization",
      },
      { word: "Middleware", meaning: "Middleware", example: "Add middleware" },
    ],
    business: [
      { word: "Agreement", meaning: "Acuerdo", example: "Sign the agreement" },
      { word: "Contract", meaning: "Contrato", example: "Read the contract" },
      {
        word: "Negotiation",
        meaning: "Negociación",
        example: "Salary negotiation",
      },
    ],
    phrases: [
      { word: "If it works, I'll commit", meaning: "Si funciona, haré commit" },
      { word: "I would refactor", meaning: "Yo refactorizaría" },
      { word: "Unless there's an error", meaning: "A menos que haya un error" },
    ],
  },
  d8: {
    programming: [
      {
        word: "Framework",
        meaning: "Marco de trabajo",
        example: "React framework",
      },
      { word: "API", meaning: "Interfaz de programación", example: "REST API" },
      { word: "Endpoint", meaning: "Punto de acceso", example: "API endpoint" },
      {
        word: "Database",
        meaning: "Base de datos",
        example: "Query the database",
      },
      {
        word: "Backend",
        meaning: "Servidor/Backend",
        example: "Backend developer",
      },
      {
        word: "Frontend",
        meaning: "Interfaz/Frontend",
        example: "Frontend design",
      },
    ],
    business: [
      { word: "Interview", meaning: "Entrevista", example: "Job interview" },
      {
        word: "Experience",
        meaning: "Experiencia",
        example: "Work experience",
      },
      { word: "Skills", meaning: "Habilidades", example: "Technical skills" },
    ],
    phrases: [
      { word: "Tell me about yourself", meaning: "Cuéntame sobre ti" },
      { word: "I have experience with", meaning: "Tengo experiencia con" },
      { word: "I'm looking for", meaning: "Estoy buscando" },
    ],
  },
  d9: {
    programming: [
      { word: "Attachment", meaning: "Adjunto", example: "File attachment" },
      { word: "Request", meaning: "Solicitud", example: "HTTP request" },
      { word: "Response", meaning: "Respuesta", example: "Server response" },
      { word: "Payload", meaning: "Carga útil", example: "JSON payload" },
      { word: "Header", meaning: "Encabezado", example: "Request header" },
      { word: "Status", meaning: "Estado", example: "Status code" },
    ],
    business: [
      { word: "Regards", meaning: "Saludos", example: "Best regards" },
      {
        word: "Sincerely",
        meaning: "Sinceramente",
        example: "Sincerely yours",
      },
      {
        word: "Cordially",
        meaning: "Cordialmente",
        example: "Cordially invited",
      },
    ],
    phrases: [
      {
        word: "I'm writing to inform you",
        meaning: "Le escribo para informarle",
      },
      { word: "Please find attached", meaning: "Adjunto encontrará" },
      { word: "Looking forward to hearing", meaning: "Espero su respuesta" },
    ],
  },
  d10: {
    programming: [
      {
        word: "Refactor",
        meaning: "Refactorizar",
        example: "Refactor the code",
      },
      {
        word: "Optimize",
        meaning: "Optimizar",
        example: "Optimize performance",
      },
      { word: "Document", meaning: "Documentar", example: "Document the API" },
      { word: "Review", meaning: "Revisar", example: "Code review" },
      {
        word: "Implement",
        meaning: "Implementar",
        example: "Implement feature",
      },
      { word: "Integrate", meaning: "Integrar", example: "Integrate services" },
    ],
    business: [
      {
        word: "Feedback",
        meaning: "Retroalimentación",
        example: "Give feedback",
      },
      {
        word: "Stakeholder",
        meaning: "Interesado/Parte",
        example: "Key stakeholder",
      },
      {
        word: "Deliverable",
        meaning: "Entregable",
        example: "Final deliverable",
      },
    ],
    phrases: [
      { word: "Let me explain", meaning: "Déjame explicar" },
      { word: "That makes sense", meaning: "Eso tiene sentido" },
      { word: "I'll follow up", meaning: "Haré seguimiento" },
    ],
  },
  d11: {
    programming: [
      {
        word: "Has worked",
        meaning: "Ha trabajado",
        example: "He has worked on this",
      },
      {
        word: "Have implemented",
        meaning: "He implementado",
        example: "I have implemented the feature",
      },
      {
        word: "Has been deployed",
        meaning: "Ha sido desplegado",
        example: "The app has been deployed",
      },
      {
        word: "Have learned",
        meaning: "He aprendido",
        example: "I have learned a lot",
      },
      {
        word: "Has crashed",
        meaning: "Se ha caído",
        example: "The server has crashed",
      },
      {
        word: "Have experienced",
        meaning: "He experimentado",
        example: "I have experienced this issue",
      },
    ],
    business: [
      { word: "Since", meaning: "Desde", example: "Since 2020" },
      {
        word: "For (duration)",
        meaning: "Por/Durante",
        example: "For 3 years",
      },
      { word: "Yet", meaning: "Todavía/Aún", example: "Not finished yet" },
    ],
    phrases: [
      {
        word: "I have worked here since 2020",
        meaning: "He trabajado aquí desde 2020",
      },
      {
        word: "Have you ever used React?",
        meaning: "¿Has usado React alguna vez?",
      },
      { word: "I haven't finished yet", meaning: "No he terminado todavía" },
    ],
  },
  d12: {
    programming: [
      { word: "Set up", meaning: "Configurar", example: "Set up the server" },
      {
        word: "Figure out",
        meaning: "Resolver/Descubrir",
        example: "Figure out the bug",
      },
      {
        word: "Look into",
        meaning: "Investigar",
        example: "Look into the issue",
      },
      {
        word: "Break down",
        meaning: "Descomponer/Analizar",
        example: "Break down the problem",
      },
      {
        word: "Run into",
        meaning: "Encontrarse con",
        example: "Run into errors",
      },
      {
        word: "Come up with",
        meaning: "Idear",
        example: "Come up with a solution",
      },
    ],
    business: [
      {
        word: "Follow up",
        meaning: "Dar seguimiento",
        example: "I'll follow up",
      },
      { word: "Put off", meaning: "Posponer", example: "Put off the meeting" },
      {
        word: "Carry out",
        meaning: "Llevar a cabo",
        example: "Carry out the plan",
      },
    ],
    phrases: [
      {
        word: "Let me set up the environment",
        meaning: "Déjame configurar el entorno",
      },
      { word: "I'll look into it", meaning: "Lo investigaré" },
      {
        word: "We ran into some issues",
        meaning: "Nos encontramos con algunos problemas",
      },
    ],
  },
  d13: {
    programming: [
      {
        word: "Sprint",
        meaning: "Sprint/Iteración",
        example: "Current sprint",
      },
      { word: "Standup", meaning: "Reunión diaria", example: "Daily standup" },
      { word: "Blocker", meaning: "Impedimento", example: "Any blockers?" },
      {
        word: "Backlog",
        meaning: "Lista de pendientes",
        example: "Product backlog",
      },
      { word: "Milestone", meaning: "Hito", example: "Project milestone" },
      { word: "Demo", meaning: "Demostración", example: "Sprint demo" },
    ],
    business: [
      {
        word: "Agenda",
        meaning: "Agenda/Orden del día",
        example: "Meeting agenda",
      },
      { word: "Minutes", meaning: "Actas/Notas", example: "Meeting minutes" },
      {
        word: "Attendees",
        meaning: "Asistentes",
        example: "List of attendees",
      },
    ],
    phrases: [
      { word: "Let's get started", meaning: "Empecemos" },
      {
        word: "Any questions so far?",
        meaning: "¿Alguna pregunta hasta ahora?",
      },
      { word: "To sum up", meaning: "Para resumir" },
    ],
  },
  d14: {
    programming: [
      { word: "Faster", meaning: "Más rápido", example: "Faster algorithm" },
      { word: "Better", meaning: "Mejor", example: "Better solution" },
      {
        word: "More efficient",
        meaning: "Más eficiente",
        example: "More efficient code",
      },
      {
        word: "Less complex",
        meaning: "Menos complejo",
        example: "Less complex design",
      },
      { word: "The best", meaning: "El mejor", example: "The best practice" },
      { word: "The most", meaning: "El más", example: "The most important" },
    ],
    business: [
      { word: "Higher", meaning: "Más alto", example: "Higher priority" },
      { word: "Lower", meaning: "Más bajo", example: "Lower cost" },
      { word: "Easier", meaning: "Más fácil", example: "Easier to use" },
    ],
    phrases: [
      {
        word: "This is faster than before",
        meaning: "Esto es más rápido que antes",
      },
      { word: "The best solution is...", meaning: "La mejor solución es..." },
      {
        word: "As important as security",
        meaning: "Tan importante como la seguridad",
      },
    ],
  },
  d15: {
    programming: [
      {
        word: "Will have completed",
        meaning: "Habré completado",
        example: "I will have completed it",
      },
      {
        word: "Should have tested",
        meaning: "Debería haber probado",
        example: "You should have tested",
      },
      {
        word: "Could have fixed",
        meaning: "Podría haber arreglado",
        example: "I could have fixed it",
      },
      {
        word: "Would have worked",
        meaning: "Habría funcionado",
        example: "It would have worked",
      },
      {
        word: "Must have been",
        meaning: "Debe haber sido",
        example: "It must have been a bug",
      },
      {
        word: "Might have caused",
        meaning: "Podría haber causado",
        example: "This might have caused the error",
      },
    ],
    business: [
      {
        word: "By then",
        meaning: "Para entonces",
        example: "By then we'll finish",
      },
      {
        word: "Eventually",
        meaning: "Eventualmente",
        example: "Eventually it worked",
      },
      {
        word: "Meanwhile",
        meaning: "Mientras tanto",
        example: "Meanwhile, let's continue",
      },
    ],
    phrases: [
      {
        word: "By Friday, I will have finished",
        meaning: "Para el viernes, habré terminado",
      },
      {
        word: "I should have checked first",
        meaning: "Debería haber revisado primero",
      },
      { word: "I wish I had more time", meaning: "Desearía tener más tiempo" },
    ],
  },
};

// Preguntas para tests rápidos de vocabulario por día
const vocabTestQuestions = {
  d1: [
    {
      q: "¿Qué significa 'Bug'?",
      options: ["Función", "Error en código", "Variable"],
      correct: 1,
    },
    {
      q: "¿Cómo se dice 'función' en inglés?",
      options: ["Variable", "Code", "Function"],
      correct: 2,
    },
    {
      q: "'Algorithm' significa:",
      options: ["Algoritmo", "Base de datos", "Sintaxis"],
      correct: 0,
    },
    {
      q: "¿Qué es 'Syntax'?",
      options: ["Error", "Sintaxis", "Bucle"],
      correct: 1,
    },
  ],
  d2: [
    {
      q: "¿Qué es un 'Repository'?",
      options: ["Repositorio de código", "Variable", "Función"],
      correct: 0,
    },
    {
      q: "'Array' significa:",
      options: ["Texto", "Arreglo/Lista", "Número"],
      correct: 1,
    },
    {
      q: "¿Qué es 'Boolean'?",
      options: ["Decimal", "Texto", "Verdadero/Falso"],
      correct: 2,
    },
    {
      q: "'Deadline' significa:",
      options: ["Inicio", "Fecha límite", "Pausa"],
      correct: 1,
    },
  ],
  d3: [
    {
      q: "¿Qué es un 'Loop'?",
      options: ["Objeto", "Bucle/Ciclo", "Clase"],
      correct: 1,
    },
    {
      q: "'Method' significa:",
      options: ["Propiedad", "Método", "Instancia"],
      correct: 1,
    },
    {
      q: "¿Qué es 'Class'?",
      options: ["Función", "Objeto", "Clase"],
      correct: 2,
    },
    {
      q: "'Instance' significa:",
      options: ["Instancia", "Método", "Ciclo"],
      correct: 0,
    },
  ],
  d4: [
    {
      q: "¿Qué significa 'Compiled'?",
      options: ["Ejecutado", "Compilado", "Probado"],
      correct: 1,
    },
    {
      q: "'Merged' significa:",
      options: ["Separado", "Fusionado", "Eliminado"],
      correct: 1,
    },
    {
      q: "¿Qué es 'Debugged'?",
      options: ["Con errores", "Depurado", "Compilado"],
      correct: 1,
    },
    {
      q: "'Committed' significa:",
      options: ["Borrado", "Commiteado", "Pausado"],
      correct: 1,
    },
  ],
  d5: [
    {
      q: "Pasado de 'write' es:",
      options: ["Writed", "Wrote", "Written"],
      correct: 1,
    },
    {
      q: "'Built' es pasado de:",
      options: ["Buy", "Build", "Bite"],
      correct: 1,
    },
    {
      q: "¿Qué significa 'Ran'?",
      options: ["Corrió/Ejecutó", "Escribió", "Leyó"],
      correct: 0,
    },
    {
      q: "'Found' es pasado de:",
      options: ["Fund", "Find", "Fond"],
      correct: 1,
    },
  ],
  d6: [
    {
      q: "Present Perfect se forma con:",
      options: ["Did + verbo", "Have/Has + participio", "Will + verbo"],
      correct: 1,
    },
    {
      q: "'I have worked' significa:",
      options: ["Trabajé", "He trabajado", "Trabajaré"],
      correct: 1,
    },
    {
      q: "'Ever' se usa para:",
      options: ["Negaciones", "Preguntas sobre experiencias", "Futuro"],
      correct: 1,
    },
    {
      q: "'Since 2020' indica:",
      options: ["Duración", "Punto de inicio", "Final"],
      correct: 1,
    },
  ],
  d7: [
    {
      q: "'Set up' significa:",
      options: ["Destruir", "Configurar", "Eliminar"],
      correct: 1,
    },
    {
      q: "'Figure out' significa:",
      options: ["Olvidar", "Descubrir/Resolver", "Ignorar"],
      correct: 1,
    },
    {
      q: "'Look into' significa:",
      options: ["Mirar arriba", "Investigar", "Cerrar"],
      correct: 1,
    },
    {
      q: "'Run into' significa:",
      options: ["Correr", "Encontrarse con (problema)", "Escapar"],
      correct: 1,
    },
  ],
  d8: [
    {
      q: "'Standup' en desarrollo ágil es:",
      options: ["Pararse", "Reunión diaria corta", "Descanso"],
      correct: 1,
    },
    {
      q: "'Blocker' significa:",
      options: ["Ayuda", "Impedimento", "Reunión"],
      correct: 1,
    },
    {
      q: "'Let's get started' significa:",
      options: ["Terminemos", "Empecemos", "Esperemos"],
      correct: 1,
    },
    {
      q: "'To sum up' significa:",
      options: ["Para empezar", "Para resumir", "Para agregar"],
      correct: 1,
    },
  ],
  d9: [
    {
      q: "Comparativo de 'fast' es:",
      options: ["More fast", "Faster", "Most fast"],
      correct: 1,
    },
    {
      q: "'The best' es forma:",
      options: ["Comparativa", "Superlativa", "Base"],
      correct: 1,
    },
    {
      q: "'As...as' expresa:",
      options: ["Diferencia", "Igualdad", "Superioridad"],
      correct: 1,
    },
    {
      q: "'More efficient' es comparativo de:",
      options: ["Efficient", "Efficiency", "Efficients"],
      correct: 0,
    },
  ],
  d10: [
    {
      q: "'Will' se usa para:",
      options: ["Planes previos", "Decisiones espontáneas", "Pasado"],
      correct: 1,
    },
    {
      q: "'Going to' se usa para:",
      options: ["Decisiones del momento", "Planes ya decididos", "Pasado"],
      correct: 1,
    },
    {
      q: "'I will deploy now!' expresa:",
      options: ["Plan previo", "Decisión espontánea", "Promesa"],
      correct: 1,
    },
    {
      q: "'I'm going to' en conversación suena como:",
      options: ["I am going to", "Gonna", "Will"],
      correct: 1,
    },
  ],
  d11: [
    {
      q: "Primer condicional usa:",
      options: ["If + pasado", "If + presente, will + verbo", "If + futuro"],
      correct: 1,
    },
    {
      q: "Segundo condicional es para:",
      options: ["Situaciones reales", "Situaciones hipotéticas", "Pasado"],
      correct: 1,
    },
    {
      q: "'Unless' significa:",
      options: ["Siempre que", "A menos que", "Cuando"],
      correct: 1,
    },
    {
      q: "'Would' se usa con:",
      options: ["Primer condicional", "Segundo condicional", "Futuro simple"],
      correct: 1,
    },
  ],
  d12: [
    {
      q: "'Tell me about yourself' es:",
      options: ["Cierre", "Pregunta común de entrevista", "Saludo"],
      correct: 1,
    },
    {
      q: "'I was responsible for' significa:",
      options: ["Quiero ser", "Era responsable de", "Seré responsable"],
      correct: 1,
    },
    {
      q: "'Strength' significa:",
      options: ["Debilidad", "Fortaleza", "Desafío"],
      correct: 1,
    },
    {
      q: "Para describir logros, usamos:",
      options: ["Presente simple", "Pasado simple", "Futuro"],
      correct: 1,
    },
  ],
  d13: [
    {
      q: "Inicio formal de email:",
      options: ["Hey!", "Dear Mr./Ms.", "What's up?"],
      correct: 1,
    },
    {
      q: "'Best regards' es:",
      options: ["Saludo inicial", "Cierre formal", "Asunto"],
      correct: 1,
    },
    {
      q: "'I'm writing to' introduce:",
      options: ["El cierre", "El propósito del email", "Un saludo"],
      correct: 1,
    },
    {
      q: "'Please find attached' se usa para:",
      options: ["Pedir algo", "Indicar adjuntos", "Despedirse"],
      correct: 1,
    },
  ],
  d14: [
    {
      q: "'Today I'm going to show you' es para:",
      options: ["Cerrar presentación", "Abrir presentación", "Preguntas"],
      correct: 1,
    },
    {
      q: "'Walk you through' significa:",
      options: ["Caminar contigo", "Guiarte paso a paso", "Terminar"],
      correct: 1,
    },
    {
      q: "'Are there any questions?' se dice:",
      options: ["Al inicio", "Al final", "Durante la demo"],
      correct: 1,
    },
    {
      q: "'As you can see' se usa para:",
      options: ["Cerrar", "Señalar algo visible", "Preguntar"],
      correct: 1,
    },
  ],
  d15: [
    {
      q: "Future Perfect se forma con:",
      options: ["Will + verbo", "Will have + participio", "Have + verbo"],
      correct: 1,
    },
    {
      q: "'Should have done' expresa:",
      options: ["Obligación futura", "Arrepentimiento pasado", "Permiso"],
      correct: 1,
    },
    {
      q: "'I wish I had' expresa:",
      options: ["Certeza", "Deseo irreal", "Promesa"],
      correct: 1,
    },
    {
      q: "'Has been reviewed' es:",
      options: ["Activa", "Pasiva perfecta", "Futuro"],
      correct: 1,
    },
  ],
};

// Función para obtener vocabulario acumulado hasta un día
function getVocabUpToDay(dayNum, category) {
  let vocab = [];
  for (let i = 1; i <= dayNum; i++) {
    const dayKey = `d${i}`;
    if (vocabByDay[dayKey] && vocabByDay[dayKey][category]) {
      vocab = vocab.concat(vocabByDay[dayKey][category]);
    }
  }
  return vocab;
}

let currentVocabDayFilter = "all";

// --- PRÁCTICA ORAL POR DÍA ---
const practiceSentencesByDay = {
  d1: [
    { en: "I code every day.", tip: "Enfatiza 'code' y 'day'." },
    { en: "She writes clean code.", tip: "La 'S' en 'writes' es importante." },
    {
      en: "The program runs fast.",
      tip: "Conecta 'runs' con 'fast' fluidamente.",
    },
  ],
  d2: [
    {
      en: "Do you understand the logic?",
      tip: "Sube la entonación al final (pregunta).",
    },
    {
      en: "Does the function return a value?",
      tip: "'Does' inicia las preguntas en tercera persona.",
    },
    { en: "Where do you work?", tip: "Énfasis en 'where' y 'work'." },
  ],
  d3: [
    { en: "The laptop is on the desk.", tip: "Pronuncia 'on' claramente." },
    {
      en: "There is a bug in the code.",
      tip: "'There is' se dice casi como 'Theris'.",
    },
    { en: "The file is in the folder.", tip: "'In' indica dentro de algo." },
  ],
  d4: [
    {
      en: "I worked on the project yesterday.",
      tip: "'Worked' suena como 'Workt' (una sílaba).",
    },
    { en: "We fixed the bug.", tip: "'Fixed' suena como 'Fixt'." },
    { en: "She played the demo.", tip: "'Played' suena como 'Playd' (suave)." },
  ],
  d5: [
    {
      en: "I went to the office yesterday.",
      tip: "'Went' es el pasado de 'go'.",
    },
    {
      en: "She wrote the documentation.",
      tip: "'Wrote' es pasado de 'write'.",
    },
    { en: "We made significant progress.", tip: "'Made' es pasado de 'make'." },
  ],
  d6: [
    {
      en: "I have worked here for three years.",
      tip: "Present Perfect con 'for' = duración.",
    },
    {
      en: "Have you ever used React Native?",
      tip: "'Ever' va entre have y el participio.",
    },
    {
      en: "She has never deployed to production alone.",
      tip: "'Never' también entre have/has y participio.",
    },
  ],
  d7: [
    {
      en: "Let me set up the development environment.",
      tip: "'Set up' = phrasal verb muy común en tech.",
    },
    {
      en: "I need to figure out why this is failing.",
      tip: "'Figure out' = resolver/entender algo.",
    },
    {
      en: "We ran into some unexpected issues.",
      tip: "'Ran into' = encontrarse con problemas.",
    },
  ],
  d8: [
    {
      en: "Let's get started with today's standup.",
      tip: "Frase típica para iniciar reuniones.",
    },
    {
      en: "Could you elaborate on the technical requirements?",
      tip: "Petición formal para más detalles.",
    },
    {
      en: "To sum up, we need to fix the API first.",
      tip: "'To sum up' = para resumir.",
    },
  ],
  d9: [
    {
      en: "This solution is faster than the previous one.",
      tip: "Comparativo: adjetivo corto + ER + than.",
    },
    {
      en: "React is more popular than Vue in the US.",
      tip: "Comparativo: MORE + adjetivo largo + than.",
    },
    {
      en: "This is the best approach for our use case.",
      tip: "Superlativo: THE + adjetivo-EST / THE MOST.",
    },
  ],
  d10: [
    {
      en: "I will fix it right now!",
      tip: "'Will' para decisiones espontáneas.",
    },
    {
      en: "I'm going to deploy tomorrow.",
      tip: "'Going to' para planes previos.",
    },
    { en: "We will launch next week.", tip: "Énfasis en 'will' y 'launch'." },
  ],
  d11: [
    {
      en: "If the test passes, I will merge the code.",
      tip: "Pausa breve después de 'passes'.",
    },
    {
      en: "If I had more time, I would refactor.",
      tip: "Segundo condicional (hipotético).",
    },
    {
      en: "Unless there's a bug, we ship today.",
      tip: "'Unless' = 'a menos que'.",
    },
  ],
  d12: [
    {
      en: "I'm currently working on a mobile application.",
      tip: "Enfatiza 'currently' y 'application'.",
    },
    {
      en: "I have three years of experience in React.",
      tip: "Di 'three years of experience' fluidamente.",
    },
    { en: "Tell me about yourself.", tip: "Frase común de entrevistas." },
  ],
  d13: [
    {
      en: "I hope this email finds you well.",
      tip: "Frase formal de apertura.",
    },
    {
      en: "Please let me know if you have any questions.",
      tip: "Cierre profesional común.",
    },
    {
      en: "I'm writing to request an update.",
      tip: "Estructura de propósito del email.",
    },
  ],
  d14: [
    {
      en: "Today I'm going to show you our new feature.",
      tip: "Apertura estándar de presentación.",
    },
    {
      en: "Let me walk you through the demo.",
      tip: "'Walk through' = guiar paso a paso.",
    },
    {
      en: "Are there any questions?",
      tip: "Invitar preguntas al final de presentación.",
    },
  ],
  d15: [
    {
      en: "By next Friday, I will have completed the feature.",
      tip: "Future Perfect: will have + participio.",
    },
    {
      en: "I should have tested the code before pushing.",
      tip: "Modal perfecto: arrepentimiento.",
    },
    {
      en: "I wish I had learned English earlier.",
      tip: "'Wish + past' para deseos irreales.",
    },
  ],
};

// Función para obtener frases de práctica acumuladas
function getPracticeUpToDay(dayNum) {
  let sentences = [];
  for (let i = 1; i <= dayNum; i++) {
    const dayKey = `d${i}`;
    if (practiceSentencesByDay[dayKey]) {
      sentences = sentences.concat(
        practiceSentencesByDay[dayKey].map((s) => ({ ...s, day: i }))
      );
    }
  }
  return sentences;
}

let currentPracticeDayFilter = "all";

// --- ESTADO GLOBAL ---
let currentCardIndex = 0;
let knownCards = 0;
let pomoTimer = null;
let pomoSeconds = 25 * 60;
let pomoRunning = false;

// Fechas de inicio del bootcamp (11 de diciembre de 2025)
const BOOTCAMP_START_DATE = new Date(2025, 11, 11); // Mes es 0-indexed

// Mapeo de días del bootcamp a fechas reales
const dayToDateMap = {
  d1: new Date(2025, 11, 11), // Jueves 11 Dic
  d2: new Date(2025, 11, 12), // Viernes 12 Dic
  d3: new Date(2025, 11, 13), // Sábado 13 Dic
  d4: new Date(2025, 11, 15), // Lunes 15 Dic
  d5: new Date(2025, 11, 16), // Martes 16 Dic
  d6: new Date(2025, 11, 17), // Miércoles 17 Dic - Present Perfect
  d7: new Date(2025, 11, 18), // Jueves 18 Dic - Phrasal Verbs
  d8: new Date(2025, 11, 19), // Viernes 19 Dic - Tech Meetings
  d9: new Date(2025, 11, 20), // Sábado 20 Dic - Comparatives
  d10: new Date(2025, 11, 22), // Lunes 22 Dic - Future Perfect
  d11: new Date(2025, 11, 23), // Martes 23 Dic - Condicionales
  d12: new Date(2025, 11, 27), // Sábado 27 Dic - Entrevistas Avanzadas
  d13: new Date(2025, 11, 29), // Lunes 29 Dic - Emails Profesionales
  d14: new Date(2025, 11, 30), // Martes 30 Dic - Presentaciones
  d15: new Date(2026, 0, 4), // Sábado 4 Ene - Repaso Final
};

// Función para obtener el día actual del bootcamp basado en la fecha
function getCurrentBootcampDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDay = 0;
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    const dayDate = dayToDateMap[`d${i}`];
    if (dayDate && today >= dayDate) {
      currentDay = i;
    }
  }
  return currentDay;
}

// Función para marcar días perdidos (no completados cuando ya pasó la fecha)
function checkMissedDays() {
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= TOTAL_DAYS; i++) {
    const dayKey = `d${i}`;
    const dayDate = dayToDateMap[dayKey];

    if (dayDate && today > dayDate) {
      // La fecha de este día ya pasó
      if (!savedData[dayKey] || !savedData[dayKey].completed) {
        // No fue completado - marcarlo como perdido
        markDayAsMissed(dayKey);
      }
    }
  }
}

// Función para marcar un día como perdido (no completado)
function markDayAsMissed(dayId) {
  const card = document.getElementById(`card-${dayId}`);
  if (card && !card.classList.contains("completed")) {
    card.classList.add("missed");
  }
}

// Función para obtener el día actual seleccionable para flashcards/vocab/practice
function getMaxAvailableDay() {
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  const currentDay = getCurrentBootcampDay();

  // El máximo día disponible es el día actual del bootcamp
  return Math.max(1, currentDay);
}

// --- 2. SISTEMA DE GUARDADO MEJORADO ---
document.addEventListener("DOMContentLoaded", function () {
  loadProgress();
  loadStreak();
  loadQuizAttempts();
  checkMissedDays();
  initializeFilters();
  renderVocabulary();
  renderPracticeSentences();
  updateFlashcardData();
  updateFlashcard();
  updateStats();
});

// Inicializar filtros basados en el día actual
function initializeFilters() {
  const maxDay = getMaxAvailableDay();

  // Crear opciones de filtro para cada sección
  createDayFilterOptions("flashcard-day-filter", maxDay);
  createDayFilterOptions("vocab-day-filter", maxDay);
  createDayFilterOptions("practice-day-filter", maxDay);
}

// Crear las opciones del selector de días
function createDayFilterOptions(selectId, maxDay) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="all">📚 Todos (Acumulado)</option>';

  for (let i = 1; i <= maxDay; i++) {
    const option = document.createElement("option");
    option.value = `d${i}`;
    option.textContent = `📅 Día ${i}`;
    select.appendChild(option);
  }
}

// Actualizar flashcards según el filtro
function updateFlashcardData() {
  const filter = currentFlashcardDayFilter;
  const maxDay = getMaxAvailableDay();

  if (filter === "all") {
    currentFlashcardsData = getFlashcardsUpToDay(maxDay);
  } else {
    const dayNum = parseInt(filter.replace("d", ""));
    currentFlashcardsData = flashcardsDataByDay[filter] || [];
  }

  currentCardIndex = 0;
  updateFlashcardCounter();
}

function updateFlashcardCounter() {
  document.getElementById("fc-total").textContent =
    currentFlashcardsData.length;
}

// Manejadores de filtro
function onFlashcardFilterChange(value) {
  currentFlashcardDayFilter = value;
  updateFlashcardData();
  updateFlashcard();
}

function onVocabFilterChange(value) {
  currentVocabDayFilter = value;
  renderVocabulary();
}

function onPracticeFilterChange(value) {
  currentPracticeDayFilter = value;
  renderPracticeSentences();
}

function loadProgress() {
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  for (const [dayId, data] of Object.entries(savedData)) {
    if (data.completed) {
      markDayAsCompleted(dayId, data);
    }
  }
  updateGlobalProgress();
}

function loadStreak() {
  const streakData = JSON.parse(localStorage.getItem("englishStreak")) || {
    count: 0,
    lastDate: null,
  };
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (streakData.lastDate === today) {
    // Ya estudió hoy
  } else if (streakData.lastDate === yesterday) {
    // Continúa racha
  } else if (streakData.lastDate !== today) {
    // Racha rota o primera vez
    if (streakData.lastDate && streakData.lastDate !== yesterday) {
      streakData.count = 0;
    }
  }

  document.getElementById("streak-display").textContent = streakData.count;

  // XP
  const xp = JSON.parse(localStorage.getItem("englishXP")) || 0;
  document.getElementById("xp-display").textContent = xp;
}

function updateStreak() {
  const streakData = JSON.parse(localStorage.getItem("englishStreak")) || {
    count: 0,
    lastDate: null,
  };
  const today = new Date().toDateString();

  if (streakData.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (streakData.lastDate === yesterday || !streakData.lastDate) {
      streakData.count++;
    } else {
      streakData.count = 1;
    }
    streakData.lastDate = today;
    localStorage.setItem("englishStreak", JSON.stringify(streakData));
  }

  document.getElementById("streak-display").textContent = streakData.count;
}

function addXP(amount) {
  let xp = JSON.parse(localStorage.getItem("englishXP")) || 0;
  xp += amount;
  localStorage.setItem("englishXP", JSON.stringify(xp));
  document.getElementById("xp-display").textContent = xp;
}

function saveDayProgress(dayId, score, topicsToImprove) {
  const currentData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  currentData[dayId] = {
    completed: true,
    score: score,
    topics: topicsToImprove,
    date: new Date().toLocaleDateString(),
  };
  localStorage.setItem("englishBootcampProgress", JSON.stringify(currentData));
  markDayAsCompleted(dayId, currentData[dayId]);
  updateGlobalProgress();
  updateStreak();
  addXP(score >= 80 ? 100 : 50);
  updateStats();
}

function markDayAsCompleted(dayId, data) {
  const card = document.getElementById(`card-${dayId}`);
  if (card) card.classList.add("completed");

  const summaryBox = document.getElementById(`summary-${dayId}`);
  if (summaryBox) {
    summaryBox.style.display = "block";
    let improvementHtml = "";
    if (data.topics && data.topics.length > 0) {
      const uniqueTopics = [...new Set(data.topics)];
      improvementHtml = `<p style="margin-bottom:5px;"><strong>⚠️ Aspectos a reforzar:</strong></p>
              <ul class="feedback-list">${uniqueTopics
                .map((t) => `<li class="feedback-item">Repasar: ${t}</li>`)
                .join("")}</ul>`;
    } else {
      improvementHtml = `<p style="color:#166534">¡Excelente trabajo! No hay áreas críticas que reforzar.</p>`;
    }
    summaryBox.innerHTML = `
            <div class="result-header">📊 Resumen del Día (${data.date})</div>
            <div class="score-display">Nota: ${data.score}%</div>
            ${improvementHtml}
            <div class="status-saved">Progreso guardado en este dispositivo</div>
          `;
  }
}

function updateStats() {
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  let completed = 0;
  let totalScore = 0;
  let scoreCount = 0;

  for (let i = 1; i <= TOTAL_DAYS; i++) {
    if (savedData[`d${i}`] && savedData[`d${i}`].completed) {
      completed++;
      totalScore += savedData[`d${i}`].score;
      scoreCount++;
    }
  }

  document.getElementById(
    "stat-days"
  ).textContent = `${completed}/${TOTAL_DAYS}`;
  document.getElementById("stat-accuracy").textContent =
    scoreCount > 0 ? `${Math.round(totalScore / scoreCount)}%` : "0%";
  document.getElementById("stat-cards").textContent = knownCards;

  const studyTime = JSON.parse(localStorage.getItem("englishStudyTime")) || 0;
  document.getElementById("stat-time").textContent = `${Math.round(
    studyTime / 60
  )}h`;

  checkWeekUnlocks();
}

// --- 3. LÓGICA DE INTERFAZ ---
function toggleDay(id) {
  // Check if parent week is locked
  const dayCard = document.getElementById(`card-${id}`);
  if (dayCard) {
    const weekSection = dayCard.closest(".week-section");
    if (weekSection && weekSection.classList.contains("locked")) {
      alert(
        "🔒 Esta semana está bloqueada. Completa la semana anterior o aprueba el examen de validación."
      );
      return;
    }
  }

  const body = document.getElementById(id);
  const icon = body.previousElementSibling.querySelector(".toggle-icon");

  document.querySelectorAll(".day-body").forEach((el) => {
    if (el.id !== id) {
      el.classList.remove("open");
      el.previousElementSibling.querySelector(".toggle-icon").innerText = "+";
    }
  });

  if (body.classList.contains("open")) {
    body.classList.remove("open");
    icon.innerText = "+";
  } else {
    body.classList.add("open");
    icon.innerText = "−";
  }
}

function showTab(tabName) {
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".nav-tab")
    .forEach((btn) => btn.classList.remove("active"));

  document.getElementById(`tab-${tabName}`).classList.add("active");
  event.target.classList.add("active");
}

// --- 4. MOTOR DE QUIZ CON SISTEMA DE INTENTOS ---
let currentQuizState = {
  dayId: null,
  totalQuestions: 0,
  correctAnswers: 0,
  topicsMissed: [],
  questionsAnswered: 0,
};

// Cargar intentos guardados
function loadQuizAttempts() {
  const saved = JSON.parse(localStorage.getItem("quizAttempts")) || {};
  Object.assign(quizAttempts, saved);
  const savedWeekly =
    JSON.parse(localStorage.getItem("weeklyExamAttempts")) || {};
  Object.assign(weeklyExamAttempts, savedWeekly);
}

function saveQuizAttempts() {
  localStorage.setItem("quizAttempts", JSON.stringify(quizAttempts));
  localStorage.setItem(
    "weeklyExamAttempts",
    JSON.stringify(weeklyExamAttempts)
  );
}

function getQuizAttempts(dayId) {
  if (!quizAttempts[dayId]) {
    quizAttempts[dayId] = { attempts: 0, maxAttempts: 3, scores: [] };
  }
  return quizAttempts[dayId];
}

function canTakeQuiz(dayId) {
  const attempts = getQuizAttempts(dayId);
  return attempts.attempts < attempts.maxAttempts;
}

function startQuiz(dayId) {
  const attempts = getQuizAttempts(dayId);

  // Verificar si puede tomar el quiz
  if (!canTakeQuiz(dayId)) {
    const container = document.getElementById(`quiz-${dayId}`);
    container.innerHTML = `
      <div style="text-align:center; padding:20px; background:#fef2f2; border-radius:12px; border:1px solid #fecaca;">
        <p style="font-size:1.2rem; color:#991b1b; margin-bottom:10px;">⚠️ Has agotado los 3 intentos para este test</p>
        <p style="color:#7f1d1d;">Tu mejor puntuación: <strong>${Math.max(
          ...attempts.scores
        )}%</strong></p>
        <p style="color:var(--text-light); font-size:0.9rem; margin-top:10px;">Revisa el material y practica con las flashcards.</p>
      </div>
    `;
    container.classList.add("active");
    return;
  }

  const container = document.getElementById(`quiz-${dayId}`);
  container.innerHTML = "";
  container.classList.add("active");

  // Mostrar intentos restantes
  const attemptsInfo = document.createElement("div");
  attemptsInfo.className = "attempts-info";
  attemptsInfo.innerHTML = `
    <span class="attempts-badge">Intento ${attempts.attempts + 1} de ${
    attempts.maxAttempts
  }</span>
    ${
      attempts.scores.length > 0
        ? `<span class="best-score">Mejor: ${Math.max(
            ...attempts.scores
          )}%</span>`
        : ""
    }
  `;
  container.appendChild(attemptsInfo);

  currentQuizState = {
    dayId: dayId,
    totalQuestions: 0,
    correctAnswers: 0,
    topicsMissed: [],
    questionsAnswered: 0,
  };

  const qList = questions[dayId] || [];
  // Usar todas las preguntas, pero en orden aleatorio
  const randomQ = [...qList].sort(() => 0.5 - Math.random());
  currentQuizState.totalQuestions = randomQ.length;

  randomQ.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "quiz-question";

    const p = document.createElement("p");
    p.innerText = `${index + 1}. ${item.q}`;
    div.appendChild(p);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "quiz-options";

    item.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.innerText = opt;

      btn.onclick = function () {
        const allBtns = optionsDiv.querySelectorAll("button");
        allBtns.forEach((b) => {
          b.disabled = true;
          b.style.cursor = "default";
        });

        currentQuizState.questionsAnswered++;

        if (idx === item.correct) {
          btn.classList.add("correct");
          btn.innerHTML += ` ✅ <br><small>${item.feedback}</small>`;
          currentQuizState.correctAnswers++;
        } else {
          btn.classList.add("incorrect");
          allBtns[item.correct].classList.add("correct");
          btn.innerHTML += ` ❌`;
          currentQuizState.topicsMissed.push(item.topic);
        }

        if (
          currentQuizState.questionsAnswered === currentQuizState.totalQuestions
        ) {
          finishQuiz();
        }
      };
      optionsDiv.appendChild(btn);
    });
    div.appendChild(optionsDiv);
    container.appendChild(div);
  });
}

function finishQuiz() {
  const score = Math.round(
    (currentQuizState.correctAnswers / currentQuizState.totalQuestions) * 100
  );

  // Registrar el intento
  const attempts = getQuizAttempts(currentQuizState.dayId);
  attempts.attempts++;
  attempts.scores.push(score);
  saveQuizAttempts();

  // Solo guardar progreso si aprobó (70%+) o es el mejor intento
  const bestScore = Math.max(...attempts.scores);
  if (score >= 70 || score === bestScore) {
    saveDayProgress(
      currentQuizState.dayId,
      bestScore,
      currentQuizState.topicsMissed
    );
  }

  // Mostrar resultado con opción de reintentar
  const container = document.getElementById(`quiz-${currentQuizState.dayId}`);
  const resultDiv = document.createElement("div");
  resultDiv.className = "quiz-result";
  resultDiv.innerHTML = `
    <div style="text-align:center; padding:20px; background:${
      score >= 70 ? "#f0fdf4" : "#fef2f2"
    }; border-radius:12px; margin-top:20px;">
      <p style="font-size:1.5rem; font-weight:bold; color:${
        score >= 70 ? "#166534" : "#991b1b"
      };">
        ${score >= 70 ? "🎉" : "📚"} Puntuación: ${score}%
      </p>
      <p style="color:var(--text-light);">Intentos usados: ${
        attempts.attempts
      }/${attempts.maxAttempts}</p>
      ${
        attempts.attempts < attempts.maxAttempts && score < 100
          ? `
        <button class="btn-action" onclick="startQuiz('${
          currentQuizState.dayId
        }')" style="margin-top:15px;">
          🔄 Intentar de nuevo (${
            attempts.maxAttempts - attempts.attempts
          } restantes)
        </button>
      `
          : ""
      }
    </div>
  `;
  container.appendChild(resultDiv);

  setTimeout(() => {
    const summaryBox = document.getElementById(
      `summary-${currentQuizState.dayId}`
    );
    if (summaryBox)
      summaryBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 500);
}

// --- EXÁMENES DE SEMANA ---
function startWeeklyExam(weekNum) {
  const weekKey = `week${weekNum}`;

  if (!weeklyExamAttempts[weekKey]) {
    weeklyExamAttempts[weekKey] = { attempts: 0, maxAttempts: 2, scores: [] };
  }

  const attempts = weeklyExamAttempts[weekKey];

  if (attempts.attempts >= attempts.maxAttempts) {
    alert(
      `Has agotado los 2 intentos para el examen de la Semana ${weekNum}.\nTu mejor puntuación: ${Math.max(
        ...attempts.scores
      )}%`
    );
    return;
  }

  // Crear modal de examen
  const modal = document.createElement("div");
  modal.className = "exam-modal";
  modal.id = `exam-modal-week${weekNum}`;

  const questions = weeklyExamQuestions[weekKey];
  // Seleccionar preguntas aleatorias diferentes cada intento
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));

  let currentQ = 0;
  let correctCount = 0;

  function renderQuestion() {
    const q = selectedQuestions[currentQ];
    modal.innerHTML = `
      <div class="exam-container">
        <div class="exam-header">
          <h2>📝 Examen Semana ${weekNum}</h2>
          <span class="exam-progress">Pregunta ${currentQ + 1} de ${
      selectedQuestions.length
    }</span>
          <span class="attempts-badge">Intento ${attempts.attempts + 1} de ${
      attempts.maxAttempts
    }</span>
        </div>
        <div class="exam-question">
          <p class="question-text">${q.q}</p>
          <div class="exam-options">
            ${q.options
              .map(
                (opt, idx) => `
              <button class="exam-option" onclick="selectWeeklyAnswer(${weekNum}, ${idx}, ${q.correct})">${opt}</button>
            `
              )
              .join("")}
          </div>
        </div>
        <button class="btn-action btn-outline" onclick="closeExamModal(${weekNum})" style="margin-top:20px;">❌ Cancelar</button>
      </div>
    `;
  }

  window.selectWeeklyAnswer = function (week, selected, correct) {
    if (selected === correct) correctCount++;
    currentQ++;

    if (currentQ >= selectedQuestions.length) {
      const score = Math.round((correctCount / selectedQuestions.length) * 100);
      attempts.attempts++;
      attempts.scores.push(score);
      saveQuizAttempts();

      modal.innerHTML = `
        <div class="exam-container">
          <div class="exam-result ${score >= 70 ? "passed" : "failed"}">
            <h2>${score >= 70 ? "🎉 ¡Aprobaste!" : "📚 Sigue practicando"}</h2>
            <p class="score-big">${score}%</p>
            <p>${correctCount} de ${selectedQuestions.length} correctas</p>
            <p style="margin-top:10px; color:var(--text-light);">Intentos: ${
              attempts.attempts
            }/${attempts.maxAttempts}</p>
            ${
              attempts.attempts < attempts.maxAttempts && score < 100
                ? `
              <button class="btn-action" onclick="closeExamModal(${week}); setTimeout(() => startWeeklyExam(${week}), 300);" style="margin-top:15px;">
                🔄 Intentar de nuevo
              </button>
            `
                : ""
            }
            <button class="btn-action btn-outline" onclick="closeExamModal(${week})" style="margin-top:10px;">Cerrar</button>
          </div>
        </div>
      `;

      if (score >= 70) {
        addXP(150);
      }
    } else {
      renderQuestion();
    }
  };

  window.closeExamModal = function (week) {
    const m = document.getElementById(`exam-modal-week${week}`);
    if (m) m.remove();
  };

  renderQuestion();
  document.body.appendChild(modal);
}

// --- EXAMEN DE SALTO DE SEMANA ---
function startSkipExam(targetWeek) {
  const examKey = `toWeek${targetWeek}`;
  const questions = skipExamQuestions[examKey];

  if (!questions || questions.length === 0) {
    alert("No hay examen disponible para este salto.");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "exam-modal";
  modal.id = `skip-exam-modal`;

  // Seleccionar 8 preguntas aleatorias
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(8, shuffled.length));

  let currentQ = 0;
  let correctCount = 0;

  function renderSkipQuestion() {
    const q = selectedQuestions[currentQ];
    modal.innerHTML = `
      <div class="exam-container skip-exam">
        <div class="exam-header">
          <h2>🚀 Examen de Validación - Saltar a Semana ${targetWeek}</h2>
          <span class="exam-progress">Pregunta ${currentQ + 1} de ${
      selectedQuestions.length
    }</span>
          <p style="color:var(--text-light); font-size:0.9rem;">Necesitas 80% para aprobar</p>
        </div>
        <div class="exam-question">
          <p class="question-text">${q.q}</p>
          <div class="exam-options">
            ${q.options
              .map(
                (opt, idx) => `
              <button class="exam-option" onclick="selectSkipAnswer(${targetWeek}, ${idx}, ${q.correct})">${opt}</button>
            `
              )
              .join("")}
          </div>
        </div>
        <button class="btn-action btn-outline" onclick="closeSkipExamModal()" style="margin-top:20px;">❌ Cancelar</button>
      </div>
    `;
  }

  window.selectSkipAnswer = function (week, selected, correct) {
    if (selected === correct) correctCount++;
    currentQ++;

    if (currentQ >= selectedQuestions.length) {
      const score = Math.round((correctCount / selectedQuestions.length) * 100);
      const passed = score >= 70;

      skipExamResults[`toWeek${week}`] = { passed, score };
      localStorage.setItem("skipExamResults", JSON.stringify(skipExamResults));

      modal.innerHTML = `
        <div class="exam-container">
          <div class="exam-result ${passed ? "passed" : "failed"}">
            <h2>${passed ? "🎉 ¡Validación Exitosa!" : "📚 No aprobaste"}</h2>
            <p class="score-big">${score}%</p>
            <p>${correctCount} de ${selectedQuestions.length} correctas</p>
            ${
              passed
                ? `
              <p style="margin-top:15px; color:#166534;">✅ Puedes acceder a la Semana ${week}</p>
              <p style="color:var(--text-light);">Los días anteriores quedan marcados como completados.</p>
            `
                : `
              <p style="margin-top:15px; color:#991b1b;">Necesitabas 70% para aprobar.</p>
              <p style="color:var(--text-light);">Practica más y vuelve a intentarlo.</p>
            `
            }
            <button class="btn-action" onclick="closeSkipExamModal(); ${
              passed ? `checkWeekUnlocks()` : ""
            }" style="margin-top:15px;">
              ${passed ? "🚀 Ir a Semana " + week : "📖 Seguir estudiando"}
            </button>
          </div>
        </div>
      `;

      if (passed) {
        addXP(300);
      }
    } else {
      renderSkipQuestion();
    }
  };

  window.closeSkipExamModal = function () {
    const m = document.getElementById("skip-exam-modal");
    if (m) m.remove();
  };

  renderSkipQuestion();
  document.body.appendChild(modal);
}

// Desbloquear semana (marcar días anteriores como completados)
function unlockWeek(weekNum) {
  const daysToUnlock = {
    2: ["d1", "d2", "d3"],
    3: ["d1", "d2", "d3", "d4", "d5"],
    4: ["d1", "d2", "d3", "d4", "d5", "d6", "d7"],
  };

  const days = daysToUnlock[weekNum] || [];
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};

  days.forEach((dayId) => {
    if (!savedData[dayId]) {
      savedData[dayId] = {
        completed: true,
        score: 100,
        topics: [],
        date: new Date().toLocaleDateString(),
        skipped: true,
      };
    }
  });

  localStorage.setItem("englishBootcampProgress", JSON.stringify(savedData));
  location.reload();
}

// --- 5. TEXT-TO-SPEECH ---
function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Tu navegador no soporta audio.");
  }
}

function speakPracticePhrase() {
  const phrase = document
    .getElementById("practice-phrase")
    .innerText.replace(/"/g, "");
  speak(phrase);
}

// --- 6. PROGRESO GLOBAL ---
function updateGlobalProgress() {
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  let completedCount = 0;
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    if (savedData[`d${i}`] && savedData[`d${i}`].completed) {
      completedCount++;
    }
  }
  const percentage = Math.round((completedCount / TOTAL_DAYS) * 100);
  const bar = document.getElementById("global-progress-bar");
  const label = document.getElementById("progress-label");
  if (bar && label) {
    bar.style.width = `${percentage}%`;
    label.innerText = `Progreso del Bootcamp: ${percentage}% (${completedCount}/${TOTAL_DAYS} días)`;
  }
}

// --- 7. TEMA OSCURO ---
function toggleTheme() {
  const body = document.body;
  const btn =
    document.getElementById("themeToggle") ||
    document.querySelector(".theme-toggle");
  if (body.getAttribute("data-theme") === "light") {
    body.removeAttribute("data-theme");
    if (btn) btn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
    if (btn) btn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

// Cargar tema guardado (dark por defecto)
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const btn =
    document.getElementById("themeToggle") ||
    document.querySelector(".theme-toggle");
  if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
    if (btn) btn.textContent = "🌙";
  } else {
    // Dark es el default
    if (btn) btn.textContent = "☀️";
  }
});

// --- 8. POMODORO ---
function updatePomoDisplay() {
  const mins = Math.floor(pomoSeconds / 60);
  const secs = pomoSeconds % 60;
  const display =
    document.getElementById("pomodoroTime") ||
    document.getElementById("pomo-display");
  if (display)
    display.textContent = `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
}

function startPomodoro() {
  if (pomoRunning) return;
  pomoRunning = true;
  const statusEl = document.getElementById("pomo-status");
  if (statusEl) statusEl.textContent = "🧠 ¡Estudiando!";

  pomoTimer = setInterval(() => {
    pomoSeconds--;
    updatePomoDisplay();

    // Guardar tiempo de estudio
    let studyTime = JSON.parse(localStorage.getItem("englishStudyTime")) || 0;
    studyTime++;
    localStorage.setItem("englishStudyTime", JSON.stringify(studyTime));

    if (pomoSeconds <= 0) {
      clearInterval(pomoTimer);
      pomoRunning = false;
      const statusEl2 = document.getElementById("pomo-status");
      if (statusEl2) statusEl2.textContent = "🎉 ¡Tiempo completado!";
      addXP(25);
      alert("🎉 ¡Pomodoro completado! +25 XP. Toma un descanso.");
      setPomoTime(25);
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomoTimer);
  pomoRunning = false;
  const statusEl = document.getElementById("pomo-status");
  if (statusEl) statusEl.textContent = "⏸️ Pausado";
}

function resetPomodoro() {
  clearInterval(pomoTimer);
  pomoRunning = false;
  setPomoTime(25);
}

function setPomoTime(minutes) {
  pomoSeconds = minutes * 60;
  updatePomoDisplay();
  const statusEl = document.getElementById("pomo-status");
  if (statusEl) statusEl.textContent = "Listo para estudiar";
}

// --- 9. FLASHCARDS MEJORADAS ---
let flashcardRepeatQueue = []; // Cola de tarjetas para repetir

function updateFlashcard() {
  if (currentFlashcardsData.length === 0) {
    document.getElementById("fc-word").textContent = "Sin tarjetas";
    document.getElementById("fc-hint").textContent =
      "Selecciona un día para ver flashcards";
    document.getElementById("fc-translation").textContent = "";
    document.getElementById("fc-example").textContent = "";
    document.getElementById("fc-current").textContent = "0";
    const pronunciationEl = document.getElementById("fc-pronunciation");
    if (pronunciationEl) pronunciationEl.textContent = "";
    return;
  }

  const card = currentFlashcardsData[currentCardIndex];
  document.getElementById("fc-word").textContent = card.word;

  // Mostrar pronunciación
  const pronunciationEl = document.getElementById("fc-pronunciation");
  if (pronunciationEl && card.pronunciation) {
    pronunciationEl.textContent = `/${card.pronunciation}/`;
  } else if (pronunciationEl) {
    pronunciationEl.textContent = "";
  }

  document.getElementById("fc-hint").textContent = card.hint;
  document.getElementById("fc-translation").textContent = card.translation;
  document.getElementById("fc-example").textContent = `"${card.example}"`;
  document.getElementById("fc-current").textContent = currentCardIndex + 1;
  document.getElementById("fc-total").textContent =
    currentFlashcardsData.length;

  // Mostrar tema/día si está disponible
  const topicBadge = document.getElementById("fc-topic");
  if (topicBadge && card.topic) {
    topicBadge.textContent = card.topic;
    topicBadge.style.display = "inline-block";
  }

  // Reset flip
  document.getElementById("current-flashcard").classList.remove("flipped");
}

function flipCard() {
  document.getElementById("current-flashcard").classList.toggle("flipped");
}

function nextCard() {
  if (currentFlashcardsData.length === 0) return;
  currentCardIndex = (currentCardIndex + 1) % currentFlashcardsData.length;

  // Si llegamos al final y hay tarjetas en la cola de repetición
  if (currentCardIndex === 0 && flashcardRepeatQueue.length > 0) {
    showRepeatMessage();
  }

  updateFlashcard();
}

function prevCard() {
  if (currentFlashcardsData.length === 0) return;
  currentCardIndex =
    (currentCardIndex - 1 + currentFlashcardsData.length) %
    currentFlashcardsData.length;
  updateFlashcard();
}

function markKnown() {
  knownCards++;
  addXP(10);
  updateStats();

  // Si estamos en el último y no hay más por repetir, mostrar completado
  if (
    currentCardIndex === currentFlashcardsData.length - 1 &&
    flashcardRepeatQueue.length === 0
  ) {
    showFlashcardComplete();
  }

  nextCard();
}

function markRepeat() {
  // Agregar la tarjeta actual a la cola de repetición
  const currentCard = currentFlashcardsData[currentCardIndex];
  if (!flashcardRepeatQueue.includes(currentCard)) {
    flashcardRepeatQueue.push(currentCard);
  }
  nextCard();
}

function showRepeatMessage() {
  if (flashcardRepeatQueue.length > 0) {
    const repeatCount = flashcardRepeatQueue.length;
    if (
      confirm(
        `🔄 Has completado todas las tarjetas.\n\nTienes ${repeatCount} tarjeta(s) marcadas para repetir.\n\n¿Quieres repasarlas ahora?`
      )
    ) {
      // Reemplazar las flashcards actuales con las de repetición
      currentFlashcardsData = [...flashcardRepeatQueue];
      flashcardRepeatQueue = [];
      currentCardIndex = 0;
      updateFlashcard();
      updateFlashcardCounter();
    }
  }
}

function showFlashcardComplete() {
  alert(
    "🎉 ¡Felicidades! Has completado todas las flashcards.\n\n+50 XP de bonus!"
  );
  addXP(50);

  // Resetear para empezar de nuevo
  currentCardIndex = 0;
  flashcardRepeatQueue = [];
  updateFlashcardData();
  updateFlashcard();
}

function speakCard() {
  if (currentFlashcardsData.length > 0) {
    speak(currentFlashcardsData[currentCardIndex].word);
  }
}

// Mostrar información de uso de la palabra
function showWordUsage() {
  if (currentFlashcardsData.length === 0) return;

  const card = currentFlashcardsData[currentCardIndex];
  const usage = card.usage || "No hay información adicional disponible.";

  // Crear modal de uso
  const modal = document.createElement("div");
  modal.className = "usage-modal";
  modal.id = "usage-modal";
  modal.innerHTML = `
    <div class="usage-container">
      <h3>💡 ¿Cuándo usar "${card.word}"?</h3>
      <p class="usage-text">${usage}</p>
      <div style="margin-top:20px;">
        <p><strong>Ejemplo:</strong></p>
        <p style="color:var(--primary); font-style:italic;">"${card.example}"</p>
      </div>
      <button class="btn-action" onclick="closeUsageModal()" style="margin-top:20px;">✓ Entendido</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeUsageModal() {
  const modal = document.getElementById("usage-modal");
  if (modal) modal.remove();
}

// --- 10. VOCABULARIO ---
function renderVocabulary() {
  const filter = currentVocabDayFilter;
  const maxDay = getMaxAvailableDay();

  let programming, business, phrases;

  if (filter === "all") {
    programming = getVocabUpToDay(maxDay, "programming");
    business = getVocabUpToDay(maxDay, "business");
    phrases = getVocabUpToDay(maxDay, "phrases");
  } else {
    const dayData = vocabByDay[filter] || {
      programming: [],
      business: [],
      phrases: [],
    };
    programming = dayData.programming || [];
    business = dayData.business || [];
    phrases = dayData.phrases || [];
  }

  const renderList = (data, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML =
        '<div style="color:var(--text-light); padding:20px; text-align:center;">No hay vocabulario para este día.</div>';
      return;
    }

    container.innerHTML = data
      .map(
        (item) => `
            <div class="vocab-item">
              <div class="vocab-word">
                ${item.word}
                <button class="btn-speak" onclick="speak('${item.word.replace(
                  /'/g,
                  "\\'"
                )}')" style="font-size:1rem;">🔊</button>
              </div>
              <div class="vocab-meaning">${item.meaning}</div>
            </div>
          `
      )
      .join("");
  };

  renderList(programming, "vocab-programming");
  renderList(business, "vocab-business");
  renderList(phrases, "vocab-phrases");
}

function renderPracticeSentences() {
  const container = document.getElementById("practice-sentences");
  if (!container) return;

  const filter = currentPracticeDayFilter;
  const maxDay = getMaxAvailableDay();

  let sentences;

  if (filter === "all") {
    sentences = getPracticeUpToDay(maxDay);
  } else {
    const dayNum = parseInt(filter.replace("d", ""));
    sentences = (practiceSentencesByDay[filter] || []).map((s) => ({
      ...s,
      day: dayNum,
    }));
  }

  if (sentences.length === 0) {
    container.innerHTML =
      '<div style="color:var(--text-light); padding:20px; text-align:center;">No hay frases de práctica para este día.</div>';
    return;
  }

  container.innerHTML = sentences
    .map(
      (item, i) => `
          <div style="background:var(--card-bg); padding:15px; border-radius:10px; border-left:4px solid var(--primary);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:600;">${item.en}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                ${
                  item.day
                    ? `<span class="day-badge-small">Día ${item.day}</span>`
                    : ""
                }
                <button class="btn-speak" onclick="speak('${item.en.replace(
                  /'/g,
                  "\\'"
                )}')" style="font-size:1.2rem;">🔊</button>
              </div>
            </div>
            <small style="color:var(--text-light);">💡 ${item.tip}</small>
          </div>
        `
    )
    .join("");

  // Actualizar la frase del día (primera del día actual o última disponible)
  const currentDay = getCurrentBootcampDay();
  const todayPhrases =
    practiceSentencesByDay[`d${currentDay}`] || practiceSentencesByDay["d1"];
  if (todayPhrases && todayPhrases.length > 0) {
    const phraseEl = document.getElementById("practice-phrase");
    const tipEl = document.getElementById("pronunciation-tip");
    if (phraseEl) phraseEl.textContent = `"${todayPhrases[0].en}"`;
    if (tipEl) tipEl.textContent = todayPhrases[0].tip;
  }
}

// --- 11. UTILIDADES ---
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text);
  alert("✅ Prompt copiado. ¡Pégalo en tu IA!");
}

function resetProgress() {
  if (
    confirm(
      "¿Estás seguro de borrar TODO tu progreso? Esta acción no se puede deshacer."
    )
  ) {
    localStorage.removeItem("englishBootcampProgress");
    localStorage.removeItem("englishStreak");
    localStorage.removeItem("englishXP");
    localStorage.removeItem("englishStudyTime");
    location.reload();
  }
}

// --- 12. TEST RÁPIDO DE VOCABULARIO ---
function startVocabTest() {
  const filter = currentVocabDayFilter;
  const maxDay = getMaxAvailableDay();

  let questions = [];

  if (filter === "all") {
    // Obtener preguntas de todos los días disponibles
    for (let i = 1; i <= maxDay; i++) {
      const dayQuestions = vocabTestQuestions[`d${i}`] || [];
      questions = questions.concat(dayQuestions.map((q) => ({ ...q, day: i })));
    }
  } else {
    questions = (vocabTestQuestions[filter] || []).map((q) => ({
      ...q,
      day: parseInt(filter.replace("d", "")),
    }));
  }

  if (questions.length === 0) {
    alert("No hay preguntas disponibles para este filtro.");
    return;
  }

  // Mezclar y seleccionar máximo 6 preguntas
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(6, shuffled.length));

  const modal = document.createElement("div");
  modal.className = "exam-modal";
  modal.id = "vocab-test-modal";

  let currentQ = 0;
  let correctCount = 0;

  function renderVocabQuestion() {
    const q = selectedQuestions[currentQ];
    modal.innerHTML = `
      <div class="exam-container">
        <div class="exam-header">
          <h2>📝 Test Rápido de Vocabulario</h2>
          <span class="exam-progress">Pregunta ${currentQ + 1} de ${
      selectedQuestions.length
    }</span>
          <span class="day-badge-small" style="margin-left:10px;">Día ${
            q.day
          }</span>
        </div>
        <div class="exam-question">
          <p class="question-text">${q.q}</p>
          <div class="exam-options">
            ${q.options
              .map(
                (opt, idx) => `
              <button class="exam-option" onclick="selectVocabAnswer(${idx}, ${q.correct})">${opt}</button>
            `
              )
              .join("")}
          </div>
        </div>
        <button class="btn-action btn-outline" onclick="closeVocabTestModal()" style="margin-top:20px;">❌ Cancelar</button>
      </div>
    `;
  }

  window.selectVocabAnswer = function (selected, correct) {
    if (selected === correct) correctCount++;
    currentQ++;

    if (currentQ >= selectedQuestions.length) {
      const score = Math.round((correctCount / selectedQuestions.length) * 100);

      modal.innerHTML = `
        <div class="exam-container">
          <div class="exam-result ${score >= 70 ? "passed" : "failed"}">
            <h2>${score >= 70 ? "🎉 ¡Excelente!" : "📚 Sigue practicando"}</h2>
            <p class="score-big">${score}%</p>
            <p>${correctCount} de ${selectedQuestions.length} correctas</p>
            <div style="margin-top:20px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
              <button class="btn-action" onclick="closeVocabTestModal(); startVocabTest();">🔄 Nuevo test</button>
              <button class="btn-action btn-outline" onclick="closeVocabTestModal()">Cerrar</button>
            </div>
          </div>
        </div>
      `;

      if (score >= 70) {
        addXP(50);
      } else {
        addXP(20);
      }
    } else {
      renderVocabQuestion();
    }
  };

  window.closeVocabTestModal = function () {
    const m = document.getElementById("vocab-test-modal");
    if (m) m.remove();
  };

  renderVocabQuestion();
  document.body.appendChild(modal);
}

// --- WEEKLY EXAM LOGIC ---
window.startWeeklyExam = function (weekNum) {
  const panel = document.getElementById(`quiz-d${weekNum * 7}`); // Use last day panel or create a new one?
  // Actually, the button calls startWeeklyExam(weekNum)
  // We should probably show a modal or use a specific panel.
  // Let's use a modal for consistency with Skip Exam.

  const questions = weeklyExamQuestions[`week${weekNum}`];
  if (!questions || questions.length === 0) {
    alert("Examen no disponible aún.");
    return;
  }

  const modal = document.createElement("div");
  modal.className = "exam-modal";
  modal.id = `weekly-exam-modal-${weekNum}`;

  let currentQ = 0;
  let correctCount = 0;

  // Shuffle
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 10); // Max 10 questions

  function renderQuestion() {
    if (currentQ >= selectedQuestions.length) {
      finishExam();
      return;
    }

    const q = selectedQuestions[currentQ];
    modal.innerHTML = `
        <div class="exam-container">
          <div class="exam-header">
            <h2>📝 Examen Semana ${weekNum}</h2>
            <span class="exam-progress">Pregunta ${currentQ + 1} de ${
      selectedQuestions.length
    }</span>
          </div>
          <div class="exam-question">
            <p class="question-text">${q.q}</p>
            <div class="exam-options">
              ${q.options
                .map(
                  (opt, idx) => `
                <button class="exam-option" onclick="selectWeeklyAnswer(${weekNum}, ${idx}, ${q.correct})">${opt}</button>
              `
                )
                .join("")}
            </div>
          </div>
          <button class="btn-action btn-outline" onclick="closeWeeklyExamModal(${weekNum})" style="margin-top:20px;">❌ Cancelar</button>
        </div>
      `;
  }

  window.selectWeeklyAnswer = function (week, selected, correct) {
    if (selected === correct) correctCount++;
    currentQ++;
    renderQuestion();
  };

  function finishExam() {
    const score = Math.round((correctCount / selectedQuestions.length) * 100);
    const passed = score >= 70;

    if (passed) {
      const savedData =
        JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
      savedData[`level${weekNum}Passed`] = true;
      localStorage.setItem(
        "englishBootcampProgress",
        JSON.stringify(savedData)
      );
      checkWeekUnlocks();
    }

    modal.innerHTML = `
        <div class="exam-container">
          <div class="exam-result ${passed ? "passed" : "failed"}">
            <h2>${
              passed ? "🎉 ¡Semana Aprobada!" : "📚 Inténtalo de nuevo"
            }</h2>
            <p class="score-big">${score}%</p>
            <p>${correctCount} de ${selectedQuestions.length} correctas</p>
            <p>${
              passed
                ? "Has desbloqueado la siguiente semana."
                : "Necesitas 70% para aprobar."
            }</p>
            <button class="btn-action" onclick="closeWeeklyExamModal(${weekNum})" style="margin-top:15px;">
              ${passed ? "Continuar" : "Repasar"}
            </button>
          </div>
        </div>
      `;

    if (passed) addXP(500);
  }

  window.closeWeeklyExamModal = function (week) {
    const m = document.getElementById(`weekly-exam-modal-${week}`);
    if (m) m.remove();
  };

  renderQuestion();
  document.body.appendChild(modal);
};

// --- LEVEL UP EXAM LOGIC ---
window.startLevelUpExam = function (level) {
  const panel = document.getElementById(`exam-panel-${level}`);
  if (!panel) return;

  // Gather questions
  let pool = [];
  let maxDay = level === 1 ? 3 : 9; // Week 1 ends at d3, Week 2 at d9

  for (let i = 1; i <= maxDay; i++) {
    if (questions[`d${i}`]) {
      pool = pool.concat(questions[`d${i}`]);
    }
  }

  // Shuffle and select 10
  pool.sort(() => Math.random() - 0.5);
  const examQuestions = pool.slice(0, 10);

  // Render Exam
  let html = `<div class="quiz-container"><h4>🛡️ Examen de Nivelación ${level}</h4>`;

  examQuestions.forEach((q, index) => {
    html += `
      <div class="quiz-question">
        <p><strong>${index + 1}. ${q.q}</strong></p>
        <div class="quiz-options">
          ${q.options
            .map(
              (opt, i) => `
            <button class="quiz-btn" onclick="selectExamAnswer(${level}, ${index}, ${i}, ${q.correct}, this)">${opt}</button>
          `
            )
            .join("")}
        </div>
        <div id="feedback-${level}-${index}" class="quiz-feedback"></div>
      </div>
    `;
  });

  html += `<button class="btn-action" style="margin-top:20px;" onclick="submitExam(${level})">Entregar Examen</button></div>`;
  panel.innerHTML = html;
  panel.style.display = "block";

  // Store current exam state
  window[`examState${level}`] = {
    questions: examQuestions,
    answers: {},
    score: 0,
  };
};

window.selectExamAnswer = function (
  level,
  qIndex,
  optIndex,
  correctIndex,
  btn
) {
  const state = window[`examState${level}`];
  state.answers[qIndex] = optIndex;

  // Visual feedback for selection
  const parent = btn.parentElement;
  parent
    .querySelectorAll(".quiz-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
};

window.submitExam = function (level) {
  const state = window[`examState${level}`];
  let correct = 0;
  const total = state.questions.length;

  state.questions.forEach((q, index) => {
    const feedbackEl = document.getElementById(`feedback-${level}-${index}`);
    const userAnswer = state.answers[index];

    if (userAnswer === q.correct) {
      correct++;
      feedbackEl.innerHTML = `<span style="color:var(--success-500)">✅ Correcto</span>`;
    } else {
      feedbackEl.innerHTML = `<span style="color:var(--error-500)">❌ Incorrecto. ${q.feedback}</span>`;
    }
  });

  const score = Math.round((correct / total) * 100);
  const passed = score >= 70;

  const panel = document.getElementById(`exam-panel-${level}`);
  panel.innerHTML += `
    <div class="exam-result ${
      passed ? "passed" : "failed"
    }" style="margin-top:20px; padding:15px; border-radius:8px; background:var(--bg-elevated); text-align:center;">
      <h3>${passed ? "🎉 ¡Nivel Superado!" : "💀 Has fallado"}</h3>
      <p class="score-big">${score}%</p>
      <p>${
        passed
          ? "Has desbloqueado la siguiente semana."
          : "Debes estudiar más y volver a intentarlo."
      }</p>
    </div>
  `;

  if (passed) {
    // Save progress
    const savedData =
      JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
    savedData[`level${level}Passed`] = true;
    localStorage.setItem("englishBootcampProgress", JSON.stringify(savedData));

    // Unlock next week
    setTimeout(() => {
      checkWeekUnlocks();
      // Scroll to next week
      const nextWeek = document.getElementById(`week-${level + 1}`);
      if (nextWeek) nextWeek.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  }
};

// --- WEEK PROGRESSION LOGIC ---
function checkWeekUnlocks() {
  const savedData =
    JSON.parse(localStorage.getItem("englishBootcampProgress")) || {};
  const skipData = JSON.parse(localStorage.getItem("skipExamResults")) || {};

  // Week 1 is always open
  // Weeks 2-8
  for (let i = 2; i <= 8; i++) {
    const weekElem = document.getElementById(`week-${i}`);
    if (weekElem) {
      // Unlock if previous week passed OR skip exam passed
      const prevWeekPassed = savedData[`level${i - 1}Passed`];
      const skipPassed =
        skipData[`toWeek${i}`] && skipData[`toWeek${i}`].passed;

      if (prevWeekPassed || skipPassed) {
        weekElem.classList.remove("locked");
      } else {
        weekElem.classList.add("locked");
      }
    }
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  checkWeekUnlocks();
});

// ==========================================
// EXTENSIÓN DE RUTINA (DEC 12 - FEB 1)
// ==========================================

const curriculum = [
  {
    week: 1,
    title: "Configuración Neuronal",
    focus: "Shadowing & Basics",
    start: new Date(2025, 11, 11),
  },
  {
    week: 2,
    title: "El Pasado y la Narrativa",
    focus: "Past Simple & Verbs",
    start: new Date(2025, 11, 18),
  },
  {
    week: 3,
    title: "Futuro y Planificación",
    focus: "Future Tenses",
    start: new Date(2025, 11, 25),
  },
  {
    week: 4,
    title: "Comunicación Profesional",
    focus: "Business & Emails",
    start: new Date(2026, 0, 1),
  },
  {
    week: 5,
    title: "Lógica y Condicionales",
    focus: "Conditionals (If/Else)",
    start: new Date(2026, 0, 8),
  },
  {
    week: 6,
    title: "Modales y Politeness",
    focus: "Modal Verbs",
    start: new Date(2026, 0, 15),
  },
  {
    week: 7,
    title: "Fluidez y Storytelling",
    focus: "Connectors & Flow",
    start: new Date(2026, 0, 22),
  },
  {
    week: 8,
    title: "Maestría Técnica",
    focus: "Advanced Tech Vocab",
    start: new Date(2026, 0, 29),
  },
];

const dailyTopics = [
  // Week 1
  { d: 1, title: "El Motor Lógico", topic: "Structure (SVO)" },
  { d: 2, title: "Preguntas Poderosas", topic: "Do/Does Questions" },
  { d: 3, title: "Existencia y Entorno", topic: "There is/are" },
  { d: 4, title: "Sonidos del Pasado", topic: "Pronunciation -ED" },
  { d: 5, title: "Verbos Irregulares I", topic: "Irregular Verbs" },
  { d: 6, title: "Rutinas y Hábitos", topic: "Present Simple" },
  { d: 7, title: "Review Semanal", topic: "Review" },
  // Week 2
  { d: 8, title: "Narrando Historias", topic: "Past Simple Affirmative" },
  { d: 9, title: "Negaciones en Pasado", topic: "Did not (Didn't)" },
  { d: 10, title: "Preguntas en Pasado", topic: "Did you...?" },
  { d: 11, title: "Verbos Irregulares II", topic: "Common Irregulars" },
  { d: 12, title: "El Verbo To Be Pasado", topic: "Was/Were" },
  { d: 13, title: "Anécdotas Técnicas", topic: "Storytelling" },
  { d: 14, title: "Review Semanal", topic: "Review" },
  // Week 3
  { d: 15, title: "Planes Futuros", topic: "Going to" },
  { d: 16, title: "Predicciones", topic: "Will" },
  {
    d: 17,
    title: "Horarios y Eventos",
    topic: "Present Continuous for Future",
  },
  { d: 18, title: "Verbos Irregulares III", topic: "More Irregulars" },
  { d: 19, title: "Metas 2026", topic: "Future Goals" },
  { d: 20, title: "Tech Roadmap", topic: "Project Planning" },
  { d: 21, title: "Review Semanal", topic: "Review" },
  // Week 4
  { d: 22, title: "Emails Formales", topic: "Email Openers" },
  { d: 23, title: "Solicitudes", topic: "Making Requests" },
  { d: 24, title: "Reuniones (Dailies)", topic: "Stand-up Updates" },
  { d: 25, title: "Verbos de Negocios", topic: "Business Verbs" },
  { d: 26, title: "Presentaciones", topic: "Intros" },
  { d: 27, title: "Feedback", topic: "Giving/Receiving Feedback" },
  { d: 28, title: "Review Semanal", topic: "Review" },
  // Week 5
  { d: 29, title: "Causa y Efecto", topic: "Zero Conditional" },
  { d: 30, title: "Posibilidades Reales", topic: "First Conditional" },
  { d: 31, title: "Situaciones Hipotéticas", topic: "Second Conditional" },
  { d: 32, title: "Lógica de Programación", topic: "If/Else in English" },
  { d: 33, title: "Verbos de Lógica", topic: "Logical Verbs" },
  { d: 34, title: "Debugging Context", topic: "Explaining Bugs" },
  { d: 35, title: "Review Semanal", topic: "Review" },
  // Week 6
  { d: 36, title: "Habilidades", topic: "Can/Could" },
  { d: 37, title: "Obligaciones", topic: "Must/Have to" },
  { d: 38, title: "Consejos", topic: "Should" },
  { d: 39, title: "Posibilidades", topic: "Might/May" },
  { d: 40, title: "Soft Skills", topic: "Polite Requests" },
  { d: 41, title: "Entrevistas Técnicas", topic: "Interview Prep" },
  { d: 42, title: "Review Semanal", topic: "Review" },
  // Week 7
  { d: 43, title: "Conectores I", topic: "And, But, So, Because" },
  { d: 44, title: "Conectores II", topic: "However, Therefore" },
  { d: 45, title: "Secuenciadores", topic: "First, Then, Finally" },
  { d: 46, title: "Narrativa Fluida", topic: "Flow" },
  { d: 47, title: "Explicando Arquitectura", topic: "System Design" },
  { d: 48, title: "Debates Técnicos", topic: "Agreeing/Disagreeing" },
  { d: 49, title: "Review Semanal", topic: "Review" },
  // Week 8
  { d: 50, title: "Vocabulario Avanzado", topic: "Advanced Terms" },
  { d: 51, title: "Preparación Final", topic: "Final Prep" },
  { d: 52, title: "GRAN FINAL", topic: "Final Exam" },
];

function renderLessons() {
  const container = document.getElementById("lessons-container");
  if (!container) return;

  let html = "";

  curriculum.forEach((week, index) => {
    const weekNum = index + 1;
    const startDate = week.start.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
    const endDate = new Date(week.start);
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = endDate.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });

    html += `
        <div class="week-section" id="week-${weekNum}">
            <div class="week-header">
                <span class="week-badge">SEMANA ${weekNum}</span>
                <div class="week-title">${week.title} (${startDate} - ${endDateStr})</div>
                <button class="btn-exam" onclick="startWeeklyExam(${weekNum})">📝 Examen Semana ${weekNum}</button>
            </div>
            
            <div class="ai-prompt-container">
                <span class="prompt-label">🤖 Prompt Semanal:</span>
                <div class="prompt-code" id="p${weekNum}">
                    "Act as an English teacher. Week ${weekNum} Focus: ${week.focus}. Help me practice conversation and correct my mistakes."
                </div>
                <button class="btn-action" onclick="copyToClipboard('p${weekNum}')">Copiar</button>
            </div>
        `;

    // Days for this week
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = Math.min(startDay + 6, 52);

    for (let d = startDay; d <= endDay; d++) {
      const dayData = dailyTopics.find((t) => t.d === d) || {
        title: "Práctica General",
        topic: "General",
      };
      const date = new Date(week.start);
      date.setDate(date.getDate() + (d - startDay));
      const dateStr = date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      html += `
            <div class="day-card" id="card-d${d}">
                <div class="day-header" onclick="toggleDay('d${d}')">
                    <div>
                        <span class="day-date">${dateStr}</span>
                        <span class="day-title">Día ${d}: ${
        dayData.title
      }</span>
                    </div>
                    <div class="toggle-icon">+</div>
                </div>
                <div class="day-body" id="d${d}">
                    <div id="summary-d${d}" class="result-box"></div>
                    
                    <div class="pedagogy-box">
                        <div class="pedagogy-title">🧠 Clase del Día: ${
                          dayData.topic
                        }</div>
                        <p><strong>Contexto:</strong> ${getContext(
                          dayData.topic
                        )}</p>
                        <p><strong>Cómo responder:</strong> ${getResponse(
                          dayData.topic
                        )}</p>
                        <p><strong>¿Por qué funciona?</strong> ${getWhy(
                          dayData.topic
                        )}</p>
                    </div>

                    <div class="activity-block">
                        <h4>📚 Vocabulario & Reto</h4>
                        <p><strong>Reto:</strong> Memorizar 3 verbos irregulares hoy.</p>
                        <p><strong>Palabra Clave:</strong> ${getKeyword(d)}</p>
                    </div>

                    <button class="btn-action" onclick="startQuiz('d${d}')">🧠 Iniciar Quiz del Día</button>
                    <div id="quiz-d${d}" class="quiz-panel"></div>
                </div>
            </div>
            `;
    }
    html += `</div>`;
  });

  container.innerHTML = html;
}

function getContext(topic) {
  const contexts = {
    "Structure (SVO)": "Fundamental para construir cualquier oración.",
    "Do/Does Questions": "Esencial para obtener información en presente.",
    "Past Simple":
      "Usado para contar historias o reportar lo que hiciste ayer.",
    "Future Goals": "Para hablar de tus ambiciones y planes de carrera.",
    "Email Openers": "La primera impresión en un correo profesional.",
    Conditionals:
      "Crucial para explicar lógica de código (If this, then that).",
    Review: "La repetición espaciada es clave para la memoria a largo plazo.",
  };
  return (
    contexts[topic] || "Concepto clave para la comunicación diaria y técnica."
  );
}

function getWhy(topic) {
  const whys = {
    "Structure (SVO)":
      "El inglés es un idioma de orden fijo. Si cambias el orden, cambias el significado.",
    "Do/Does Questions":
      "Los auxiliares son las 'banderas' que indican tiempo y modo.",
    Review: "El cerebro olvida el 50% de lo aprendido en 24h si no se repasa.",
  };
  return whys[topic] || "Dominar esto te dará confianza y precisión.";
}

function getResponse(topic) {
  const responses = {
    "Structure (SVO)": "Usa siempre Sujeto + Verbo. Ej: 'I (S) code (V)'.",
    "Do/Does Questions":
      "Responde con el auxiliar: 'Yes, I do' / 'No, I don't'.",
    "Past Simple":
      "Usa el verbo en pasado (ed o irregular). 'I worked yesterday'.",
    "Future Goals": "Usa 'I want to...' o 'I plan to...'.",
    "Email Openers": "Usa 'Dear [Name],' o 'Hi [Name],'.",
    Conditionals: "Usa 'If [condition], [result]'.",
  };
  return (
    responses[topic] || "Usa la estructura gramatical aprendida en la lección."
  );
}

function getKeyword(day) {
  const words = [
    "Algorithm",
    "Bug",
    "Commit",
    "Deploy",
    "Endpoint",
    "Framework",
    "Git",
    "Host",
    "Interface",
    "JSON",
    "Kernel",
    "Latency",
    "Merge",
    "Node",
    "Object",
    "Parse",
    "Query",
    "React",
    "Stack",
    "Token",
    "User",
    "Variable",
    "Widget",
    "XML",
    "Yield",
    "Zip",
  ];
  return words[day % words.length] || "Code";
}

function extendWeeklyExams() {
  // Generate questions for Weeks 5-8
  for (let i = 5; i <= 8; i++) {
    weeklyExamQuestions[`week${i}`] = [
      {
        q: `Question 1 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 0,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 2 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 1,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 3 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 2,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 4 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 0,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 5 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 1,
        feedback: "Feedback",
        topic: "Topic",
      },
    ];
  }

  // Generate Skip Exam Questions (Cumulative)
  // toWeek2 = week1
  // toWeek3 = week1 + week2
  // ...
  // toWeek8 = week1 + ... + week7

  for (let i = 2; i <= 8; i++) {
    let cumulativeQuestions = [];
    for (let j = 1; j < i; j++) {
      if (weeklyExamQuestions[`week${j}`]) {
        cumulativeQuestions = [
          ...cumulativeQuestions,
          ...weeklyExamQuestions[`week${j}`],
        ];
      }
    }
    skipExamQuestions[`toWeek${i}`] = cumulativeQuestions;
  }
}

function extendWeeklyExams() {
  // Generate questions for Weeks 5-8
  for (let i = 5; i <= 8; i++) {
    weeklyExamQuestions[`week${i}`] = [
      {
        q: `Question 1 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 0,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 2 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 1,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 3 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 2,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 4 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 0,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: `Question 5 for Week ${i}`,
        options: ["A", "B", "C"],
        correct: 1,
        feedback: "Feedback",
        topic: "Topic",
      },
    ];
  }

  // Generate Skip Exam Questions (Cumulative)
  // toWeek2 = week1
  // toWeek3 = week1 + week2
  // ...
  // toWeek8 = week1 + ... + week7

  for (let i = 2; i <= 8; i++) {
    let cumulativeQuestions = [];
    for (let j = 1; j < i; j++) {
      if (weeklyExamQuestions[`week${j}`]) {
        cumulativeQuestions = [
          ...cumulativeQuestions,
          ...weeklyExamQuestions[`week${j}`],
        ];
      }
    }
    skipExamQuestions[`toWeek${i}`] = cumulativeQuestions;
  }
}

function extendData() {
  for (let i = 16; i <= 52; i++) {
    questions[`d${i}`] = [
      {
        q: "Question 1 for Day " + i,
        options: ["A", "B", "C"],
        correct: 0,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: "Question 2 for Day " + i,
        options: ["A", "B", "C"],
        correct: 1,
        feedback: "Feedback",
        topic: "Topic",
      },
      {
        q: "Question 3 for Day " + i,
        options: ["A", "B", "C"],
        correct: 2,
        feedback: "Feedback",
        topic: "Topic",
      },
    ];

    vocabByDay[`d${i}`] = {
      programming: [
        { word: "TechTerm" + i, meaning: "Significado", example: "Example" },
      ],
      business: [
        { word: "BizTerm" + i, meaning: "Significado", example: "Example" },
      ],
      phrases: [{ word: "Phrase " + i, meaning: "Frase común" }],
    };

    flashcardsDataByDay[`d${i}`] = [
      {
        word: "Word" + i,
        pronunciation: "/w/",
        translation: "Palabra",
        example: "Example",
        topic: "General",
      },
    ];

    practiceSentencesByDay[`d${i}`] = [
      { en: "Practice sentence for day " + i, tip: "Tip de pronunciación" },
    ];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  extendData();
  extendWeeklyExams();
  renderLessons();
  checkWeekUnlocks();
});
