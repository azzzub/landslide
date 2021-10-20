import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Chart from "../../atoms/chart";
import axios from "axios";
import "./graph.css";

function Graph() {
  const [data, setData] = useState([
    {
      x: 1,
      y: 2,
    },
  ]);
  const [filterActive, setFilterActive] = useState(4);
  const filter = [
    { id: 1, title: "Hari" },
    { id: 2, title: "Minggu" },
    { id: 3, title: "Bulan" },
    { id: 4, title: "Tahun" },
  ];

  async function fetchData() {
    try {
      const result = await axios.get(process.env.REACT_APP_ENDPOINT + "/data");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

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
      <Chart title="Kelembaban Tanah" suffix="%" data1={data} />
      <Chart title="Ekstensometer" suffix=" cm" data1={data} />
      <Chart title="Gyroscope" suffix="°" data1={data} data2={data} />
    </div>
  );
}

export default Graph;
