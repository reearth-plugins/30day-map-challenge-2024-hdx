import { Card } from "@/shared/components/ui/card";

import Chart from "./components/Chart";
import Intro from "./components/Intro";
import Source from "./components/Source";
import useHooks from "./hooks";

function App() {
  useHooks();

  return (
    <Card className="text-slate-700 bg-[#ffffffcc]">
      <div className="flex gap-2 p-4 max-h-[200px] box-border">
        <Intro />
        <Chart />
        <Source />
      </div>
    </Card>
  );
}

export default App;
