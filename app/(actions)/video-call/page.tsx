// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { FiVideo, FiMic, FiMicOff, FiVideoOff } from "react-icons/fi";
// import io from "socket.io-client";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";

// const socket = io(process.env.NEXT_PUBLIC_REALTIME_SERVER_URL!); // WebSocket connection

// export default function VideoCall() {
//   // Pass both user IDs
//   const [isCallInitiated, setIsCallInitiated] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isAudioOn, setIsAudioOn] = useState(true);
//   const [isReceivingCall, setIsReceivingCall] = useState(false);
//   const [recievedOffer, setRecievedOffer] =
//     useState<RTCSessionDescriptionInit | null>(null);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const localStream = useRef<MediaStream | null>(null);

//   const session = useSession();
//   const currentUserId = session.data?.userId;
//   const searchParams = useSearchParams();
//   const otherUserId = searchParams.get("otherUserId");

//   useEffect(() => {
//     handleCheckMedia();
//     // Register user on WebSocket connection
//     socket.emit("register", currentUserId);

//     // Listen for incoming calls
//     socket.on("incomingCall", ({ offer }) => {
//       setIsReceivingCall(true);
//       setRecievedOffer(offer);
//     });

//     socket.on("callAccepted", async ({ answer }) => {
//       console.log("answer", answer);
//       if (!peerConnection.current) {
//         peerConnection.current = new RTCPeerConnection();
//       }

//       try {
//         // Only set the remote answer if the connection is in the "have-local-offer" state
//         if (peerConnection.current.signalingState === "have-local-offer") {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(answer)
//           );
//         } else {
//           console.error(
//             "Cannot set remote answer, signaling state:",
//             peerConnection.current.signalingState
//           );
//         }
//       } catch (error) {
//         console.error("Error setting remote description:", error);
//       }
//     });

//     return () => {
//       socket.off("incomingCall");
//       socket.off("callAccepted");
//       //   Turn off video and audio tracks
//       localStream.current?.getTracks().forEach((track) => {
//         track.stop();
//       });
//     };
//   }, [currentUserId]);

//   useEffect(() => {
//     if (peerConnection.current) {
//       peerConnection.current.ontrack = (event) => {
//         console.log("peerConnection", event.streams[0]);
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = event.streams[0];
//         }
//       };
//     }
//   }, [peerConnection.current]);

//   // Function to check video/audio before the call starts
//   const handleCheckMedia = async () => {
//     localStream.current = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = localStream.current;
//       localVideoRef.current.muted = true;
//     }
//   };

//   // Toggle Video and Audio
//   const toggleVideo = () => {
//     if (localStream.current) {
//       const videoTrack = localStream.current.getVideoTracks()[0];
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsVideoOn(videoTrack.enabled);
//     }
//   };

//   const toggleAudio = () => {
//     if (localStream.current) {
//       const audioTrack = localStream.current.getAudioTracks()[0];
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsAudioOn(audioTrack.enabled);
//     }
//   };

//   // Initialize the call (WebRTC)
//   const handleVideoCall = async () => {
//     setIsCallInitiated(true);

//     const config = {
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com:19302",
//         },
//       ],
//     };

//     peerConnection.current = new RTCPeerConnection(config);

//     // Add local stream to peer connection
//     localStream.current?.getTracks().forEach((track) => {
//       peerConnection.current?.addTrack(
//         track,
//         localStream.current as MediaStream
//       );
//     });

//     // Handle incoming stream
//     peerConnection.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     // Create offer and send to the other user
//     const offer = await peerConnection.current.createOffer();
//     await peerConnection.current.setLocalDescription(offer);

//     // Send the offer to the selected user via WebSocket
//     socket.emit("callUser", { offer, toUserId: otherUserId });
//   };

//   async function handleAcceptCall() {
//     try {
//       if (!peerConnection.current) {
//         peerConnection.current = new RTCPeerConnection();

//         // Add local stream to peer connection
//         localStream.current?.getTracks().forEach((track) => {
//           peerConnection.current?.addTrack(
//             track,
//             localStream.current as MediaStream
//           );
//         });

//         peerConnection.current.ontrack = (event) => {
//           console.log("event", event.streams[0]);
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }
//         };
//       }

//       await peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(recievedOffer as RTCSessionDescriptionInit)
//       );

//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       console.log("answer", answer, otherUserId);
//       socket.emit("answerCall", {
//         answer: peerConnection.current.localDescription,
//         toUserId: otherUserId,
//       });
//     } catch (error) {
//       console.error("Failed to accept call:", error);
//     }
//   }

//   //   async function handleAcceptCall() {
//   //     try {
//   //       if (!peerConnection.current) {
//   //         peerConnection.current = new RTCPeerConnection();
//   //       }
//   //       if (peerConnection.current?.signalingState !== "stable") {
//   //         console.error(
//   //           "PeerConnection is in an invalid state to accept a call:",
//   //           peerConnection.current?.signalingState
//   //         );
//   //         return;
//   //       }

//   //       // Set the remote offer from the incoming SDP (the caller's SDP)
//   //       await peerConnection.current?.setRemoteDescription(
//   //         new RTCSessionDescription(
//   //           new RTCSessionDescription(recievedOffer as RTCSessionDescriptionInit)
//   //         )
//   //       );

