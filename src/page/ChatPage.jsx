import axios from "axios";
import React, { useEffect, useState } from "react";

import { UserCircleIcon } from "@heroicons/react/16/solid";
import ChatgptLogo from "../assets/chatgpt.webp";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  // const [aiReply, setAiReply] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [aiModels, setAiModels] = useState(null);
  const [selectAiModelName, setSelectAiModelName] = useState("gpt-4o-mini");
  const [showLogin, setShowLogin] = useState(false);
  const clearAllChatHistory = () => {
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("lastChatTitle");
    setPreviousChats([]);
    setCurrentTitle(null);
  };
  const createNewChat = () => {
    // setAiReply(null);
    setUserInput("");
    setCurrentTitle(null);
  };
  const uniqueChatHistory = (title) => {
    // setCurrentTitle(e.target.innerText);
    setCurrentTitle(title);
    // setAiReply(null);
    setUserInput("");
    localStorage.setItem("lastChatTitle", JSON.stringify(title));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userInput.trim() === "") {
        alert("Please enter something");
        return;
      }

      //  Set chat title on first message
      const chatTitle = currentTitle || userInput;
      if (!currentTitle) setCurrentTitle(chatTitle);

      const payload = {
        message: userInput,
        model: selectAiModelName,
      };
      const res = await axios.post("http://localhost:4000/chat", payload);

      const userMessage = {
        title: chatTitle,
        role: "user",
        content: userInput,
      };

      const aiMessage = {
        title: chatTitle,
        role: res?.data?.role || "assistant",
        content: res?.data?.content || res?.data?.image || "No response",
      };
      // Add messages immediately to previousChats
      setPreviousChats((prevChats) => {
        const updatedChats = [...prevChats, userMessage, aiMessage];
        localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
        return updatedChats;
      });
      localStorage.setItem("lastChatTitle", JSON.stringify(chatTitle));

      // setAiReply(res?.data);
      setUserInput("");
    } catch (error) {
      console.log(error);
    }
  };
  // Getting cureent chat history with cureenttitle to display chats
  const currentChat = previousChats?.filter(
    (previousChats) => previousChats?.title === currentTitle
  );
  // console.log(currentChat);
  /// chat history using title
  const uniqueTitles = [
    ...new Set(previousChats?.map((previousChats) => previousChats?.title)),
  ];
  // console.log(uniqueTitles);
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setPreviousChats(storedChats);

    const lastChat = JSON.parse(localStorage.getItem("lastChatTitle"));
    setCurrentTitle(lastChat);
  }, []);
  const getAiModels = async () => {
    try {
      const res = await axios.get("http://localhost:4000/aiModels");
      setAiModels(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAiModels();
  }, []);

  // console.log(selectAiModelName);
  // googleLogout();
  const logout = () => {
    googleLogout();
    console.log("logout");
    setShowLogin(false);
  };
  return (
    <>
      {!showLogin ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const userDetails = jwtDecode(credentialResponse.credential);
            console.log(credentialResponse);

            console.log(userDetails);
            if (userDetails) {
              setShowLogin(true);
            }

            toast.success(` Welcome!! ${userDetails?.name}`);
            // navigate("/chat");
          }}
          onError={(error) => {
            console.log(error);
          }}
          logo_alignment="left"
          theme="filled_blue"
          shape="circle"
          text="signin_with"
          size="medium"
          width="200px"
          context="signin"
        />
      ) : (
        <div className="app">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <button type="submit" onClick={logout}>
            Log Out
          </button>
          <section className={`side-bar ${isSidebarOpen ? "open" : ""}`}>
            <button
              className="close-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              ✖
            </button>
            <button className="new-chat-button" onClick={createNewChat}>
              <span style={{ marginRight: "10px" }}>✚</span>
              New Chat
            </button>
            <select
              value={selectAiModelName}
              onChange={(e) => setSelectAiModelName(e.target.value)}
            >
              {aiModels?.map((model) => (
                <option value={model?.id} key={model.id}>
                  {model?.id}
                </option>
              ))}
            </select>
            <ul className="history">
              {uniqueTitles?.map((title, index) => (
                <li key={index} onClick={() => uniqueChatHistory(title)}>
                  {title}
                </li>
              ))}
            </ul>
            <button className="clear-chat-button" onClick={clearAllChatHistory}>
              Clear all chats
            </button>
            <nav>
              <p>Made By Dhivahar</p>
            </nav>
          </section>
          <section className="main">
            <h1 className="main-heading">ChatGpt</h1>
            <ul className="feed">
              {currentChat?.map((chat, index) => (
                <li key={index}>
                  {chat?.role === "user" ? (
                    <p className="role">
                      <UserCircleIcon width={30} />
                    </p>
                  ) : (
                    <p className="role">
                      <img src={ChatgptLogo} />
                    </p>
                  )}

                  <p>{chat?.content}</p>
                </li>
              ))}
            </ul>
            <div className="bottom-section">
              <div className="input-container">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <button
                    className="submit"
                    id="submit"
                    type="submit"
                    //  onClick={handleSubmit}
                  >
                    ➤
                  </button>
                </form>
              </div>
              <p className="info">
                Chat GPT 14 version. Free Research Preview.
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ChatPage;
