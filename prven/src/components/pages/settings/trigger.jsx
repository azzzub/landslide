import axios from "axios";
import { useEffect } from "react";

function SettingTrigger() {
  async function checkConnection() {
    const result = await axios.get("http://landslide.id/v1/trg", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
    });
    console.log(result.data);
  }
  useEffect(() => {
    checkConnection();
  }, []);
  return (
    <div>
      Setting Trigger
      <div>123</div>
    </div>
  );
}

export default SettingTrigger;
