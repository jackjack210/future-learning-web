import React, { useState, useEffect, useContext } from "react";
// components
import Attendees from "./../Attendees/Attendees.component";
import MeetController from "./../MeetController/MeetController.component";
import ChatInMeet from "./../ChatInMeet/ChatInMeet.component";
import Export from "react-html-table-to-excel";
// Icons
import ForumSharpIcon from "@material-ui/icons/ForumSharp";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";

// External CSS
import "./room.styles.css";
import Video from "twilio-video";

import { MeetContext } from "../../Context/meetContext";
import Attend from "../Attend/Attend";
const Room = ({ roomName, room, handleLogOut }) => {
  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [currentDomntSpeaker, setCurrentDomntSpeaker] = useState("");
  
  const { screenTrack, setScreenTrack } = useContext(MeetContext);

  useEffect(() => {
    // add new participant in the room state
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    // filter out the participant on leaving meet
    const participantDisConnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    // twilio functtion listening on new participant or leaving participant
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisConnected);

    room.participants.forEach(participantConnected);
    room.on("dominantSpeakerChanged", (participant) => {
      handleDomntSpeaker(participant);
    });
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisConnected", participantDisConnected);
    };
  }, [room]);

  // create components for remote participants
  const remoteParticipants = participants.map((participant) => (
    <Attendees
      key={participant.sid}
      participant={participant}
      isLocal={false}
      dominantSpeaker={currentDomntSpeaker === participant.sid ? true : false}
    />
  ));

  const handleDomntSpeaker = (participant) => {
    if (participant) {
     
      setCurrentDomntSpeaker(participant.sid);
    }
  };
  // function handle state of local participant video
  const handleToggleVideo = () => {
   
    room.localParticipant.videoTracks.forEach((publication) =>
      publication.track.isEnabled
        ? publication.track.disable()
        : publication.track.enable()
    );
  };

  // function handle state of local participant audio
  const handleToggleAudio = () => {
    
    room.localParticipant.audioTracks.forEach((publication) =>
      publication.track.isEnabled
        ? publication.track.disable()
        : publication.track.enable()
    );
  };

  const handleScreenSharing = () => {
   if (!screenTrack) {
      navigator.mediaDevices
        .getDisplayMedia()
        .then((stream) => {
          var track = new Video.LocalVideoTrack(stream.getTracks()[0]);
          room.localParticipant.publishTrack(track);

          track.mediaStreamTrack.onended = () => {
            setScreenTrack(false);
          };
        })
        .catch(() => {});
    } else {
      room.localParticipant.unpublishTrack(screenTrack);
      
      setScreenTrack(false);
    }
  };
  return (
    <div className="room-wrapper">
        <div className="att-left">
          <table id= "table-ad">
            <tr>
              <th>
                PARTICIPATE MAMBER
              </th>
            </tr>
            <tr>
              <td>
                <Attend
                participant={room.localParticipant}
              />
            {remoteParticipants}
              </td>
            </tr>
          </table>
        </div>
        <Export
          id="table-ad"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="attendance"
          sheet="attendance"
          buttonText="Download Report"
        />
      <div className="room-left-panel">
        <div className="participants-frames">
          {room && ( // render local participant
            <Attendees
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              isLocal={true}
              dominantSpeaker={
                currentDomntSpeaker === room.localParticipant.sid ? true : false
              }
            />
          )}
          {/* render remote participant in the room */}
          {remoteParticipants}
        </div>
        <MeetController
          handleLogOut={handleLogOut}
          roomName={roomName}
          handleToggleVideo={handleToggleVideo}
          handleToggleAudio={handleToggleAudio}
          handleScreenSharing={handleScreenSharing}
        />
      </div>
      {/* conditional rendering of chat in meet toggled using chat icon */}
      <div className="room-right-panel">{showChat ? <ChatInMeet /> : null}</div>
      <span className="msg-in-meet-btn">
        <Tooltip
          title="Chat in Meet"
          TransitionComponent={Zoom}
          placement="left"
        >
          <ForumSharpIcon
            style={{ fontSize: 40, cursor: "pointer" }}
            onClick={() => setShowChat(!showChat)}
          />
        </Tooltip>
      </span>
    </div>
  );
};

export default Room;
