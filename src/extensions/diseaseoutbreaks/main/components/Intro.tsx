import { FC } from "react";

const Intro: FC = () => {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <h1 className="text-2xl leading-tight">
        Global Pandemic and Epidemic-Prone Disease Outbreaks
      </h1>
      <p className="text-xs">
        The last version of the dataset was updated on 30/09/2024 and contains
        information on 3050 outbreaks, associated with 85 infectious diseases
        that occurred from 01/01/1996 to 30/09/2024 in 236 countries and
        territories worldwide.
      </p>
    </div>
  );
};

export default Intro;
