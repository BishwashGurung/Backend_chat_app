// Both of these html and js has not been implemented but this is just to show how the request will be send from the client side to make request for video call and answer video call and have a one-to-one video call.
import io from "socket.io-client";
const socket = io("http://localhost:8080/", {
    query: {
        userId: authUser.id,
    },
});

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startCallButton = document.getElementById("startCall");
const endCallButton = document.getElementById("endCall");

let localStream;
let remoteStream;
let peerConnection;

const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// Get user media
navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;
        localVideo.srcObject = stream;
    })
    .catch((error) => console.error("Error accessing media devices.", error));

startCallButton.addEventListener("click", () => {
    const receiverId = prompt("Enter the user ID to call:");
    if (receiverId) {
        socket.emit("callUser", { receiverId });
    }
});

endCallButton.addEventListener("click", endCall);

socket.on("callMade", async (data) => {
    await createPeerConnection();
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit("makeAnswer", {
        answer,
        to: data.socket,
    });
});

socket.on("answerMade", async (data) => {
    await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    );
});

socket.on("iceCandidate", (data) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
});

function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
            socket.emit("iceCandidate", { candidate, to: receiverSocketId });
        }
    };

    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };

    localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));
}

async function endCall() {
    peerConnection.close();
    peerConnection = null;
    socket.emit("endCall", { to: receiverSocketId });
}

socket.on("callEnded", () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    alert("Call ended by the other user.");
});
