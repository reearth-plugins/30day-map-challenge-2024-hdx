import html from "@distui/intro/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html, { extended: true });

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
