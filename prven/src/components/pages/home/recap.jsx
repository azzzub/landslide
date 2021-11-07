import { HStack, VStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { CircularProgress } from "@chakra-ui/progress";
import Widget from "../../atoms/widget";

function Recap({ data, isLoading }) {
  return (
    <VStack padding="2" alignItems="start" marginBottom="1">
      <HStack width="100%" justifyContent="space-between">
        <Text fontSize="small">
          Data terakhir diperbarui pada: <b>{data?.created_at || "..."}</b>
        </Text>
        <CircularProgress
          isIndeterminate
          color="orange"
          size={4}
          display={!isLoading && "none"}
        />
      </HStack>
      <HStack width="100%">
        <Widget title="Kelembaban Tanah" value={data?.soil_str || "..."} />
        <Widget title="Ekstensometer" value={data?.extenso_str || "..."} />
      </HStack>
      <Widget title="Water Level" value={data?.waterlevel_str || "..."} />
      <Widget title="Gyroscope" value={data?.gyro_str || "..."} />
    </VStack>
  );
}

export default Recap;
