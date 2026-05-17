import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ValleTokenModule", (m) => {
  const valle = m.contract("ValleToken");
  return { valle };
});
