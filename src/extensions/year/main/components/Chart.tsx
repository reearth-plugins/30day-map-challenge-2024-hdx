import { FC, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { postMsg } from "@/shared/utils";

import yearlyCount from "../../../../data/yearlyCount.json";

const chartConfig = {
  year: {
    label: "Year",
    color: "#aeb6c0",
  },
} satisfies ChartConfig;

const Chart: FC = () => {
  const [currentYear, setCurrentYear] = useState("");

  const currentCount = useMemo(
    () =>
      (currentYear
        ? yearlyCount[currentYear as keyof typeof yearlyCount]
        : "") ?? "",
    [currentYear]
  );

  const chartData = useMemo(
    () =>
      Object.entries(yearlyCount).map(([year, count]) => ({
        year,
        outbreaks: count,
        fill: year === currentYear ? "#ff7691" : "#aeb6c0",
      })),
    [currentYear]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBarClick = (data: any) => {
    setCurrentYear(data.year);
  };

  useEffect(() => {
    setTimeout(() => {
      setCurrentYear("2024");
    }, 3000);
  }, []);

  useEffect(() => {
    postMsg("updateYear", currentYear);
  }, [currentYear]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex h-[64px] flex-col gap-1 pl-1">
        <h1 className="text-3xl font-bold">{currentYear}</h1>
        {currentCount && (
          <p className="text-sm">
            <strong>{currentCount}</strong> outbreaks in global
          </p>
        )}
      </div>

      <div className="relative flex-1 w-full h-[500px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -10 }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent style={{ background: "#fff" }} />}
            />
            <Bar
              dataKey="outbreaks"
              fill="var(--color-year)"
              radius={4}
              activeBar={{
                fill: "#ff7691",
                enableBackground: 0,
                cursor: "pointer",
              }}
              onClick={handleBarClick}
            />
            <XAxis
              type="number"
              dataKey="outbreaks"
              domain={[0, "dataMax + 30"]}
              hide
            />
            <YAxis
              dataKey="year"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default Chart;
