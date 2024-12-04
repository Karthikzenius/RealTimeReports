import React, { useState } from "react";
import "./chat.scss";
import yb from "../../assets/images/yb.png";
import callimg from "../../assets/images/callimg.png"
import emailimg from "../../assets/images/emailimg.png"
import chatimg from "../../assets/images/chatimg.png"
import internalchatimg from "../../assets/images/internalchatimg.png"
import "../../scss/_custome.scss";

const Chat = () => {
  const [Input, SetInput] = useState("");
  const [messages, setMessages] = useState([
    // {
    //   sender: "agent",
    //   timestamp: "2024-04-30T10:00:00",
    //   content: "Hello! How can I assist you today?"
    // },
    // {
    //   sender: "user",
    //   timestamp: "2024-04-30T10:01:00",
    //   content: "Hi there! I'm having trouble with my account."
    // },
    {
      sender: "agent",
      timestamp: "2024-04-30T10:02:00",
      content: "hello"
    },
    // {
    //   sender: "user",
    //   timestamp: "2024-04-30T10:03:00",
    //   content: "Sure, my account number is 123456789."
    // },
    {
      sender: "agent",
      timestamp: "2024-04-30T10:04:00",
      content: "i am not able to send the email"
    },
    // {
    //   sender: "agent",
    //   timestamp: "2024-04-30T10:05:00",
    //   content: "I see that there's an issue with your billing."
    // }
  ]);

  const HandleSend = () => {
    if (Input.trim() !== "") {
      const newMessage = {
        sender: "user",
        timestamp: new Date().toISOString(),
        content: Input
      };
      setMessages([...messages, newMessage]);
      SetInput("");
    }
  };
 
  const chatList = {
    chatList: [
      {
        mediaType: "call",
        firstName: "Ashok",
        lastName: "Reddy",
        mobilenumber:"+91 9912345769",
        lastReadMessage: "hello",
        time: new Date("2024-05-02T10:30:00"),
        messages: [
          { sender: "agent", timestamp: "2024-04-30T10:00:00", content: "Hi there! I'm having trouble with my account." },
          //  { sender: "user", timestamp: "2024-04-30T10:01:00", content: "Hello! How can I assist you today?" },
        ]
      },
      {
        mediaType: "message",
        firstName: "Alice",
        lastName: "Smith",
        mobilenumber:"+91 9989347458",
        lastReadMessage: "Sure",
        time: new Date("2024-05-01T15:45:00"),
        messages: [
          { sender: "agent", timestamp: "2024-05-01T15:00:00", content: "my user id 5151515" },
          { sender: "user", timestamp: "2024-05-01T15:45:00", content: "thanks for providing your details..." },
        ]
      },
      {
        mediaType: "email",
        firstName: "Emily",
        lastName: "Brown",
        lastReadMessage: "👍",
        mobilenumber:"+91 7091584569",
        time: new Date("2024-04-30T09:20:00"),
        messages: [
          { sender: "agent", timestamp: "2024-04-30T09:00:00", content: "Did you receive the documents?" },
          { sender: "user", timestamp: "2024-04-30T09:20:00", content: "👍" },
        ]
      },
      {
        mediaType: "call",
        firstName: "Matt",
        lastName: "Henry",
        mobilenumber:"+91 8185882202",
        lastReadMessage: "Thank you",
        time: new Date("2024-04-30T09:20:00"),
        messages: [
          { sender: "agent", timestamp: "2024-04-30T09:00:00", content: "Thank you for your time." },
          { sender: "user", timestamp: "2024-04-30T09:20:00", content: "Thank you" },
        ]
      }
    ]
  };
  
  const [selectedChat, setSelectedChat] = useState<typeof chatList["chatList"][0] | null>(null);
  const handleChatItemClick = (chat: typeof chatList["chatList"][0]) => {
    console.log("Selected chat:", chat);
    setSelectedChat(chat);
    setMessages(chat.messages);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredChats = chatList.chatList.filter((chat) => {
    const fullName = `${chat.firstName} ${chat.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  

  
  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="main-wrapper-chat">
          <div className="row">
            <div className="col-lg-3">
              <nav className="internalchat-nav">
                <img className="chat-logo" src={internalchatimg} alt="Avatar" />
                <b>Internal Chats</b>
              </nav>
              <div className="searchchat">
  <input
    type="text"
    placeholder="Search..."
    name="search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  {/* <i className="fa fa-ellipsis-v" aria-hidden="true"></i> */}
</div>

              {filteredChats.map((chat, index) => (
                <div className={`chat-main-wrapper-section ${selectedChat === chat ? "selected" : ""}`}
                onClick={() => handleChatItemClick(chat)} key={index}>
                  <div className="chat-image-section">
                    {/* {chat.mediaType === "call" && ( */}
                      {/* <img
                        className="mediatypeprofiles"
                        src={callimg}
                        alt="call-logo"
                      /> */}
                    {/* )} */}
                    {/* {chat.mediaType === "email" && ( */}
                      {/* <img
                        className="mediatypeprofiles"
                        src={emailimg}
                        alt="email-logo"
                      /> */}
                    {/* )} */}
                    {/* {chat.mediaType === "message" && ( */}
                      <img
                        className="mediatypeprofiles"
                        src={chatimg}
                        alt="message-logo"
                      />
                    {/* )} */}
                  </div>
                  <div className="naming-section">
                    <span>{chat.firstName}</span> &nbsp;
                    <span>{chat.lastName}</span>
                    <p className="chatmessage">{chat.lastReadMessage}</p>
                  </div>
                  <div className="timezone-section">
                    <span>{chat.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                  </div>
                  <div className="message-section"></div>
                </div>
              ))}
            </div>

            <div className="col-lg-6">
              <div className="chat-part">
                <div>
                  <nav className="navbar navbar-light bg-light">
                    {/* <div className="container-fluid"> */}
                    <div className="container-fluid">
          {selectedChat ? ( // Conditionally render selected chat details
            <>
              {selectedChat.firstName} {selectedChat.lastName}
              <br />
              {selectedChat.mobilenumber}

              {/* Assuming phone number or any other detail here */}
              <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
            </>
          ) : (
            "Select a chat" // Placeholder text when no chat is selected
          )}
        </div>
                      {/* Ashok Reddy<br />
                      +91 9425844667
                      <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </div> */}
                  </nav>
                </div>
                <div className="chatbox">
                  {messages.map((item, index) => (
                    <div key={index}>
                      {item.sender === "agent" && (
                        <div className="agent-section">
                          <p className="contentmessage">{item.content}</p>
                        </div>
                      )}
                      {item.sender === "user" && (
                        <div className="user-section">
                          <p className="contentmessage">{item.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="chatinputbox">

                    <input
                      className="inputmessage"
                      value={Input}
                      onChange={(e) => SetInput(e.target.value)}
                    />
                    <div className="bottom-navbar">
                      <div className="col-lg-6">
                        <button className="SendBTN"><i className="far fa-smile icon"></i></button>
                        {/* <button className="SendBTN"><i className="fas fa-microphone icon"></i></button> */}
                        <button className="SendBTN"><i className="fas fa-paperclip attach"></i></button>
                      </div>
                      <div className="col-lg-row">
                        <button onClick={HandleSend} className="SendBTN">
                          <i className="fas fa-paper-plane send-icon"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="interaction">
                <div>
                  <nav className="navbar navbar-light bg-light">
                    <div className="container-fluid">
                      <h6>Interaction Info</h6>
                    </div>
                  </nav>
                </div>
                <div className="interaction-info-details">
                  <img className="interactionimg" src={yb} alt="Avatar" />
                  <div className="interactioninfo">
                    <span>
                      <b>Yesu Babu</b>
                    </span>
                    <br />
                    <span>yesu.babu@zeniusit.com</span>
                    <br />
                    <span className="ticket-blue">View Profile</span>
                  </div>
                </div>
                <div className="issue-info">
                  <div className="Reason">
                    <span>Reason</span>
                    <br />
                    <span>
                      <b>Report an issue</b>
                    </span>
                    <br />
                  </div>
                  <div className="Reason">
                    <span>Queue Name</span>
                    <br />
                    <span>
                      <b>Support queue</b>
                    </span>
                  </div>
                </div>
                <div className="issue-info">
                  <h6>Last Interactions</h6>
                  <div className="tickets">
                    <img
                      className="last-interactions-imgs"
                      src={chatimg}
                      alt="Avatar"
                    />
                    <div className="tickets-info">
                      <span>
                        <b>Kathryn Flores</b>
                      </span>
                      <br />
                      <span>
                        04 Dec, 8:03 am{" "}
                        <span className="ticket-green">Resolved</span>
                      </span>
                    </div>
                  </div>
                  <div className="tickets">
                    <img
                      className="last-interactions-imgs"
                      src={emailimg}
                      alt="Avatar"
                    />
                    <div className="tickets-info">
                      <span>
                        <b>Kathryn Flores</b>
                      </span>
                      <br />
                      <span>
                        04 Dec, 8:03 am{" "}
                        <span className="ticket-green">Resolved</span>
                      </span>
                    </div>
                  </div>
                  <div className="tickets">
                    <img
                      className="last-interactions-imgs"
                      src={emailimg}
                      alt="Avatar"
                    />
                    <div className="tickets-info">
                      <span>
                        <b>Kathryn Flores</b>
                      </span>
                      <br />
                      <span>
                        04 Dec, 8:03 am{" "}
                        <span className="ticket-green">Resolved</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
