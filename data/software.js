// Software and tools built or used by the group.
// `status`: "stable", "active" or "soon". Entries marked "soon" show without links.
// `links` is a list of [label, url] pairs.

window.TIMES = window.TIMES || {};

TIMES.software = [
  {
    name: "Redback",
    logo: "assets/img/redback-logo.png",
    status: "stable",
    area: "EM transients",
    description:
      "End-to-end modelling, fitting and interpretation of electromagnetic transients with Bayesian inference. " +
      "Covers supernovae, kilonovae, GRB afterglows, TDEs, magnetar-powered transients and more, with simulation tools for surveys.",
    links: [
      ["GitHub", "https://github.com/nikhil-sarin/redback"],
      ["Docs", "https://redback.readthedocs.io/en/latest/"],
      ["PyPI", "https://pypi.org/project/redback/"],
    ],
  },
  {
    name: "Redback-JAX",
    status: "active",
    area: "EM transients · JAX",
    description:
      "A JAX-native companion to Redback for fast, differentiable transient analysis on CPUs, GPUs and TPUs: " +
      "JIT-compiled, vmap-friendly supernova, shock-cooling, TDE, kilonova, magnetar and afterglow models.",
    links: [
      ["GitHub", "https://github.com/nikhil-sarin/redback-jax"],
      ["Docs", "https://redback-jax.readthedocs.io/en/latest/"],
    ],
  },
  {
    name: "Redback surrogates",
    status: "stable",
    area: "EM transients · ML",
    description:
      "Machine-learning surrogate models for EM transients, built on grids of numerical simulations. Use them on their own or through Redback.",
    links: [
      ["GitHub", "https://github.com/nikhil-sarin/redback_surrogates"],
      ["Docs", "https://redback-surrogates.readthedocs.io/en/latest/"],
    ],
  },
  {
    name: "Modular-Jim",
    status: "soon",
    area: "Gravitational waves · JAX",
    description:
      "Modular gravitational-wave parameter estimation in JAX with nested sampling. Ask us about it.",
    links: [],
  },
  {
    name: "SNAX",
    status: "soon",
    area: "TBC",
    description: "Description coming soon. Ask us about it.",   // TBC
    links: [],
  },
  {
    name: "Numbat",
    status: "soon",
    area: "TBC",
    description: "Description coming soon. Ask us about it.",   // TBC
    links: [],
  },
  {
    name: "BlackJAX nested sampling for GWs",
    status: "active",
    area: "Gravitational waves · GPU",
    description:
      "A bilby-like gravitational-wave likelihood running inside the GPU-accelerated nested sampler in blackjax-ns, " +
      "for fast GW parameter estimation.",
    links: [
      ["blackjax-ns", "https://github.com/handley-lab/blackjax"],
      ["Paper", "https://arxiv.org/abs/2509.04336"],
    ],
  },
  {
    name: "NightShift",
    status: "active",
    area: "Agentic AI",
    description:
      "An AI-driven agent manager for automating research tasks, built on Claude Code's headless mode and MCP tools, with Slack integration.",
    links: [
      ["GitHub", "https://github.com/james-alvey-42/nightshift"],
    ],
  },
];

// Tutorials and learning resources.
TIMES.tutorials = [
  {
    name: "Redback tutorials",
    description: "Example notebooks and resources from Redback developer and user calls.",
    url: "https://github.com/nikhil-sarin/tutorials",
  },
  {
    name: "Redback examples",
    description: "Worked examples for fitting and simulating transients.",
    url: "https://github.com/nikhil-sarin/redback/tree/master/examples",
  },
  {
    name: "Claude Code",
    description: "Agentic coding in the terminal. We run tutorials on using it for research. Ask on Slack.",
    url: "https://docs.claude.com/en/docs/claude-code/overview",
  },
];
