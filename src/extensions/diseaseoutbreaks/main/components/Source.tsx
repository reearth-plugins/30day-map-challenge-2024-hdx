import { FC } from "react";

const Source: FC = () => {
  return (
    <div className="flex flex-col items-end justify-end flex-1 gap-1 text-right text-slate-600">
      <p className="text-xs">
        <strong>Data source:</strong>{" "}
        <a
          className="underline"
          href="https://data.humdata.org/"
          target="_black"
        >
          Humanitarian Data Exchange
        </a>
        <br />
        <a
          className="underline"
          href="https://data.humdata.org/dataset/a-global-dataset-of-pandemic-and-epidemic-prone-disease-outbreaks"
          target="_black"
        >
          Global Pandemic- and Epidemic-Prone Disease Outbreaks
        </a>
      </p>
      <p className="text-xs">Last updated at 30/09/2024</p>
      <p className="text-xs">
        <strong>Map Tile:</strong> Map tiles by Carto, under CC BY 3.0.
      </p>
      <p className="text-xs">
        <strong>Admin 0 countries:</strong>{" "}
        <a className="underline" href="https://geojson.xyz/" target="_black">
          https://geojson.xyz/
        </a>
      </p>
      <p className="text-xs">
        <strong>App:</strong>{" "}
        <a className="underline" href="https://reearth.io/" target="_black">
          Re:Earth Visualizer
        </a>
      </p>
    </div>
  );
};

export default Source;
