import { useInterval } from "@chakra-ui/hooks";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import endpoint from "../../helper/endpoint";
import Graph from "./home/graph";
import Recap from "./home/recap";

function Home() {
  const toast = useToast();
  const [recapData, setRecapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchRecapData() {
    try {
      const response = await axios.get(endpoint("/latest_data"), {
        timeout: 5000,
      });
      setRecapData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        position: "bottom",
        status: "error",
        duration: "3000",
        description: error.message,
      });
    }
  }

  useInterval(() => {
    fetchRecapData();
  }, 60000);

  useEffect(() => {
    fetchRecapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Recap data={recapData} isLoading={isLoading} />
      <Graph />
    </div>
  );
}

export default Home;