//   //       // Create an answer to the offer
//   //       const answer = await peerConnection.current?.createAnswer();

//   //       // Set local description with the answer
//   //       await peerConnection.current?.setLocalDescription(answer);

//   //       // Send the answer back to the caller through signaling server (WebSocket)
//   //       socket.emit("answerCall", {
//   //         answer: peerConnection.current?.localDescription,
//   //         to: otherUserId, // Send to the correct user
//   //       });
//   //       console.log("videorefs", localVideoRef, remoteVideoRef);
//   //     } catch (error) {
//   //       console.error("Failed to accept call:", error);
//   //     }
//   //   }

//   // Accept incoming call
//   //   const handleAcceptCall = async () => {
//   //     peerConnection.current = new RTCPeerConnection();

//   //     peerConnection.current.ontrack = (event) => {
//   //       if (remoteVideoRef.current) {
//   //         remoteVideoRef.current.srcObject = event.streams[0];
//   //       }
//   //     };

//   //     await peerConnection.current.setRemoteDescription(
//   //       new RTCSessionDescription(recievedOffer as RTCSessionDescriptionInit)
//   //     );

//   //     const answer = await peerConnection.current.createAnswer();
//   //     await peerConnection.current.setLocalDescription(answer);

//   //     // Send answer back to the caller
//   //     socket.emit("answerCall", { answer, toUserId: otherUserId });
//   //   };

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       {isCallInitiated ? (
//         <div className="call-screen">
//           {/* Local Video */}
//           <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full bg-green-500"
//           />

//           {/* Remote Video */}
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full bg-gray-500"
//           />

//           {/* Call Controls */}
//           <div className="flex space-x-2">
//             <Button onClick={() => toggleVideo()}>
//               {isVideoOn ? <FiVideo /> : <FiVideoOff />}
//             </Button>
//             <Button onClick={() => toggleAudio()}>
//               {isAudioOn ? <FiMic /> : <FiMicOff />}
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <div className="green-screen-check">
//           {/* Green Screen Check */}
//           <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             className="w-[60vw] h-[60vh] bg-black rounded-md object-scale-down"
//           />

//           {/* Start Call Button */}
//           <Button onClick={handleVideoCall} className="mt-4">
//             Start Video Call
//           </Button>
//         </div>
//       )}

//       {/* Incoming Call Notification */}
//       {isReceivingCall && (
//         <div className="incoming-call">
//           <p>Incoming call...</p>
//           <Button onClick={() => handleAcceptCall()} className="mt-2">
//             Accept
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiVideo, FiMic, FiMicOff, FiVideoOff } from "react-icons/fi";
import Peer from "peerjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function VideoCall() {
  const [isCallInitiated, setIsCallInitiated] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [callerId, setCallerId] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peer = useRef<Peer | null>(null);
  const currentCall = useRef<Peer.MediaConnection | null>(null);

  const session = useSession();
  const currentUserId = session.data?.userId;
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get("otherUserId");

  useEffect(() => {
    // Initialize PeerJS and setup listeners
    peer.current = new Peer(undefined, {
      host: "http://localhost",
      port: 5000,
      path: "/peerjs",
    });

    peer.current.on("open", (id) => {
      setPeerId(id);
      console.log("Peer ID:", id);
    });

    peer.current.on("call", (call) => {
      setIsReceivingCall(true);
      setCallerId(call.peer);
      call.answer(localStream.current as MediaStream);
      call.on("stream", (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
      currentCall.current = call;
    });

    return () => {
      peer.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (peer.current) {
      peer.current.on("connection", (conn) => {
        conn.on("data", (data) => {
          console.log("Received data:", data);
        });
      });
    }
  }, []);

  const handleCheckMedia = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
      localVideoRef.current.muted = true;
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn(audioTrack.enabled);
    }
  };

  const handleVideoCall = async () => {
    await handleCheckMedia();
    setIsCallInitiated(true);

    if (peer.current && otherUserId) {
      const call = peer.current.call(
        otherUserId,
        localStream.current as MediaStream
      );
      call.on("stream", (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
      call.on("close", () => {
        console.log("Call closed");
        setIsCallInitiated(false);
      });
    }
  };

  const handleAcceptCall = () => {
    if (peer.current && callerId && localStream.current) {
      const call = peer.current.call(
        callerId,
        localStream.current as MediaStream
      );
      call.on("stream", (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
      call.on("close", () => {
        console.log("Call closed");
        setIsReceivingCall(false);
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isCallInitiated ? (
        <div className="call-screen">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="w-full h-full bg-green-500"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full bg-gray-500"
          />
          <div className="flex space-x-2">
            <Button onClick={toggleVideo}>
              {isVideoOn ? <FiVideo /> : <FiVideoOff />}
            </Button>
            <Button onClick={toggleAudio}>
              {isAudioOn ? <FiMic /> : <FiMicOff />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="green-screen-check">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="w-[60vw] h-[60vh] bg-black rounded-md object-scale-down"
          />
          <Button onClick={handleVideoCall} className="mt-4">
            Start Video Call
          </Button>
        </div>
      )}
      {isReceivingCall && (
        <div className="incoming-call">
          <p>Incoming call...</p>
          <Button onClick={handleAcceptCall} className="mt-2">
            Accept
          </Button>
        </div>
      )}
    </div>
  );
}
