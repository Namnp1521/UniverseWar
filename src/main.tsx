import "./createPost.js";

import { Devvit, useState } from "@devvit/public-api";

type LeaderboardType = {
  user: string;
  score: number;
};

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: "initialData";
      data: {
        username: string;
        newScore: number;
        leaderboard: LeaderboardType[];
      };
    }
  | {
      type: "setScore";
      data: { newScore: number };
    }
  | {
      type: "updateScore";
      data: { leaderboard: LeaderboardType[] };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "UniverseWar Game",
  height: "tall",
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? "anonymous";
    });

    // Load latest leaderboard from redis with `useAsync` hook
    const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>(
      async () => {
        const leaderboardData = await context.redis.get(
          `leaderboard_${context.postId}`
        );

        if (!leaderboardData) return [];

        // sort leaderboard
        const leaderboard: LeaderboardType[] =
          JSON.parse(leaderboardData)?.leaderboard || [];
        leaderboard.sort((user1, user2) => user2.score - user1.score);
        return leaderboard;
      }
    );

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case "setScore":
          const newScore = msg.data.newScore;
          // find user have score less than newScore
          if (
            leaderboard.length < 3 ||
            !!leaderboard.find((user) => newScore > user.score)
          ) {
            let newLeaderboard: LeaderboardType[] = [
              ...leaderboard,
              {
                score: newScore,
                user: username,
              },
            ];
            newLeaderboard.sort((user1, user2) => user2.score - user1.score);
            // get top 3 highest score
            newLeaderboard = newLeaderboard.slice(0, 3);

            await context.redis.set(
              `leaderboard_${context.postId}`,
              JSON.stringify({ leaderboard: newLeaderboard })
            );
            context.ui.webView.postMessage("gameWebView", {
              type: "updateScore",
              data: {
                leaderboard: newLeaderboard,
              },
            });
            setLeaderboard(newLeaderboard);
          }
          break;
        case "initialData":
        case "updateScore":
          break;

        default:
          throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage("gameWebView", {
        type: "initialData",
        data: {
          username: username,
          newScore: 0,
          leaderboard: leaderboard,
        },
      });
    };

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? "0%" : "100%"}
          alignment="middle center"
        >
          <spacer grow />
          <image
            imageWidth={500}
            imageHeight={90}
            width="500px"
            height="90px"
            url="header.png"
          />
          <spacer height={"12px"} />
          <text size="medium" color="#ffffff">
            Press A,W,S,D to control, SPACE to fire
          </text>
          <spacer />
          <button onPress={onShowWebviewClick}>Play Now</button>

          <spacer grow />
          <hstack>
            <image
              imageWidth={22}
              imageHeight={22}
              width="22px"
              height="22px"
              url="rec.png"
            />
            <spacer />
            <image
              imageWidth={22}
              imageHeight={22}
              width="22px"
              height="22px"
              url="cir.png"
            />
            <spacer />
            <image
              imageWidth={22}
              imageHeight={23}
              width="22px"
              height="23px"
              url="pol.png"
            />
          </hstack>
          <spacer />
          {/* <vstack alignment="start middle">
            <hstack>
              <text size="xsmall">{username ?? ""}</text>
              <text size="xsmall" weight="bold">
                Best Score: {score ?? ""}
              </text>
            </hstack>
          </vstack> */}
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? "100%" : "0%"}>
          <vstack
            border="thick"
            borderColor="black"
            height={webviewVisible ? "100%" : "0%"}
          >
            <webview
              id="gameWebView"
              url="page.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={webviewVisible ? "100%" : "0%"}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
