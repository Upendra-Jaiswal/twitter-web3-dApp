const key = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const secret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const JWT =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MDFjMTRiNi0yMWVhLTRjOTEtOGMzNy0wMTFhNjk4ODllOTQiLCJlbWFpbCI6ImRldmVsb3BlcnVqQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwODgyMTM3M2FhMzdkMGE3ZTcwYiIsInNjb3BlZEtleVNlY3JldCI6ImVkNTczMjI3OTMxMzI0OTdjZWNjZTc5ZTI0YjJhY2QyYjc3MzYwMTk5ZmNkODRhNjdjNTNlYjc1ZWZkYTIzNWQiLCJpYXQiOjE2ODI3OTM2MTd9.vy7HkCS3sAAKWoq2yN7PsR1_Ab8BvktPLSfG8P0kKls";

import axios from "axios";

export const pinJSONToIPFS = async (json) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, json, {
      headers: {
        Authorization: JWT,
        // pinata_api_key: key,
        // pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return response.data.IpfsHash;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const pinFileToIPFS = async (file, pinataMetaData) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();

  data.append("file", file);
  data.append("pinataMetadata", JSON.stringify(pinataMetaData));

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        Authorization: JWT,
        // pinata_api_key: key,
        // pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return response.data.IpfsHash;
    })
    .catch(function (error) {
      console.log(error);
    });
};
