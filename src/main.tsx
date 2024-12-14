import "./createPost.js";

import { Devvit, useState } from "@devvit/public-api";

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: "initialData";
      data: { username: string; bestScore: number };
    }
  | {
      type: "setScore";
      data: { newScore: number };
    }
  | {
      type: "updateScore";
      data: { bestScore: number };
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
      return currUser?.username ?? "anon";
    });

    // Load latest score from redis with `useAsync` hook
    const [score, setScore] = useState(async () => {
      const redisScore = await context.redis.get(`score_${context.postId}`);
      return Number(redisScore ?? 0);
    });

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case "setScore":
          await context.redis.set(
            `score_${context.postId}`,
            msg.data.newScore.toString()
          );
          context.ui.webView.postMessage("gameWebView", {
            type: "updateScore",
            data: {
              bestScore: msg.data.newScore,
            },
          });
          setScore(msg.data.newScore);
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
          bestScore: score,
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
