const es = {
  sitio: {
    saltar: "Saltar al contenido",
    navegacion: "Secciones",
    blog: "Blog",
    otraPestana: "abre en otra pestaña",
    menu: "Menú",
    cerrar: "Cerrar",
    perfiles: "Perfiles y correo",
    correo: "Correo",
    fotoDe: (nombre: string) => `Foto de ${nombre}`,
    temaOscuro: "Tema oscuro",
    pais: "Perú",
    idioma: "Idioma",
    nombresDeIdioma: { es: "Español", en: "English" },
    locale: "es_PE",
  },
  pie: {
    llamado: "¿Tienes una idea o un proyecto?",
    detalle: "Escríbeme y conversemos.",
    escribir: "Escribir correo",
    fundador: "Fundador de ABItech Perú.",
    actualizado: "Actualizado en",
    codigo: "Este sitio en GitHub",
  },
  secciones: {
    inicio: "Inicio",
    proyectos: "Proyectos",
    escritos: "Blog",
    cv: "CV",
    codigoAbierto: "Código abierto",
    aprende: "Aprende",
    sobreMi: "Sobre mí",
    contacto: "Contacto",
  },
  fechas: { locale: "es-PE", actualidad: "actualidad" },
  cv: {
    descargar: "Descargar CV en PDF",
    otraVersion: "English version",
    titulo: "Currículum",
    descripcion: (nombre: string) =>
      `Experiencia, formación, certificaciones y habilidades de ${nombre}.`,
    experiencia: "Experiencia",
    formacion: "Formación",
    certificaciones: "Certificaciones",
    verificar: "Verificar",
    habilidades: "Habilidades",
    niveles: { 3: "Avanzado", 2: "Intermedio", 1: "Básico" },
    idiomas: "Idiomas",
  },
  inicio: {
    saludo: "Hola, soy",
    mision:
      "Construyo software que la gente usa todos los días, desde Huánuco para el mundo.",
    intro:
      "Soy desarrollador full stack. Trabajo con Laravel, Vue, .NET y AWS, fundé ABItech Perú y escribo para enseñar tecnología en español.",
    verProyectos: "Ver proyectos",
    conoceme: "Conóceme",
    recorrido: "Mi recorrido",
    hitos: [
      {
        anio: "2023",
        texto:
          "Hice mis prácticas en IT Corp y construí un sistema de horas para unos 50 consultores SAP.",
      },
      {
        anio: "2023",
        texto:
          "Construí Tu Coach UDH como único desarrollador. Hoy tiene más de 8800 usuarios.",
        ruta: "/proyectos/tu-coach",
      },
      {
        anio: "2024",
        texto:
          "Dirigí el Laboratorio de Transformación Digital de la Universidad de Huánuco.",
      },
      {
        anio: "2025",
        texto:
          "Desarrollé unos 10 flujos de integración para el sistema de tarjetas de Interbank.",
      },
      {
        anio: "2025",
        texto: "Fundé ABItech Perú y cofundé Arsy Innova.",
      },
      {
        anio: "Hoy",
        texto:
          "Soy desarrollador full stack en Tecnovo y escribo un libro para aprender Docker.",
        ruta: "/aprende",
      },
    ],
    frentes: "Lo que hago",
    construyo: {
      titulo: "Construyo",
      texto:
        "Sistemas web, integraciones bancarias y plataformas de cursos en producción.",
      enlace: (n: number) => `${n} proyectos`,
    },
    enseno: {
      titulo: "Enseño",
      texto: "Escribo en español para que aprender tecnología cueste menos.",
      enlace: () => "Ver libros",
    },
    comparto: {
      titulo: "Comparto",
      texto: "Paquetes de código abierto para Laravel, listos para usar.",
      enlace: (n: number) => `${n} paquetes`,
    },
    destacados: "Proyectos destacados",
    verTodos: "Ver todos los proyectos",
    verMas: "Ver más",
  },
  proyectos: {
    descripcion: (nombre: string) =>
      `Proyectos de ${nombre}, entre plataformas de cursos, integraciones bancarias y sistemas de salud.`,
    intro:
      "Lo que construí en empresas y por mi cuenta. Los de clientes privados van sin su nombre.",
    filtrar: "Filtrar por tecnología",
    todos: "Todos",
    unidad: "proyectos",
    tecnologias: "Tecnologías",
    verEnLinea: "Ver en línea",
    verCaso: "Ver el caso",
    volver: "Todos los proyectos",
    resultados: "Resultados",
    portadaDe: (nombre: string) => `Portada de ${nombre}`,
  },
  codigoAbierto: {
    descripcion: (nombre: string) =>
      `Paquetes de código abierto de ${nombre} para Laravel, con licencia MIT y listos para usar en tus proyectos.`,
    intro: "Paquetes que saqué de mis proyectos para que otros los usen.",
    verEnGithub: "Ver en GitHub",
    integra: "Integra",
  },
  aprende: {
    descripcion: (nombre: string) =>
      `Libros de ${nombre} para aprender tecnología en español, empezando por Docker.`,
    intro: "Escribo para enseñar en español lo que uso en producción.",
    libros: "Libros",
  },
  sobreMi: {
    descripcion: (nombre: string) =>
      `Quién es ${nombre}, desarrollador full stack de Huánuco, Perú.`,
    vivo: (ciudad: string) =>
      `Vivo en ${ciudad}, Perú, y trabajo en remoto. También puedo mudarme dentro o fuera del país.`,
    verCv: "Ver mi CV",
    altInterbank:
      "Abimael de pie frente a un muro verde con una pantalla que dice «Más de 2 millones de usuarios», en Interbank",
    pieInterbank: "En Interbank, para quien desarrollé flujos de integración.",
    formacion: "Formación",
    altSustentacion:
      "Abimael con terno sostiene el acta de sustentación de su tesis, junto a las banderas del Perú, de la Universidad de Huánuco y de Huánuco",
    pieSustentacion: "El día de la sustentación de mi tesis.",
    tipoTitulo: "Título",
    tipoMaestria: "Maestría",
    estudios: (universidad: string, maestria: string, escuela: string) =>
      `Me titulé como ingeniero de sistemas e informática en la ${universidad}, con una tesis que evaluó Tu Coach UDH con 60 tesistas. También egresé de la ${maestria} de la ${escuela}.`,
    escribo: "Lo que escribo",
  },
  escritos: {
    descripcion: (nombre: string) =>
      `Artículos y notas de ${nombre} sobre desarrollo web, nube y lo que aprende en el camino.`,
    intro:
      "Artículos largos y notas cortas sobre lo que construyo y lo que aprendo.",
    vacio: "Pronto publicaré la primera entrada.",
    articulo: "Artículo",
    nota: "Nota",
    minutos: (n: number) => `${n} min de lectura`,
    volver: "Volver al blog",
    etiquetas: "Etiquetas",
    sobre: (etiqueta: string) => `Publicaciones sobre ${etiqueta}`,
    suscribirse: "Suscribirse por RSS",
  },
  contacto: {
    descripcion: (nombre: string) =>
      `Cómo contactar a ${nombre} por correo, LinkedIn o GitHub.`,
    intro:
      "Busco un puesto full stack, de nube o de DevOps, en remoto o con mudanza dentro o fuera del Perú.",
  },
};

