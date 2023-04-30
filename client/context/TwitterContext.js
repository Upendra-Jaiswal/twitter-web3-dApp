import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { client } from '../lib/client'

export const TwitterContext = createContext()

export const TwitterProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentUser, setCurrentUser] = useState({})
  const [tweets, setTweets] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    if (!currentAccount && appStatus == 'connected') return
    getCurrentUserDetails(currentAccount)
    fetchTweets()
  }, [currentAccount, appStatus])

  /**
   * Checks if there is an active wallet connection
   */
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        setAppStatus('connected')
        setCurrentAccount(addressArray[0])

        createUserAccount(addressArray[0])
      } else {
        router.push('/')
        setAppStatus('notConnected')
      }
    } catch (err) {
      router.push('/')
      setAppStatus('error')
    }
  }

  /**
   * Initiates MetaMask wallet connection
   */
  const connectWallet = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      setAppStatus('loading')

      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0])
        createUserAccount(addressArray[0])
      } else {
        router.push('/')
        setAppStatus('notConnected')
      }
    } catch (err) {
      setAppStatus('error')
    }
  }

  /**
   * Creates an account in Sanity DB if the user does not already have one
   * @param {String} userAddress Wallet address of the currently logged in user
   */
  const createUserAccount = async (userAddress = currentAccount) => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      const userDoc = {
        _type: 'users',
        _id: userAddress,
        name: 'Unnamed',
        isProfileImageNft: false,
        profileImage:
          'https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg',
        walletAddress: userAddress,
      }

      await client.createIfNotExists(userDoc)

      setAppStatus('connected')
    } catch (error) {
      router.push('/')
      setAppStatus('error')
    }
  }

  /**
   * Generates NFT profile picture URL or returns the image URL if it's not an NFT
   * @param {String} imageUri If the user has minted a profile picture, an IPFS hash; if not then the URL of their profile picture
   * @param {Boolean} isNft Indicates whether the user has minted a profile picture
   * @returns A full URL to the profile picture
   */
  const getNftProfileImage = async (imageUri, isNft) => {
    if (isNft) {
      return `https://gateway.pinata.cloud/ipfs/${imageUri}`
    } else if (!isNft) {
      return imageUri
    }
  }

  /**
   * Gets all the tweets stored in Sanity DB.
   */
  const fetchTweets = async () => {
    const query = `
      *[_type == "tweets"]{
        "author": author->{name, walletAddress, profileImage, isProfileImageNft},
        tweet,
        timestamp
      }|order(timestamp desc)
    `

    // setTweets(await client.fetch(query))

    const sanityResponse = await client.fetch(query)

    setTweets([])

    /**
     * Async await not available with for..of loops.
     */
    sanityResponse.forEach(async item => {
      const profileImageUrl = await getNftProfileImage(
        item.author.profileImage,
        item.author.isProfileImageNft,
      )

      if (item.author.isProfileImageNft) {
        const newItem = {
          tweet: item.tweet,
          timestamp: item.timestamp,
          author: {
            name: item.author.name,
            walletAddress: item.author.walletAddress,
            profileImage: profileImageUrl,
            isProfileImageNft: item.author.isProfileImageNft,
          },
        }

        setTweets(prevState => [...prevState, newItem])
      } else {
        setTweets(prevState => [...prevState, item])
      }
    })
  }

  /**
   * Gets the current user details from Sanity DB.
   * @param {String} userAccount Wallet address of the currently logged in user
   * @returns null
   */
  const getCurrentUserDetails = async (userAccount = currentAccount) => {
    if (appStatus !== 'connected') return

    const query = `
      *[_type == "users" && _id == "${userAccount}"]{
        "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
        name,
        profileImage,
        isProfileImageNft,
        coverImage,
        walletAddress
      }
    `
    const response = await client.fetch(query)

    const profileImageUri = await getNftProfileImage(
      response[0].profileImage,
      response[0].isProfileImageNft,
    )

    setCurrentUser({
      tweets: response[0].tweets,
      name: response[0].name,
      profileImage: profileImageUri,
      walletAddress: response[0].walletAddress,
      coverImage: response[0].coverImage,
      isProfileImageNft: response[0].isProfileImageNft,
    })
  }

  return (
    <TwitterContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectWallet,
        tweets,
        fetchTweets,
        setAppStatus,
        getNftProfileImage,
        currentUser,
        getCurrentUserDetails,
      }}
    >
      {children}
    </TwitterContext.Provider>
  )
}

// import { createContext, useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { client } from "../lib/client";

// export const TwitterContext = createContext();

// export const TwitterProvider = ({ children }) => {
//   const [appStatus, setAppStatus] = useState("");
//   const [currentAccount, setCurrentAccount] = useState("");
//   //   const [currentUser, setCurrentUser] = useState({});
//   const [tweets, setTweets] = useState([]);

//   const router = useRouter();

//   useEffect(() => {
//     checkIfWalletIsConnected();
//   }, []);

//     useEffect(() => {
//       if (!currentAccount && appStatus == "connected") return;
//       getCurrentUserDetails(currentAccount);
//       //   fetchTweets();
//     }, [currentAccount, appStatus]);

//   /**
//    * Checks if there is an active wallet connection
//    */
//   const checkIfWalletIsConnected = async () => {
//     if (!window.ethereum) return setAppStatus("noMetaMask");
//     try {
//       const addressArray = await window.ethereum.request({
//         method: "eth_accounts",
//       });
//       if (addressArray.length > 0) {
//         setAppStatus("connected");
//         setCurrentAccount(addressArray[0]);
//         createUserAccount(addressArray[0]);
//       } else {
//         router.push("/");
//         setAppStatus("notConnected");
//       }
//     } catch (err) {
//       router.push("/");
//       // setAppStatus("error");
//       setAppStatus("connected");
//     }
//   };

