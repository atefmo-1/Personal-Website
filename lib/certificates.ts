import { siDatacamp, type SimpleIcon } from "simple-icons";

export type Certificate = {
  name: string;
  issuer: string;
  icon?: SimpleIcon;
  url: string;
  issued: string;
};

// Most recent first.
export const certificates: Certificate[] = [
  {
    name: "Associate Data Engineer in SQL",
    issuer: "DataCamp",
    icon: siDatacamp,
    url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/a1a2bc2649d30215ed4048cab6147a2a8c0a0590",
    issued: "Jun 2025",
  },
];
