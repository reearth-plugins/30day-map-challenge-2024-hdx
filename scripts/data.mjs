import { readFileSync, writeFileSync } from "fs";
import path from "path";

import * as XLSX from "xlsx";
import { read } from "xlsx/xlsx.mjs";

const root = path.resolve("./");
const source = `${root}/source`;
const output = `${root}/src/data`;

const buf = readFileSync(`${source}/disease_outbreaks_HDX.xlsx`);
const workbook = read(buf);

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const jsonData = XLSX.utils.sheet_to_json(worksheet);

if (!jsonData) {
  throw new Error("No data found");
}

// Remove header row
jsonData.shift();

// Pick the data we needed
const yearlyOutbreaksCount = jsonData.reduce((acc, data) => {
  const year = data["Year"];

  if (!year) {
    return acc;
  }

  if (!acc[year]) {
    acc[year] = 0;
  }

  acc[year] += 1;

  return acc;
}, {});

writeFileSync(
  `${output}/yearlyCount.json`,
  JSON.stringify(yearlyOutbreaksCount)
);

const countryOutbreaks = jsonData.reduce((acc, data) => {
  const country = data["iso2"];
  const year = data["Year"];
  const disease = data["Disease"];

  if (!country || !year) {
    return acc;
  }

  if (!acc[year]) {
    acc[year] = {};
  }

  if (!acc[year][country]) {
    acc[year][country] = [];
  }

  acc[year][country].push(disease);

  return acc;
}, {});

writeFileSync(
  `${output}/countryOutbreaks.json`,
  JSON.stringify(countryOutbreaks)
);

// get all the contries from the data
const countries = jsonData.reduce((acc, data) => {
  const country = data["iso2"];

  if (!acc.includes(country)) {
    acc.push(country);
  }

  return acc;
}, []);

const simpleGeojson = JSON.parse(
  readFileSync(`${source}/ne_110m_admin_0_countries.geojson`)
);

const filteredGeojson = {
  type: "FeatureCollection",
  features: simpleGeojson.features.map((feature) => {
    if (!countries.includes(feature.properties.iso_a2)) return null;
    return {
      ...feature,
      properties: {
        isoA2: feature.properties.iso_a2,
        admin: feature.properties.admin,
      },
    };
  }),
};

writeFileSync(`${output}/countries.geojson`, JSON.stringify(filteredGeojson));