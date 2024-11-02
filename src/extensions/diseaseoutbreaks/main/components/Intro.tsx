import { FC } from "react";

const DISPLAY_TITLE = true;

const Intro: FC = () => {
  return (
    <div className="flex flex-col flex-1 gap-4">
      {DISPLAY_TITLE && (
        <h1 className="text-2xl leading-tight">
          Global Pandemic and Epidemic-Prone Disease Outbreaks
        </h1>
      )}
      <p className="text-xs">
        The last version of the dataset was updated on{" "}
        <strong>30/09/2024</strong> and contains information on{" "}
        <strong>3050</strong> outbreaks, associated with <strong>85</strong>{" "}
        infectious diseases that occurred from <strong>01/01/1996</strong> to{" "}
        <strong>30/09/2024</strong> in <strong>236</strong> countries and
        territories worldwide.
      </p>
    </div>
  );
};

export default Intro;
