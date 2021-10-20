import { HStack, VStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import Widget from "../../atoms/widget";
import axios from "axios";
import { useEffect, useState } from "react";

function Recap() {
  const [data, setData] = useState(null);
  async function fetchData() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_ENDPOINT + "/latest_data"
      );
      setData(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack padding="2" alignItems="start" marginBottom="1">
      <Text fontSize="small">
        Data terakhir diperbarui pada: <b>{data?.created_at || "..."}</b>
      </Text>
      <HStack width="100%">
        <Widget title="Kelembaban Tanah" value={data?.soil_str || "..."} />
        <Widget title="Ekstensometer" value={data?.extenso_str || "..."} />
      </HStack>
      <Widget title="Gyroscope" value={data?.gyro_str || "..."} />
    </VStack>
  );
}

export default Recap;
