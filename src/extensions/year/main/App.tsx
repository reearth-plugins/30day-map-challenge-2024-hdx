import Chart from "./components/Chart";
import useHooks from "./hooks";

function App() {
  useHooks();

  return (
    <div className="w-full h-full p-4 text-slate-700">
      <Chart />
    </div>
  );
}

export default App;
