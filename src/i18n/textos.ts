const es = {
  sitio: {
    saltar: "Saltar al contenido",
    navegacion: "Secciones",
    otraPestana: "abre en otra pestaña",
    menu: "Menú",
    cerrar: "Cerrar",
    perfiles: "Perfiles y correo",
    correo: "Correo",
    fotoDe: (nombre: string) => `Foto de ${nombre}`,
    temaOscuro: "Tema oscuro",
    pais: "Perú",
    otroIdioma: { etiqueta: "English", codigo: "en" },
    locale: "es_PE",
  },
  pie: {
    llamado: "¿Buscas un desarrollador full stack para tu equipo?",
    detalle: "Escríbeme o descarga mi CV y conversemos.",
    escribir: "Escribir correo",
    cv: "Descargar CV",
    fundador: "Fundador de ABItech Perú.",
    actualizado: "Actualizado en",
    codigo: "Este sitio en GitHub",
  },
  secciones: {
    inicio: "Inicio",
    proyectos: "Proyectos",
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
    idiomas: "Idiomas",
  },
  inicio: {
    saludo: "Hola, soy",
    hoy: "En qué trabajo hoy",
    destacados: "Proyectos destacados",
    libro: "Libro en curso",
    cifras: {
      anios: "años creando sistemas web",
      usuarios: "usuarios en Tu Coach UDH",
      integraciones: "flujos de integración para Interbank",
      proyectos: "proyectos publicados",
    },
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
    volver: "Todos los proyectos",
    resultados: "Resultados",
    portadaDe: (nombre: string) => `Portada de ${nombre}`,
  },
  codigoAbierto: {
    descripcion: (nombre: string) =>
      `Paquetes de código abierto de ${nombre} para Laravel, con licencia MIT y listos para usar en tus proyectos.`,
    intro:
      "Paquetes que saqué de mis proyectos para que otros los usen. Cada uno tiene su guía de instalación en GitHub.",
    verEnGithub: "Ver en GitHub",
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
    otraPestana: "opens in a new tab",
    menu: "Menu",
    cerrar: "Close",
    perfiles: "Profiles and email",
    correo: "Email",
    fotoDe: (nombre) => `Photo of ${nombre}`,
    temaOscuro: "Dark theme",
    pais: "Peru",
    otroIdioma: { etiqueta: "Español", codigo: "es" },
    locale: "en_US",
  },
  pie: {
    llamado: "Looking for a full stack developer for your team?",
    detalle: "Write to me or download my resume and let's talk.",
    escribir: "Send an email",
    cv: "Download resume",
    fundador: "Founder of ABItech Perú.",
    actualizado: "Updated",
    codigo: "This site on GitHub",
  },
  secciones: {
    inicio: "Home",
    proyectos: "Projects",
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
    idiomas: "Languages",
  },
  inicio: {
    saludo: "Hi, I'm",
    hoy: "What I work on today",
    destacados: "Featured projects",
    libro: "Book in progress",
    cifras: {
      anios: "years building web systems",
      usuarios: "users on Tu Coach UDH",
      integraciones: "integration flows for Interbank",
      proyectos: "published projects",
    },
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
    volver: "All projects",
    resultados: "Results",
    portadaDe: (nombre) => `Home page of ${nombre}`,
  },
  codigoAbierto: {
    descripcion: (nombre) =>
      `Open source Laravel packages by ${nombre}, MIT licensed and ready to use in your projects.`,
    intro:
      "Packages I extracted from my projects so others can use them. Each one has its install guide on GitHub.",
    verEnGithub: "View on GitHub",
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
  contacto: {
    descripcion: (nombre) =>
      `How to contact ${nombre} by email, LinkedIn or GitHub.`,
    intro:
      "I am looking for a full stack, cloud or DevOps role, remote or with relocation within Peru or abroad.",
  },
};

export const TEXTOS = { es, en } as const;
