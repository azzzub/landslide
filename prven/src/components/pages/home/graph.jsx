import { Button } from "@chakra-ui/button";
import { useInterval } from "@chakra-ui/hooks";
import { HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import endpoint from "../../../helper/endpoint";
import Chart from "../../atoms/chart";
import "./graph.css";

function Graph() {
  const toast = useToast();
  const [graphData, setGraphData] = useState(null);
  const [filterActive, setFilterActive] = useState("");

  const filter = [
    { sub: "/day", title: "Hari" },
    { sub: "/week", title: "Minggu" },
    { sub: "/month", title: "Bulan" },
    { sub: "/year", title: "Tahun" },
  ];

  async function fetchGraphData(sub = "") {
    try {
      const response = await axios.get(endpoint(`/data4graph${sub}`), {
        timeout: 5000,
      });
      setGraphData(response.data);
    } catch (error) {
      toast({
        position: "bottom",
        status: "error",
        duration: "3000",
        description: error.message,
      });
    }
  }

  useInterval(() => {
    fetchGraphData(filterActive);
  }, 60000);

  useEffect(() => {
    fetchGraphData(filterActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterActive]);

  return (
    <div className="graph_container">
      <HStack paddingBottom="1">
        {filter.map((e) => (
          <Button
            w="100%"
            key={e.sub}
            colorScheme={e.sub === filterActive ? "orange" : "gray"}
            onClick={() => {
              setFilterActive(e.sub);
            }}
          >
            {e.title}
          </Button>
        ))}
      </HStack>
      <Chart
        title="Kelembaban Tanah"
        suffix="%"
        data1={graphData?.soil || []}
      />
      <Chart
        title="Ekstensometer"
        suffix=" cm"
        data1={graphData?.extenso || []}
      />
      <Chart
        title="Water Level"
        suffix=" cm"
        data1={graphData?.waterlevel || []}
      />
      <Chart
        title="Gyroscope"
        suffix="°"
        data1={graphData?.gyro?.x || []}
        data2={graphData?.gyro?.y || []}
      />
    </div>
  );
}

export default Graph;
