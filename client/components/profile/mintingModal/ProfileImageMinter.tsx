import { useState, useContext } from "react";
import { TwitterContext } from "../../../context/TwitterContext";
import { useRouter } from "next/router";
import { client } from "../../../lib/client";
import { contractABI, contractAddress } from "../../../lib/constants";
import { ethers } from "ethers";
import InitialState from "./InitialState";
import LoadingState from "./LoadingState";
import FinishedState from "./FinishedState";
import { pinJSONToIPFS, pinFileToIPFS } from "../../../lib/pinata";
//import Web3 from "Web3";
//const ethers = require("ethers");

//const ethers = require("ethers");
<div>
  <script src="https://cdn.jsdelivr.net/npm/bignumber.js@9.0.2/bignumber.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.3/web3.min.js"></script>
  <script
    src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
    type="application/javascript"
  ></script>
</div>;

declare let window: any;

let metamask: any;
let obj: any;

if (typeof window !== "undefined") {
  metamask = window.ethereum;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
}

interface HeaderObject {
  key: string | undefined;
  value: string | undefined;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(metamask);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

const createPinataRequestHeaders = (headers: Array<HeaderObject>) => {
  const requestHeaders: HeadersInit = new Headers();

  headers.forEach((header: any) => {
    requestHeaders.append(header.key, header.value);
  });

  return requestHeaders;
};

const ProfileImageMinter = () => {
  const { currentAccount, setAppStatus } = useContext(TwitterContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("initial");
  const [profileImage, setProfileImage] = useState<File>();

  const mint = async () => {
    if (!name || !description || !profileImage) return;
    setStatus("loading");

    const pinataMetaData = {
      name: `${name} - ${description}`,
    };

    const ipfsImageHash = await pinFileToIPFS(profileImage, pinataMetaData);

    await client
      .patch(currentAccount)
      .set({ profileImage: ipfsImageHash })
      .set({ isProfileImageNft: true })
      .commit();

    const imageMetaData: Metadata = {
      name: name,
      description: description,
      image: `ipfs://${ipfsImageHash}`,
    };

    const ipfsJsonHash = await pinJSONToIPFS(imageMetaData);

    const contract = await getEthereumContract();

    const transactionParameters = {
      from: currentAccount,
      to: contractAddress,

      data: await contract.mint(currentAccount, `ipfs://${ipfsJsonHash}`),
    };

    // console.log(contractAddress);
    // console.log(currentAccount);
    //   obj = JSON.parse(JSON.stringify(transactionParameters));
    //let myObj = JSON.stringify(transactionParameters.to);
    try {
      await metamask.request({
        method: "eth_sendTransaction",

        params: [transactionParameters],
      });

      setStatus("finished");
    } catch (error: any) {
      console.log(error);
      //   console.log("this is " + myObj);
      setStatus("finished");
    }
  };
  console.log("address" + contractAddress);
  console.log("account" + currentAccount);

  // const confirmationsString = JSON.stringify(confirmations);

  // window.postMessage({ confirmations: confirmationsString }, "*");

  // window.addEventListener("message", (event) => {
  //   const confirmations = JSON.parse(event.data.confirmations);

  //   // Use confirmations object here...
  // });

  const renderLogic = (modalStatus = status) => {
    switch (modalStatus) {
      case "initial":
        return (
          <InitialState
            profileImage={profileImage!}
            setProfileImage={setProfileImage}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            mint={mint}
          />
        );

      case "loading":
        return <LoadingState />;

      case "finished":
        return <FinishedState />;

      default:
        router.push("/");
        setAppStatus("error");
        break;
    }
  };

  return <>{renderLogic()}</>;
};

export default ProfileImageMinter;
