import { useContext, useEffect } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import TweetBox from "./TweetBox";
import Post from "../Post";
import { BsStars } from "react-icons/bs";

const style = {
  wrapper: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

interface Tweet {
  author: TweetAuthor;
  tweet: String;
  timestamp: string;
}

interface TweetAuthor {
  name: string;
  walletAddress: string;
  profileImage: string;
  isProfileImageNft: boolean;
}

function Feed() {
  const { tweets } = useContext(TwitterContext);

  return (
    <div className={`${style.wrapper} no-scrollbar`}>
      <div className={style.header}>
        <div className={style.headerTitle}>Home</div>
        <BsStars />
      </div>
      <TweetBox />
      {tweets.map((tweet: Tweet, index: number) => (
        <Post
          key={index}
          displayName={
            tweet.author.name === "Unnamed"
              ? `${tweet.author.walletAddress.slice(
                  0,
                  4
                )}...${tweet.author.walletAddress.slice(41)}`
              : tweet.author.name
          }
          userName={`${tweet.author.walletAddress.slice(
            0,
            4
          )}...${tweet.author.walletAddress.slice(41)}`}
          text={tweet.tweet}
          avatar={tweet.author.profileImage}
          isProfileImageNft={tweet.author.isProfileImageNft}
          timestamp={tweet.timestamp}
        />
      ))}
    </div>
  );
}

export default Feed;

// import { BsStars } from "react-icons/bs";
// import TweetBox from "./TweetBox";
// import Post from "../Post";

// const style = {
//   wrapper: `flex-[2] border-r border-l border-[#38444d]`,
//   header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
//   headerTitle: `text-xl font-bold`,
// };

// const tweets = [
//   {
//     displayName: `Qazi`,
//     userName: `0x8cd390.......bghnfD`,
//     avatar: `//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg`,
//     text: `gm`,
//     isProfileImageNft: false,
//     timestamp: `2023-01-01T12:00:00.000Z`,
//   },
//   {
//     displayName: `Qazi`,
//     userName: `0x8cd390.......bghnfD`,
//     avatar: `//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg`,
//     text: `gm`,
//     isProfileImageNft: false,
//     timestamp: `2022-11-01T12:00:00.000Z`,
//   },
//   {
//     displayName: `Qazi`,
//     userName: `0x8cd390.......bghnfD`,
//     avatar: `//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg`,
//     text: `gm`,
//     isProfileImageNft: false,
//     timestamp: `2022-09-01T12:00:00.000Z`,
//   },
//   {
//     displayName: `Qazi`,
//     userName: `0x8cd390.......bghnfD`,
//     avatar: `//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg`,
//     text: `gm`,
//     isProfileImageNft: false,
//     timestamp: `2021-06-01T12:00:00.000Z`,
//   },
//   {
//     displayName: `Qazi`,
//     userName: `0x8cd390.......bghnfD`,
//     avatar: `//www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg`,
//     text: `gm`,
//     isProfileImageNft: false,
//     timestamp: `2020-12-01T12:00:00.000Z`,
//   },
// ];

// function Feed() {
//   return (
//     <div className={style.wrapper}>
//       <div className={style.header}>
//         <div className={style.headerTitle}>Home</div>
//         <BsStars />
//       </div>
//       <TweetBox />
//       {tweets.map((tweet, index) => (
//         <Post
//           key={index}
//           displayName={tweet.displayName}
//           userName={`${tweet.userName.slice(0, 4)}...${tweet.userName.slice(
//             -3
//           )}`}
//           avatar={tweet.avatar}
//           text={tweet.text}
//           isProfileImageNft={tweet.isProfileImageNft}
//           timestamp={tweet.timestamp}
//         />
//       ))}
//     </div>
//   );
// }

// export default Feed;
