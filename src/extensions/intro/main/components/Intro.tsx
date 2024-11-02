import { FC, useCallback, useEffect, useRef, useState } from "react";

const DISPLAY_TITLE = true;

const Intro: FC = () => {
  const [country, setCountry] = useState("");
  const [diseases, setDiseases] = useState<string[]>([]);

  const handleCountrySelected = useCallback(
    (payload: {
      admin: string | undefined;
      diseases: string[] | undefined;
    }) => {
      setCountry(payload.admin ?? "");
      setDiseases(payload.diseases ?? []);
    },
    []
  );

  const handleCountrySelectedRef = useRef(handleCountrySelected);
  handleCountrySelectedRef.current = handleCountrySelected;

  useEffect(() => {
    return window.addEventListener("message", (e) => {
      if (e.data.action === "countrySelected") {
        handleCountrySelectedRef.current(e.data.payload);
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {DISPLAY_TITLE && (
          <h1 className="text-3xl font-bold leading-tight text-pretty">
            Global Pandemic and Epidemic-Prone Disease Outbreaks
          </h1>
        )}
        <p className="text-xs text-slate-600 w-[400px]">
          The last version of the dataset was updated on{" "}
          <strong>30/09/2024</strong> and contains information on{" "}
          <strong>3050</strong> outbreaks, associated with <strong>85</strong>{" "}
          infectious diseases that occurred from <strong>01/01/1996</strong> to{" "}
          <strong>30/09/2024</strong> in <strong>236</strong> countries and
          territories worldwide.
        </p>

        <p className="text-xs text-slate-600 w-[400px]">
          * Click the year bar to switch the data shown in the map.
          <br />* Click the country to see the details of the outbreaks.
          <br />* Drag on earth to expore more regions.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="underline text-md">{country}</p>
        <div className="">
          {diseases.map((disease) => (
            <p className="text-xs" key={disease}>
              {disease}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Intro;
