// Site-wide settings. Edit these and every page updates.
// Empty strings render as "TBC" on the site.
window.TIMES = window.TIMES || {};

TIMES.site = {
  name: "THE TIMES",
  longName: "Transient Inference & Modelling of Extreme Systems",
  institution: "Institute of Astronomy, University of Cambridge",

  meeting: {
    day: "Wednesdays",
    time: "3–4pm",
    location: "Obs. Room A",
    locationNote: "Booked for the term — may move depending on numbers.",
  },

  slack: {
    channel: "",            // e.g. "#times" — TBC
    note: "The channel already exists on the IoA Slack. Make sure you can access the IoA workspace.",
  },

  // Organiser contacts shown on the Meetings page.
  contacts: [
    { name: "Nikhil Sarin", email: "ns2043@cam.ac.uk" },
    { name: "James Alvey", email: "jbga2@cam.ac.uk" },
  ],

  github: "https://github.com/nikhil-sarin/times_group",
};
