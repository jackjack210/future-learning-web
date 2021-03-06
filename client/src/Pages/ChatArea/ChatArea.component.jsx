// react libraries
import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";

// React chat engine components
import { ChatEngine } from "react-chat-engine";

// Components
import ChatFeed from "../../Components/ChatFeed/ChatFeed.component";

// External CSS
import "./ChatArea.styles.css";
import "./ChatArea.essential.styles.css";

import { MeetContext } from "../../Context/meetContext";

const ChatArea = () => {
  const { setVidState, setAudState, setScreenTrack } = useContext(MeetContext);

  useEffect(() => {
    setVidState(true);
    setAudState(true);
    setScreenTrack(false);
  }, []);
  return (
    // Chat engine parent element from react chatengine to render chat area
    <div className="chat-in-meet">
      <Helmet>
        <meta charSet="utf-8" />
        <title>FUTURE LEARNING | CHAT</title>
      </Helmet>
      <ChatEngine
        height="100vh"
        projectID={process.env.REACT_APP_PROJECT_ID}
        // get userName and password from local storage to avoid vanishing of states on page reload
        userName={localStorage.getItem("userName")}
        userSecret={localStorage.getItem("password")}
        // render custom made chat feed component with all the props provided
        renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      />
    </div>
  );
};

export default ChatArea;