//   /**
//    * Initiates MetaMask wallet connection
//    */
//   const connectToWallet = async () => {
//     if (!window.ethereum) return setAppStatus("noMetaMask");
//     try {
//       setAppStatus("loading");

//       const addressArray = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       if (addressArray.length > 0) {
//         setCurrentAccount(addressArray[0]);
//         createUserAccount(addressArray[0]);
//       } else {
//         router.push("/");
//         setAppStatus("notConnected");
//       }
//     } catch (err) {
//       // setAppStatus("error");
//       setAppStatus("connected");
//     }
//   };

//   /**
//    * Creates an account in Sanity DB if the user does not already have one
//    * @param {String} userAddress Wallet address of the currently logged in user
//    */
//   const createUserAccount = async (userAddress = currentAccount) => {
//     if (!window.ethereum) return setAppStatus("noMetaMask");
//     try {
//       const userDoc = {
//         _type: "users",
//         _id: userAddress,
//         name: "Unnamed",
//         isProfileImageNft: false,
//         profileImage:
//           "https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg",
//         walletAddress: userAddress,
//       };

//       await client.createIfNotExists(userDoc);

//       setAppStatus("connected");
//     } catch (error) {
//       router.push("/");
//       setAppStatus("connected");
//       // setAppStatus("error");
//     }
//   };

//   //   /**
//   //    * Generates NFT profile picture URL or returns the image URL if it's not an NFT
//   //    * @param {String} imageUri If the user has minted a profile picture, an IPFS hash; if not then the URL of their profile picture
//   //    * @param {Boolean} isNft Indicates whether the user has minted a profile picture
//   //    * @returns A full URL to the profile picture
//   //    */
//   //   const getNftProfileImage = async (imageUri, isNft) => {
//   //     if (isNft) {
//   //       return `https://gateway.pinata.cloud/ipfs/${imageUri}`;
//   //     } else if (!isNft) {
//   //       return imageUri;
//   //     }
//   //   };

//   /**
//    * Gets all the tweets stored in Sanity DB.
//    */
//   const fetchTweets = async () => {
//     const query = `
//         *[_type == "tweets"]{
//           "author": author->{name, walletAddress, profileImage, isProfileImageNft},
//           tweet,
//           timestamp
//         }|order(timestamp desc)
//       `;

//     setTweets(await client.fetch(query));

//     const sanityResponse = await client.fetch(query);

//     setTweets([]);

//     /**
//      * Async await not available with for..of loops.
//      */
//     sanityResponse.forEach(async (item) => {
//       const profileImageUrl = await getNftProfileImage(
//         item.author.profileImage,
//         item.author.isProfileImageNft
//       );

//       if (item.author.isProfileImageNft) {
//         const newItem = {
//           tweet: item.tweet,
//           timestamp: item.timestamp,
//           author: {
//             name: item.author.name,
//             walletAddress: item.author.walletAddress,
//             profileImage: profileImageUrl,
//             isProfileImageNft: item.author.isProfileImageNft,
//           },
//         };

//         setTweets((prevState) => [...prevState, newItem]);
//       } else {
//         setTweets((prevState) => [...prevState, item]);
//       }
//     });
//   };

//   /**
//    * Gets the current user details from Sanity DB.
//    * @param {String} userAccount Wallet address of the currently logged in user
//    * @returns null
//    */
//   const getCurrentUserDetails = async (userAccount = currentAccount) => {
//     if (appStatus !== "connected") return;

//     const query = `
//         *[_type == "users" && _id == "${userAccount}"]{
//           "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
//           name,
//           profileImage,
//           isProfileImageNft,
//           coverImage,
//           walletAddress
//         }
//       `;
//     const response = await client.fetch(query);

//     const profileImageUri = await getNftProfileImage(
//       response[0].profileImage,
//       response[0].isProfileImageNft
//     );

//     setCurrentUser({
//       tweets: response[0].tweets,
//       name: response[0].name,
//       profileImage: profileImageUri,
//       walletAddress: response[0].walletAddress,
//       coverImage: response[0].coverImage,
//       isProfileImageNft: response[0].isProfileImageNft,
//     });
//   };

//   return (
//     <TwitterContext.Provider
//       value={{
//         appStatus,
//         currentAccount,
//         connectToWallet,
//         fetchTweets,
//         tweets,
//         currentUser,
//         setAppStatus,

//         getCurrentUserDetails,
//       }}
//     >
//       {children}
//     </TwitterContext.Provider>
//   );
// };


//env local

// API Key: 08821373aa37d0a7e70b
//  API Secret: ed57322793132497cecce79e24b2acd2b77360199fcd84a67c53eb75efda235d
//  JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MDFjMTRiNi0yMWVhLTRjOTEtOGMzNy0wMTFhNjk4ODllOTQiLCJlbWFpbCI6ImRldmVsb3BlcnVqQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwODgyMTM3M2FhMzdkMGE3ZTcwYiIsInNjb3BlZEtleVNlY3JldCI6ImVkNTczMjI3OTMxMzI0OTdjZWNjZTc5ZTI0YjJhY2QyYjc3MzYwMTk5ZmNkODRhNjdjNTNlYjc1ZWZkYTIzNWQiLCJpYXQiOjE2ODI3OTM2MTd9.vy7HkCS3sAAKWoq2yN7PsR1_Ab8BvktPLSfG8P0kKls

