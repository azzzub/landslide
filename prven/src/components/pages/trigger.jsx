import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { HStack, Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import endpoint from "../../helper/endpoint";
import Cookies from "universal-cookie";
import { useHistory } from "react-router";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Switch } from "@chakra-ui/switch";
import { CircularProgress } from "@chakra-ui/progress";

const cookies = new Cookies();

function Trigger() {
  const toast = useToast();
  const history = useHistory();
  const [soil, setSoil] = useState("");
  const [extenso, setExtenso] = useState("");
  const [gyroX, setGyroX] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function putTrigger() {
    setIsLoading(true);
    try {
      const response = await axios.put(
        endpoint("/trigger"),
        {
          soil,
          extenso,
          gyro_x: gyroX,
          gyro_y: gyroY,
          time,
          active,
        },
        {
          timeout: 5000,
          headers: {
            authorization: "Bearer " + cookies.get("access_token"),
          },
        }
      );

      setIsLoading(false);

      toast({
        position: "bottom",
        status: "success",
        duration: "3000",
        description: response.data?.message,
      });
    } catch (error) {
      toast({
        position: "bottom",
        status: "error",
        duration: "3000",
        description: error.message,
      });
      setIsLoading(false);
    }
  }

  async function fetchTrigger() {
    setIsLoading(true);
    try {
      const response = await axios.get(endpoint("/trigger"), {
        timeout: 5000,
        headers: {
          authorization: "Bearer " + cookies.get("access_token"),
        },
      });

      const { active, time, s, e, x, y } = response.data;

      setActive(active);
      setTime(time);
      setSoil(s);
      setExtenso(e);
      setGyroX(x);
      setGyroY(y);

      setIsLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        history.push("/masuk");
        toast({
          position: "bottom",
          status: "error",
          duration: "3000",
          description: "Masuk akun terlebih dahulu",
        });
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTrigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <Stack
        width="100%"
        height="calc(100vh - 50px)"
        backgroundColor="#a0a0a0a0"
        top="0"
        position="absolute"
        zIndex="999"
        justify="center"
        align="center"
        visibility={isLoading ? "visible" : "hidden"}
      >
        <CircularProgress isIndeterminate color="orange" />
      </Stack>
      <Stack padding="2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            putTrigger();
          }}
        >
          <FormControl id="soil" isRequired>
            <FormLabel>Kelembaban Tanah (%)</FormLabel>
            <NumberInput
              defaultValue={0}
              min={0}
              max={100}
              precision={2}
              step={0.5}
              value={soil}
              onChange={(_, value) => setSoil(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="extenso" isRequired marginTop="2">
            <FormLabel>Ekstensometer (cm)</FormLabel>
            <NumberInput
              defaultValue={0}
              min={0}
              precision={2}
              step={0.5}
              value={extenso}
              onChange={(_, value) => setExtenso(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="gyroX" isRequired marginTop="2">
            <FormLabel>Gyroscope X (°)</FormLabel>
            <NumberInput
              min={-500}
              max={500}
              defaultValue={0}
              precision={2}
              step={0.5}
              value={gyroX}
              onChange={(_, value) => setGyroX(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="gyroY" isRequired marginTop="2">
            <FormLabel>Gyroscope Y (°)</FormLabel>
            <NumberInput
              min={-500}
              max={500}
              defaultValue={0.0}
              precision={2}
              step={0.5}
              value={gyroY}
              onChange={(_, value) => setGyroY(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="time" isRequired marginTop="2">
            <FormLabel>Waktu Alarm Aktif (detik)</FormLabel>
            <NumberInput
              defaultValue={30}
              min={1}
              precision={0}
              step={1}
              value={time}
              onChange={(_, value) => setTime(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl marginTop="4">
            <HStack justify="space-between">
              <FormLabel mb="0">Aktifkan Trigger?</FormLabel>
              <Switch
                id="active"
                size="lg"
                colorScheme="orange"
                isChecked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </HStack>
          </FormControl>
          <Button
            type="submit"
            marginTop="8"
            colorScheme="orange"
            isLoading={isLoading}
            width="100%"
            leftIcon={<FaSave />}
          >
            Simpan
          </Button>
        </form>
      </Stack>
    </Stack>
  );
}

export default Trigger;
