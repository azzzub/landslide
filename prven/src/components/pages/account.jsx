import { Avatar, Text } from "@chakra-ui/react";
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
        name={email || "admin@landslide.id"}
        marginBottom="2"
      />
      <Text fontSize="lg" fontWeight="semibold">
        {email || "admin@landslide.id"}
      </Text>
      <div className="account_type">{planStatus(plan || 0)}</div>
    </div>
  );
}

export default Account;
