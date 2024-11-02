import html from "@distui/credits/main/index.html?raw";

import { GlobalThis } from "@/shared/reearthTypes";

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html, { extended: true });
