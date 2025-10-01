// /js/tax_params.js

const TAX_PARAMS = {
  // === Cotisations Sécurité Sociale ===
  ss: {
    rate: 0.0657,   // Cotisation salarié (6,57 %)
    maxBase: 53940  // Base maximale annuelle (~4495 €/mois)
  },

  // === Types de contrats (taux indicatifs) ===
  contratos: {
    general: { ssRate: 0.0657 },
    temporal: { ssRate: 0.0675 },
    practicas: { ssRate: 0.061 }
  },

  // === Catégories socio-professionnelles (bases minimas indicatives) ===
  categorias_profesionales: {
    ingenieros: { baseMin: 1900 },
    licenciados: { baseMin: 1900 },
    oficiales: { baseMin: 1500 },
    peones: { baseMin: 1300 }
  },

  // === IRPF ===
  irpf: {
    minimo_personal: 5550, // Abattement personnel standard

    // --- Abattements (mínimos) ---
    minimos: {
      edad: {
        mayor_65: 1150,
        mayor_75: 2550 // cumulable avec >65
      },
      descendientes: {
        primer: 2400,
        segundo: 2700,
        tercero: 4000,
        cuarto: 4500,
        menores_3: 2800 // supplément < 3 ans
      },
      ascendientes: {
        base: 1150,     // par ascendant >65
        mayores_75: 2550
      },
      discapacidad: {
        grado_33_65: 3000,
        grado_65: 9000,
        movilidad_reducida: 3000,
        apoyo_terceros: 3000
      },
      // --- Mínimo por unidad familiar (casado con tributación conjunta) ---
      unidad_familiar: 3400
    },

    // --- Tramos Estatales (communs à toute l’Espagne) ---
    estatal: [
      { hasta: 12450, tipo: 0.095 },
      { hasta: 20200, tipo: 0.12 },
      { hasta: 35200, tipo: 0.15 },
      { hasta: 60000, tipo: 0.185 },
      { hasta: 300000, tipo: 0.225 },
      { hasta: Infinity, tipo: 0.245 }
    ],

    // --- Tramos Autonómicos ---
    comunidades: {
      andalucia: [
        { hasta: 12450, tipo: 0.095 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.15 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.225 }
      ],
      aragon: [
        { hasta: 12450, tipo: 0.10 },
        { hasta: 20200, tipo: 0.125 },
        { hasta: 35200, tipo: 0.155 },
        { hasta: 60000, tipo: 0.19 },
        { hasta: Infinity, tipo: 0.23 }
      ],
      asturias: [
        { hasta: 12450, tipo: 0.10 },
        { hasta: 20200, tipo: 0.125 },
        { hasta: 35200, tipo: 0.155 },
        { hasta: 60000, tipo: 0.195 },
        { hasta: Infinity, tipo: 0.235 }
      ],
      baleares: [
        { hasta: 12450, tipo: 0.09 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.15 },
        { hasta: 60000, tipo: 0.19 },
        { hasta: Infinity, tipo: 0.24 }
      ],
      canarias: [
        { hasta: 12450, tipo: 0.09 },
        { hasta: 20200, tipo: 0.115 },
        { hasta: 35200, tipo: 0.14 },
        { hasta: 60000, tipo: 0.18 },
        { hasta: Infinity, tipo: 0.23 }
      ],
      cantabria: [
        { hasta: 12450, tipo: 0.085 },
        { hasta: 20200, tipo: 0.115 },
        { hasta: 35200, tipo: 0.145 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.23 }
      ],
      castilla_la_mancha: [
        { hasta: 12450, tipo: 0.095 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.15 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.225 }
      ],
      castilla_leon: [
        { hasta: 12450, tipo: 0.09 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.145 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.22 }
      ],
      catalunya: [
        { hasta: 12450, tipo: 0.105 },
        { hasta: 17707, tipo: 0.12 },
        { hasta: 21000, tipo: 0.14 },
        { hasta: 33007, tipo: 0.15 },
        { hasta: 53407, tipo: 0.188 },
        { hasta: 90000, tipo: 0.215 },
        { hasta: 120000, tipo: 0.235 },
        { hasta: 175000, tipo: 0.245 },
        { hasta: Infinity, tipo: 0.255 }
      ],
      extremadura: [
        { hasta: 12450, tipo: 0.08 },
        { hasta: 20200, tipo: 0.11 },
        { hasta: 35200, tipo: 0.145 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.225 }
      ],
      galicia: [
        { hasta: 12450, tipo: 0.095 },
        { hasta: 21000, tipo: 0.116 },
        { hasta: 35200, tipo: 0.149 },
        { hasta: 47600, tipo: 0.184 },
        { hasta: Infinity, tipo: 0.225 }
      ],
      la_rioja: [
        { hasta: 12450, tipo: 0.085 },
        { hasta: 20200, tipo: 0.115 },
        { hasta: 35200, tipo: 0.145 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.23 }
      ],
      madrid: [
        { hasta: 12450, tipo: 0.095 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.15 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.21 }
      ],
      murcia: [
        { hasta: 12450, tipo: 0.095 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.15 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.225 }
      ],
      navarra: [
        { hasta: 10000, tipo: 0.13 },
        { hasta: 20000, tipo: 0.18 },
        { hasta: 30000, tipo: 0.23 },
        { hasta: 60000, tipo: 0.28 },
        { hasta: Infinity, tipo: 0.36 }
      ],
      pais_vasco: [
        { hasta: 14500, tipo: 0.23 },
        { hasta: 60000, tipo: 0.30 },
        { hasta: 110000, tipo: 0.39 },
        { hasta: 175000, tipo: 0.41 },
        { hasta: Infinity, tipo: 0.45 }
      ],
      valencia: [
        { hasta: 12000, tipo: 0.09 },
        { hasta: 22000, tipo: 0.12 },
        { hasta: 32000, tipo: 0.15 },
        { hasta: 42000, tipo: 0.175 },
        { hasta: 52000, tipo: 0.20 },
        { hasta: 65000, tipo: 0.225 },
        { hasta: 72000, tipo: 0.25 },
        { hasta: Infinity, tipo: 0.295 }
      ],

      generico: [
        { hasta: 12450, tipo: 0.095 },
        { hasta: 20200, tipo: 0.12 },
        { hasta: 35200, tipo: 0.15 },
        { hasta: 60000, tipo: 0.185 },
        { hasta: Infinity, tipo: 0.225 }
      ]
    }
  },

  // === Données par défaut (modifiable par l’utilisateur) ===
  defaults: {
    sueldo_bruto_anual: 30000,
    edad: 30,
    contrato: "general",
    categoria_profesional: "ingenieros",
    numero_pagas: 14, // 12, 13 ou 14 (par défaut 14)
    movilidad_geografica: false,

    situacion_familiar: {
      estado: "soltero", // "soltero" | "casado"
      tributacion_conjunta: false,
      conyuge_ingresos_bajos: false // true si <1500 €/an
    },

    hijos: [],        // { edad: x, discapacidad: bool, exclusiva: bool }
    ascendientes: [], // { edad: x, discapacidad: bool, a_cargo: bool }

    discapacidad_contribuyente: {
      grado_33_65: false,
      grado_65: false,
      movilidad_reducida: false
    }
  },


  // === Options pour UI (factorisation des listes) ===
  options: {
    numero_pagas: [12, 13, 14, 15],
    contratos: ["general", "temporal", "practicas"],
    comunidades: [
      "andalucia", "aragon", "asturias", "baleares", "canarias", "cantabria",
      "castilla_la_mancha", "castilla_leon", "catalunya", "extremadura",
      "galicia", "la_rioja", "madrid", "murcia", "navarra",
      "pais_vasco", "valencia"
    ]
  }
};