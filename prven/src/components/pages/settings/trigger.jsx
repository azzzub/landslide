import axios from "axios";
import { useEffect } from "react";

function SettingTrigger() {
  async function checkConnection() {
    const result = await axios.get("https://landslide.id/v1/trg");
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
