import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";
import endpoint from "../../helper/endpoint";
import Cookies from "universal-cookie";
import { useHistory } from "react-router";

const cookies = new Cookies();

function Login() {
  const toast = useToast();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchLogin() {
    setIsLoading(true);
    try {
      const response = await axios.post(
        endpoint("/login"),
        {
          email,
          password,
        },
        {
          timeout: 5000,
        }
      );

      cookies.set("access_token", response.data?.access_token, { path: "/" });
      history.push("/");

      setIsLoading(false);
    } catch (error) {
      toast({
        position: "bottom",
        status: "error",
        duration: "3000",
        description: "Periksa kembali informasi Anda",
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (cookies.get("access_token")) {
      history.push("/");
    }
    return cookies;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack paddingTop="6" paddingX="4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchLogin();
        }}
      >
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaEnvelope color="gray" />}
            />
            <Input
              placeholder="akunmu@gmail.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired marginTop="2">
          <FormLabel>Kata Sandi</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaKey color="gray" />}
            />
            <Input
              placeholder="katasandi123"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
        </FormControl>
        <Button
          type="submit"
          marginTop="8"
          colorScheme="orange"
          isLoading={isLoading}
          width="100%"
        >
          Masuk
        </Button>
      </form>
    </Stack>
  );
}

export default Login;
