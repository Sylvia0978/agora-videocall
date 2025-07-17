import React, { useState, useEffect } from "react";
import { AgoraRTCProvider } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideoCall from "./VideoCall";

// Agora client instance
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function App() {
    const [copyLabel, setCopyLabel] = useState("Copy");
  // Get channel code from URL (if exists)
  const getChannelFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("channel") || "";
  };

  const [channelName, setChannelName] = useState(getChannelFromURL());
  const [joined, setJoined] = useState(!!getChannelFromURL());

  // If the URL changes, sync channelName
  useEffect(() => {
    const handler = () => setChannelName(getChannelFromURL());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // When we join, update the URL so invite links work
  const handleJoin = () => {
    window.history.replaceState(null, "", `?channel=${channelName}`);
    setJoined(true);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 32, background: "#f6faff", minHeight: "100vh" }}>
      <h1 style={{ color: "#2d84f7" }}>Agora Video Call</h1>
      {!joined ? (
        <div style={{ marginTop: 40 }}>
          <input
            placeholder="Enter meeting code"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            style={{
              fontSize: 18,
              padding: 8,
              borderRadius: 6,
              border: "1.5px solid #d9e2ec"
            }}
          />
          <button
            style={{
              marginLeft: 14,
              fontSize: 18,
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "#2d84f7",
              color: "white",
              cursor: channelName ? "pointer" : "not-allowed"
            }}
            onClick={handleJoin}
            disabled={!channelName}
          >
            Join Meeting
          </button>
          <div style={{ marginTop: 18, color: "#18345d", opacity: 0.88 }}>
            Share the meeting code with others—or send them an invite link!
          </div>
          {channelName && (
            <div style={{ marginTop: 32 }}>
              <b>Invite link:</b>
              <div style={{
                marginTop: 4,
                background: "#e6f0fd",
                borderRadius: 6,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                fontSize: 15
              }}>
                <span style={{ overflowWrap: "break-word" }}>
                  {`${window.location.origin}/?channel=${channelName}`}
                </span>
                <button
                  style={{
                    marginLeft: 10,
                    borderRadius: 20,
                    background: "#2d84f7",
                    color: "white",
                    border: "none",
                    padding: "3px 12px",
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                   onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/?channel=${channelName}`
                  );
                  setCopyLabel("Copied");
                  setTimeout(() => setCopyLabel("Copy"), 1200);
                }}
                >
                  {copyLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <AgoraRTCProvider client={client}>
          <VideoCall
            channelName={channelName}
            onLeave={() => {
              setJoined(false);
              setChannelName("");
              window.history.replaceState(null, "", "/");
            }}
          />
        </AgoraRTCProvider>
      )}
    </div>
  );
}

export default App;
