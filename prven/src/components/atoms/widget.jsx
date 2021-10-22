import { Heading, VStack } from "@chakra-ui/layout";
import "./widget.css";

function Widget({ title, value }) {
  return (
    <VStack
      width="100%"
      backgroundColor="#fff4bf"
      borderRadius="xl"
      spacing="0.5"
      padding="2"
    >
      <Heading size="xs">{title || "Title"}</Heading>
      <Heading size="lg">{value || "Value"}</Heading>
    </VStack>
  );
}

export default Widget;
