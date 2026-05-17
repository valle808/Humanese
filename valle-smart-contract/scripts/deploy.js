import hre from "hardhat";

async function main() {
  console.log("Initiating Autonomous ValleToken Deployment...");

  // We get the contract to deploy
  const ValleToken = await hre.ethers.getContractFactory("ValleToken");
  const valle = await ValleToken.deploy();

  await valle.waitForDeployment();

  const address = await valle.getAddress();
  console.log("ValleToken officially deployed to:", address);
  console.log("Total Supply minted: 100,000,000 VALLE");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
