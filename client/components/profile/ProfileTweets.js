import { useEffect, useContext, useState } from 'react'
import { TwitterContext } from '../../context/TwitterContext'
import Post from '../Post'

const style = {
  wrapper: `no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
}

interface Tweet {
  timestamp: string
  tweet: string
}

interface Tweets extends Array<Tweet> {}

interface Author {
  name: string
  profileImage: string
  walletAddress: string
  isProfileImageNft: Boolean | undefined
}

const ProfileTweets = () => {
  const { currentUser } = useContext(TwitterContext)
  const [tweets, setTweets] = useState<Tweets>([
    {
      timestamp: '',
      tweet: '',
    },
  ])
  const [author, setAuthor] = useState<Author>({
    name: '',
    profileImage: '',
    walletAddress: '',
    isProfileImageNft: undefined,
  })

  useEffect(() => {
    if (!currentUser) return

    setTweets(currentUser.tweets)
    setAuthor({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      walletAddress: currentUser.walletAddress,
      isProfileImageNft: currentUser.isProfileImageNft,
    })
  }, [currentUser])

  return (
    <div className={style.wrapper}>
      {tweets?.map((tweet: Tweet, index: number) => (
        <Post
          key={index}
          displayName={
            author.name === 'Unnamed'
              ? `${author.walletAddress.slice(
                  0,
                  4,
                )}...${author.walletAddress.slice(41)}`
              : author.name
          }
          userName={`${author.walletAddress.slice(
            0,
            4,
          )}...${author.walletAddress.slice(41)}`}
          text={tweet.tweet}
          avatar={author.profileImage}
          timestamp={tweet.timestamp}
          isProfileImageNft={author.isProfileImageNft}
        />
      ))}
    </div>
  )
}

export default ProfileTweets;

// import { useEffect, useContext, useState } from "react";

// import Post from "../Post";

// const style = {
//   wrapper: `no-scrollbar`,
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

// const ProfileTweets = () => {
//   return (
//     <div className={style.wrapper}>
//       {tweets?.map((tweet, index) => (
//         <Post
//           key={index}
//           displayName="Upendra"
//           userName={`${tweet.userName.slice(0, 4)}...${tweet.userName.slice(
//             -4
//           )}`}
//           text={tweet.text}
//           avatar={tweet.avatar}
//           timestamp={tweet.timestamp}
//           isProfileImageNft={tweet.isProfileImageNft}
//         />
//       ))}
//     </div>
//   );
// };

// export default ProfileTweets;
