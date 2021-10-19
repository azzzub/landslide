import { HStack, VStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import Widget from "../../atoms/widget";

function Recap({ data }) {
  return (
    <VStack padding="2" alignItems="start" marginBottom="1">
      <Text fontSize="small">
        Data terakhir diperbarui pada: <b>{data?.latestUpdate || "datetime"}</b>
      </Text>
      <HStack width="100%">
        <Widget title="Kelembaban Tanah" value="70%" />
        <Widget title="Ekstensometer" value="100 cm" />
      </HStack>
      <Widget title="Gyroscope" value="x: 10° y: 300°" />
    </VStack>
  );
}

export default Recap;
