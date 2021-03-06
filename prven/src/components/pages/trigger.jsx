import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Checkbox } from "@chakra-ui/react";
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
import { InputGroup, InputLeftAddon } from "@chakra-ui/input";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import Loading from "../atoms/loading";

const cookies = new Cookies();

function Trigger() {
  const toast = useToast();
  const history = useHistory();
  const [soil, setSoil] = useState(0);
  const [extenso, setExtenso] = useState(0);
  const [waterlevel, setWaterlevel] = useState(0);
  const [gyroX, setGyroX] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const [ignoreCheckbox, setIgnoreCheckbox] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
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
          waterlevel,
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

      await fetchTrigger();

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

      const { active, time, s, e, x, y, wl } = response.data;

      setActive(active);
      setTime(time);
      setSoil(s);
      setExtenso(e);
      setWaterlevel(wl);
      setGyroX(x);
      setGyroY(y);

      let _ignore = [...ignoreCheckbox];
      if (s === 0) {
        _ignore[0] = true;
      }
      if (e === 0) {
        _ignore[1] = true;
      }
      if (wl === 999) {
        _ignore[2] = true;
      }
      if (x === -500) {
        _ignore[3] = true;
      }
      if (y === -500) {
        _ignore[4] = true;
      }

      setIgnoreCheckbox(_ignore);

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
    <>
      {isLoading && (
        <Stack
          width="100%"
          height="100%"
          backgroundColor="#a0a0a0a0"
          top="0"
          position="absolute"
          zIndex="999"
          justify="center"
          align="center"
        >
          <Loading />
        </Stack>
      )}
      <Stack padding="2">
        <Alert status="info">
          <AlertIcon />
          Parameter trigger dapat diabaikan dengan mencentangnya
        </Alert>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            putTrigger();
          }}
        >
          <FormControl id="soil" isRequired>
            <HStack justify="space-between">
              <FormLabel>Kelembaban Tanah (%)</FormLabel>
              <Checkbox
                colorScheme="orange"
                paddingBottom="2"
                isChecked={ignoreCheckbox[0]}
                onChange={(e) => {
                  let _ignore = [...ignoreCheckbox];
                  _ignore[0] = e.target.checked;
                  setIgnoreCheckbox(_ignore);
                  setSoil(0);
                }}
              >
                Abaikan
              </Checkbox>
            </HStack>
            <InputGroup>
              <InputLeftAddon children=">" />
              <NumberInput
                width="full"
                defaultValue={0}
                min={0}
                max={100}
                precision={2}
                step={0.5}
                value={soil}
                onChange={(_, value) => setSoil(value)}
                isDisabled={ignoreCheckbox[0]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
          <FormControl id="extenso" isRequired marginTop="2">
            <HStack justify="space-between">
              <FormLabel>Ekstensometer (cm)</FormLabel>
              <Checkbox
                colorScheme="orange"
                paddingBottom="2"
                isChecked={ignoreCheckbox[1]}
                onChange={(e) => {
                  let _ignore = [...ignoreCheckbox];
                  _ignore[1] = e.target.checked;
                  setIgnoreCheckbox(_ignore);
                  setExtenso(0);
                }}
              >
                Abaikan
              </Checkbox>
            </HStack>
            <InputGroup>
              <InputLeftAddon children=">" />
              <NumberInput
                width="full"
                defaultValue={0}
                min={0}
                precision={2}
                step={0.5}
                value={extenso}
                onChange={(_, value) => setExtenso(value)}
                isDisabled={ignoreCheckbox[1]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
          <FormControl id="waterlevel" isRequired marginTop="2">
            <HStack justify="space-between">
              <FormLabel>Water Level (cm)</FormLabel>
              <Checkbox
                colorScheme="orange"
                paddingBottom="2"
                isChecked={ignoreCheckbox[2]}
                onChange={(e) => {
                  let _ignore = [...ignoreCheckbox];
                  _ignore[2] = e.target.checked;
                  setIgnoreCheckbox(_ignore);
                  setWaterlevel(999);
                }}
              >
                Abaikan
              </Checkbox>
            </HStack>
            <InputGroup>
              <InputLeftAddon children="<" />
              <NumberInput
                width="full"
                defaultValue={0}
                min={0}
                precision={2}
                step={0.5}
                value={waterlevel}
                onChange={(_, value) => setWaterlevel(value)}
                isDisabled={ignoreCheckbox[2]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
          <FormControl id="gyroX" isRequired marginTop="2">
            <HStack justify="space-between">
              <FormLabel>Gyroscope X (??)</FormLabel>
              <Checkbox
                colorScheme="orange"
                paddingBottom="2"
                isChecked={ignoreCheckbox[3]}
                onChange={(e) => {
                  let _ignore = [...ignoreCheckbox];
                  _ignore[3] = e.target.checked;
                  setIgnoreCheckbox(_ignore);
                  setGyroX(-500);
                }}
              >
                Abaikan
              </Checkbox>
            </HStack>
            <InputGroup>
              <InputLeftAddon children=">" />
              <NumberInput
                width="full"
                min={-500}
                max={500}
                defaultValue={0}
                // precision={2}
                // step={0.5}
                value={gyroX}
                onChange={(_, value) => setGyroX(value)}
                isDisabled={ignoreCheckbox[3]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>
          <FormControl id="gyroY" isRequired marginTop="2">
            <HStack justify="space-between">
              <FormLabel>Gyroscope Y (??)</FormLabel>
              <Checkbox
                colorScheme="orange"
                paddingBottom="2"
                isChecked={ignoreCheckbox[4]}
                onChange={(e) => {
                  let _ignore = [...ignoreCheckbox];
                  _ignore[4] = e.target.checked;
                  setIgnoreCheckbox(_ignore);
                  setGyroY(-500);
                }}
              >
                Abaikan
              </Checkbox>
            </HStack>
            <InputGroup>
              <InputLeftAddon children=">" />
              <NumberInput
                width="full"
                min={-500}
                max={500}
                defaultValue={0.0}
                // precision={2}
                // step={0.5}
                value={gyroY}
                onChange={(_, value) => setGyroY(value)}
                isDisabled={ignoreCheckbox[4]}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
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
            marginTop="5"
            marginBottom="2"
            colorScheme="orange"
            isLoading={isLoading}
            width="100%"
            leftIcon={<FaSave />}
          >
            Simpan
          </Button>
        </form>
      </Stack>
    </>
  );
}

export default Trigger;
