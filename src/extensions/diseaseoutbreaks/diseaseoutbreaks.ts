/* eslint-disable @typescript-eslint/no-explicit-any */
import html from "@distui/diseaseoutbreaks/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

import countriesGeojsonRaw from "../../data/countries.geojson?raw";
import countryOutbreaks from "../../data/countryOutbreaks.json";

const countriesGeojson = JSON.parse(countriesGeojsonRaw);

type Msg =
  | {
      action: "init";
    }
  | {
      action: "updateYear";
      payload: string;
    };

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html, { extended: true });

// status
let currentYear: string;
const layerId = reearth.layers.add({
  type: "simple",
  data: {
    type: "geojson",
    value: {
      type: "FeatureCollection",
      features: [],
    },
  },
  polygon: {
    fillColor: {
      expression: {
        conditions: [
          ["${diseasesCount} === 0", "color('#ff000000')"],
          ["${diseasesCount} === 1", "color('#ff000011')"],
          ["${diseasesCount} === 2", "color('#ff000022')"],
          ["${diseasesCount} === 3", "color('#ff000033')"],
          ["${diseasesCount} === 4", "color('#ff000044')"],
          ["${diseasesCount} === 5", "color('#ff000055')"],
          ["${diseasesCount} === 6", "color('#ff000066')"],
          ["${diseasesCount} === 7", "color('#ff000077')"],
          ["${diseasesCount} === 8", "color('#ff000088')"],
          ["${diseasesCount} === 9", "color('#ff000099')"],
          ["true", "color('#ffffff00')"],
        ],
      },
    },
    hideIndicator: true,
    selectedFeatureColor: "#ff0000",
  },
});

const updateYear = (year: string) => {
  if (!layerId) return;
  if (currentYear === year || !year) return;
  const data = countryOutbreaks[year as keyof typeof countryOutbreaks];
  if (!data) return;

  // generate geojson
  const geojson = {
    type: "FeatureCollection",
    features: Object.entries(data)
      .map(([country, diseases]) => {
        const countryFeature = countriesGeojson.features.find(
          (f: any) => f?.properties?.isoA2 === country
        );
        if (!countryFeature) return null;
        return {
          ...countryFeature,
          properties: {
            ...countryFeature.properties,
            diseases,
            diseasesCount: diseases.length,
          },
        };
      })
      .filter(Boolean),
  };

  reearth.layers.override?.(layerId, {
    data: {
      type: "geojson",
      value: geojson,
    },
  });
};

const init = () => {
  reearth.viewer.overrideProperty({
    scene: {
      mode: "2d",
      backgroundColor: "#D5DADC",
    },
    tiles: [
      {
        id: "1",
        type: "url",
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      },
    ],
  });
};

// Get message from UI
reearth.extension.on("message", (msg: Msg) => {
  if (msg.action === "init") {
    init();
  } else if (msg.action === "updateYear") {
    updateYear(msg.payload);
  }
});

reearth.layers.on("select", () => {
  const feature = reearth.layers.selectedFeature;
  reearth.ui.postMessage({
    action: "countrySelected",
    payload: {
      admin: feature?.properties?.admin,
      diseases: feature?.properties?.diseases,
    },
  });
});
