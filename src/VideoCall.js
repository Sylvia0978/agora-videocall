import React from "react";
import {
  useRTCClient,
  useJoin,
  usePublish,
  useRemoteUsers,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  LocalUser,
  RemoteUser,
} from "agora-rtc-react";

// Insert your Agora App ID below!
const appId = "7fa7fa6874ba48c782411455b017ab1e";
const token = null; // for testing only

function VideoCall({ channelName, onLeave }) {
  const client = useRTCClient();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  console.log(channelName,"dhdhnn");
  useJoin(
    {
      appid: appId,
      channel: channelName,
      token,
    },
    true
  );
  usePublish([localMicrophoneTrack, localCameraTrack].filter(Boolean));

  const remoteUsers = useRemoteUsers();
  // CSS
  const styles = {
    container: {
      maxWidth: 1100,
      margin: "36px auto 0",
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 2px 18px 0 #b9cef822",
      padding: 32,
      minHeight: "440px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    channel: {
      color: "#255dc8",
      fontSize: 21,
      fontWeight: 600,
      marginLeft: 8,
    },
    leaveBtn: {
      background: "linear-gradient(90deg,#fc285b 30%,#fd6f23 70%)",
      border: 0,
      color: "#fff",
      padding: "8px 28px",
      fontSize: 17,
      borderRadius: 24,
      fontWeight: 600,
      boxShadow: "0 2px 16px #fc28440c",
      cursor: "pointer",
      marginLeft: 10,
    },
    videoGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: 22,
      marginTop: 28,
    },
    card: {
      borderRadius: 9,
      background: "#f7f9fc",
      boxShadow: "0 2px 12px #dbefff22",
      padding: 10,
      width: 340,
      maxWidth: "90vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: 10,
      left: 10,
      background: "#2d84f7",
      color: "#fff",
      fontSize: 12.5,
      fontWeight: 600,
      padding: "2px 10px",
      borderRadius: 6,
      zIndex: 2,
    },
    video: {
      borderRadius: 8,
      width: "315px",
      height: "234px",
      background: "#101316",
      overflow: "hidden",
      boxShadow: "0 2px 10px #2d84f709",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: 20, fontWeight: 500, fontSize: 18 }}>
        {1 + remoteUsers.length} participant
        {remoteUsers.length !== 0 ? "s" : ""}
      </div>
      <div style={styles.header}>
        <span>
          <span style={{ color: "#333", fontWeight: 600 }}>Meeting:</span>
          <span style={styles.channel}>{channelName}</span>
        </span>
        <button style={styles.leaveBtn} onClick={onLeave}>
          Leave Meeting
        </button>
      </div>
      <div style={styles.videoGrid}>
        {/* Host video */}
        <div style={styles.card}>
          <div style={{ ...styles.badge, background: "#2d84f7" }}>Host</div>
          <div style={styles.video}>
            <LocalUser
              audioTrack={localMicrophoneTrack}
              videoTrack={localCameraTrack}
              cameraOn={!!localCameraTrack}
              micOn={!!localMicrophoneTrack}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        {/* Remote users */}
        {remoteUsers.map((user) => (
          <div key={user.uid} style={styles.card}>
            <div style={{ ...styles.badge, background: "#6d7c97" }}>
              User {user.uid}
            </div>
            <div style={styles.video}>
              <RemoteUser
                user={user}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoCall;

