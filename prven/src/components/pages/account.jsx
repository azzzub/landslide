import { Avatar, Text, Tooltip } from "@chakra-ui/react";
import "./account.css";

function planStatus(planId) {
  switch (planId) {
    case 1:
      return "PEMILIK";
    default:
      return "PENGGUNA";
  }
}

function Account({ email, plan }) {
  return (
    <div className="account_container">
      <Avatar
        size="xl"
        bg="#ffb54c"
        name={email || "email@landslide.id"}
        marginBottom="2"
      />
      <Text fontSize="lg" fontWeight="semibold">
        {email || "email@landslide.id"}
      </Text>
      <Tooltip label="Hey, I'm here!" aria-label="A tooltip">
        <div className="account_type">{planStatus(plan || 0)}</div>
      </Tooltip>
    </div>
  );
}

export default Account;
