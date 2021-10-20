import CanvasJSReact from "../external/canvasjs/canvasjs.react";
import "./chart.css";

function Chart({ title, suffix, data1, data2 }) {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    animationEnabled: true,
    zoomEnabled: true,
    exportEnabled: true,
    theme: "light2",
    height: 200,
    axisY: {
      suffix: suffix || "",
    },
    data: [
      {
        type: "line",
        color: "#ff9965",
        toolTipContent: `Waktu {x}: {y}${suffix || ""}`,
        dataPoints: data1,
      },
      {
        type: "line",
        color: "#8cd47e",
        toolTipContent: `Waktu {x}: y {y}${suffix || ""}`,
        dataPoints: data2,
      },
    ],
  };
  return (
    <div>
      <div className="chart_title">{title || "Chart Title"}</div>
      <CanvasJSChart options={options} />
    </div>
  );
}

export default Chart;