export type Textos = typeof es;

const en: Textos = {
  sitio: {
    saltar: "Skip to content",
    navegacion: "Sections",
    blog: "Blog",
    otraPestana: "opens in a new tab",
    menu: "Menu",
    cerrar: "Close",
    perfiles: "Profiles and email",
    correo: "Email",
    fotoDe: (nombre) => `Photo of ${nombre}`,
    temaOscuro: "Dark theme",
    pais: "Peru",
    idioma: "Language",
    nombresDeIdioma: { es: "Español", en: "English" },
    locale: "en_US",
  },
  pie: {
    llamado: "Have an idea or a project?",
    detalle: "Write to me and let's talk.",
    escribir: "Send an email",
    fundador: "Founder of ABItech Perú.",
    actualizado: "Updated",
    codigo: "This site on GitHub",
  },
  secciones: {
    inicio: "Home",
    proyectos: "Projects",
    escritos: "Blog",
    cv: "Resume",
    codigoAbierto: "Open source",
    aprende: "Learn",
    sobreMi: "About",
    contacto: "Contact",
  },
  fechas: { locale: "en-US", actualidad: "present" },
  cv: {
    descargar: "Download resume (PDF)",
    otraVersion: "Versión en español",
    titulo: "Resume",
    descripcion: (nombre) =>
      `Experience, education, certifications and skills of ${nombre}.`,
    experiencia: "Experience",
    formacion: "Education",
    certificaciones: "Certifications",
    verificar: "Verify",
    habilidades: "Skills",
    niveles: { 3: "Advanced", 2: "Intermediate", 1: "Basic" },
    idiomas: "Languages",
  },
  inicio: {
    saludo: "Hi, I'm",
    mision: "I build software people use every day, from Huánuco to the world.",
    intro:
      "I am a full stack developer. I work with Laravel, Vue, .NET and AWS, I founded ABItech Perú and I write to teach technology in Spanish.",
    verProyectos: "See projects",
    conoceme: "About me",
    recorrido: "My journey",
    hitos: [
      {
        anio: "2023",
        texto:
          "Interned at IT Corp and built a timesheet system for about 50 SAP consultants.",
      },
      {
        anio: "2023",
        texto:
          "Built Tu Coach UDH as the sole developer. Today it has more than 8,800 users.",
        ruta: "/proyectos/tu-coach",
      },
      {
        anio: "2024",
        texto:
          "Led the Digital Transformation Lab at the University of Huánuco.",
      },
      {
        anio: "2025",
        texto: "Built about 10 integration flows for Interbank's card system.",
      },
      {
        anio: "2025",
        texto: "Founded ABItech Perú and co-founded Arsy Innova.",
      },
      {
        anio: "Today",
        texto:
          "Full stack developer at Tecnovo, writing a book to learn Docker.",
        ruta: "/aprende",
      },
    ],
    frentes: "What I do",
    construyo: {
      titulo: "I build",
      texto:
        "Web systems, banking integrations and course platforms in production.",
      enlace: (n) => `${n} projects`,
    },
    enseno: {
      titulo: "I teach",
      texto: "I write in Spanish so learning technology is easier.",
      enlace: () => "See books",
    },
    comparto: {
      titulo: "I share",
      texto: "Open source Laravel packages, ready to use.",
      enlace: (n) => `${n} packages`,
    },
    destacados: "Featured projects",
    verTodos: "See all projects",
    verMas: "See more",
  },
  proyectos: {
    descripcion: (nombre) =>
      `Projects by ${nombre}, including course platforms, banking integrations and health systems.`,
    intro:
      "What I built at companies and on my own. Projects for private clients are shown without their name.",
    filtrar: "Filter by technology",
    todos: "All",
    unidad: "projects",
    tecnologias: "Technologies",
    verEnLinea: "Visit site",
    verCaso: "Read the case",
    volver: "All projects",
    resultados: "Results",
    portadaDe: (nombre) => `Home page of ${nombre}`,
  },
  codigoAbierto: {
    descripcion: (nombre) =>
      `Open source Laravel packages by ${nombre}, MIT licensed and ready to use in your projects.`,
    intro: "Packages I extracted from my projects so others can use them.",
    verEnGithub: "View on GitHub",
    integra: "Integrates",
  },
  aprende: {
    descripcion: (nombre) =>
      `Books by ${nombre} to learn technology in Spanish, starting with Docker.`,
    intro: "I write to teach, in Spanish, what I use in production.",
    libros: "Books",
  },
  sobreMi: {
    descripcion: (nombre) =>
      `Who ${nombre} is, a full stack developer from Huánuco, Peru.`,
    vivo: (ciudad) =>
      `I live in ${ciudad}, Peru, and work remotely. I can also relocate within Peru or abroad.`,
    verCv: "View my resume",
    altInterbank:
      "Abimael standing in front of a green wall with a screen that reads «More than 2 million users», at Interbank",
    pieInterbank: "At Interbank, where I built integration flows.",
    formacion: "Education",
    altSustentacion:
      "Abimael in a suit holding his thesis defense record, next to the flags of Peru, the University of Huánuco and Huánuco",
    pieSustentacion: "The day I defended my thesis.",
    tipoTitulo: "Professional degree",
    tipoMaestria: "Master's",
    estudios: (universidad, maestria, escuela) =>
      `I earned my professional degree in Systems and Computer Engineering at the ${universidad}, with a thesis that evaluated Tu Coach UDH with 60 thesis students. I also completed the coursework of the ${maestria} at ${escuela}.`,
    escribo: "What I write",
  },
  escritos: {
    descripcion: (nombre) =>
      `Articles and notes by ${nombre} about web development, the cloud and what he learns along the way.`,
    intro: "Long articles and short notes about what I build and what I learn.",
    vacio: "The first post is coming soon.",
    articulo: "Article",
    nota: "Note",
    minutos: (n) => `${n} min read`,
    volver: "Back to the blog",
    etiquetas: "Tags",
    sobre: (etiqueta) => `Posts about ${etiqueta}`,
    suscribirse: "Subscribe via RSS",
  },
  contacto: {
    descripcion: (nombre) =>
      `How to contact ${nombre} by email, LinkedIn or GitHub.`,
    intro:
      "I am looking for a full stack, cloud or DevOps role, remote or with relocation within Peru or abroad.",
  },
};

export const TEXTOS = { es, en } as const;
