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

// clean up layers
reearth.layers.layers.forEach((l) => reearth.layers.delete?.(l.id));

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
          ["${diseasesCount} === 1", "color('#ff002255')"],
          ["${diseasesCount} === 2", "color('#ff002266')"],
          ["${diseasesCount} === 3", "color('#ff002277')"],
          ["${diseasesCount} === 4", "color('#ff002288')"],
          ["${diseasesCount} === 5", "color('#ff002299')"],
          ["${diseasesCount} === 6", "color('#ff0022aa')"],
          ["${diseasesCount} === 7", "color('#ff0022bb')"],
          ["${diseasesCount} === 8", "color('#ff0022cc')"],
          ["${diseasesCount} === 9", "color('#ff0022dd')"],
          ["${diseasesCount} === 10", "color('#ff0022ee')"],
          ["true", "color('#ffffff00')"],
        ],
      },
    },
    stroke: true,
    strokeColor: "#D5DADC",
    hideIndicator: true,
    selectedFeatureColor: "#ff002fff",
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
    sky: {
      skyBox: {
        show: false,
      },
      skyAtmosphere: {
        show: false,
      },
      sun: {
        show: false,
      },
      moon: {
        show: false,
      },
    },
    tiles: [
      {
        id: "1",
        type: "url",
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      },
    ],
    render: {
      antialias: "high",
    },
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
