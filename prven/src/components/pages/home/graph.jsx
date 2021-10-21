import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import { useState } from "react";
import Chart from "../../atoms/chart";
import "./graph.css";

function Graph() {
  const dummy1 = [
    { x: 1, y: 2, c_at: "12" },
    { x: 2, y: 4, c_at: "13" },
    { x: 3, y: 5, c_at: "14" },
    { x: 4, y: 3, c_at: "15" },
    { x: 5, y: 2, c_at: "16" },
  ];
  const dummy2 = [
    { x: 1, y: 4 },
    { x: 2, y: 5 },
    { x: 3, y: 2 },
    { x: 4, y: 1 },
    { x: 5, y: 3 },
  ];
  const [filterActive, setFilterActive] = useState(4);
  const filter = [
    { id: 1, title: "Hari" },
    { id: 2, title: "Minggu" },
    { id: 3, title: "Bulan" },
    { id: 4, title: "Tahun" },
  ];
  return (
    <div className="graph_container">
      <HStack paddingBottom="1">
        {filter.map((e) => (
          <Button
            w="100%"
            key={e.id}
            colorScheme={e.id === filterActive ? "orange" : "gray"}
            // color={e.id === filterActive && "white"}
            onClick={() => setFilterActive(e.id)}
          >
            {e.title}
          </Button>
        ))}
      </HStack>
      <Chart title="Kelembaban Tanah" suffix="%" data1={dummy1} />
      <Chart title="Ekstensometer" suffix=" cm" data1={dummy1} />
      <Chart title="Gyroscope" suffix="°" data1={dummy1} data2={dummy2} />
    </div>
  );
}

export default Graph;
