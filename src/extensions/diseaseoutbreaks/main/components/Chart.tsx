import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { postMsg } from "@/shared/utils";

import yearlyCount from "../../../../data/yearlyCount.json";

const DISPLAY_SELCTION_SECTION = true;

const chartData = Object.entries(yearlyCount).map(([year, count]) => ({
  year,
  count,
}));

const chartConfig = {
  year: {
    label: "Year",
    color: "#cdd1d9",
  },
} satisfies ChartConfig;

const Chart: FC = () => {
  const [currentYear, setCurrentYear] = useState("");
  const [country, setCountry] = useState("");
  const [diseases, setDiseases] = useState<string[]>([]);

  const currentCount = useMemo(
    () =>
      (currentYear
        ? yearlyCount[currentYear as keyof typeof yearlyCount]
        : "") ?? "",
    [currentYear]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBarClick = (data: any) => {
    setCurrentYear(data.year);
    setCountry("");
    setDiseases([]);
  };

  useEffect(() => {
    setTimeout(() => {
      setCurrentYear("2024");
    }, 3000);
  }, []);

  useEffect(() => {
    postMsg("updateYear", currentYear);
  }, [currentYear]);

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
    <div className="flex w-1/2 h-full">
      <div className="w-3/4 h-full">
        <ChartContainer
          config={chartConfig}
          className="min-h-[100px] w-full max-h-[168px]"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              content={<ChartTooltipContent style={{ background: "#fff" }} />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-year)"
              radius={4}
              activeBar={{
                fill: "#ff7691",
                cursor: "pointer",
              }}
              onClick={handleBarClick}
            />
            <YAxis domain={[0, "dataMax + 30"]} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={45}
              interval={0}
            />
          </BarChart>
        </ChartContainer>
      </div>
      {DISPLAY_SELCTION_SECTION && (
        <div className="flex flex-col w-1/4 gap-4 pl-4 pr-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl">{currentYear}</h1>
            {currentCount && (
              <p className="text-sm">{currentCount} outbreaks in global</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm underline">{country}</p>
            <div className="max-h-[65px] overflow-auto">
              {diseases.map((disease) => (
                <p className="text-xs" key={disease}>
                  {disease}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
