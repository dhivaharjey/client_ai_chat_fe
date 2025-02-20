import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import ChatgptLogo from "./assets/chatgpt.webp";

import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  getItemLocalStorage,
  removeItemLocalStorage,
  setItemLocalStorage,
} from "./helper/helper";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  // const [aiReply, setAiReply] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [aiModels, setAiModels] = useState(null);
  const [selectAiModelName, setSelectAiModelName] = useState("gpt-4o-mini");
  const [showLogin, setShowLogin] = useState(false);
  const [guestUser, setGuestUser] = useState(false);
  const bottomRef = useRef(null);
  console.log("initial", guestUser);

  const guestUserLogin = () => {
    setGuestUser(true);
    setShowLogin(true);
    setItemLocalStorage("guestUser", "guestUserDetails");
    console.log("logout in", guestUser);
  };

  const clearAllChatHistory = () => {
    removeItemLocalStorage("chatHistory");
    removeItemLocalStorage("lastChatTitle");
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
    setItemLocalStorage("lastChatTitle", title);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (userInput.trim() === "") {
        toast.warn("Please enter something");
        return;
      }

      //  Set chat title on first message
      const chatTitle = currentTitle || userInput;
      if (!currentTitle) setCurrentTitle(chatTitle);

      const payload = {
        message: userInput,
        model: selectAiModelName,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat`,
        payload
      );

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
        if (!guestUser) {
          setItemLocalStorage("chatHistory", updatedChats);
        }
        return updatedChats;
      });
      if (!guestUser) {
        setItemLocalStorage("lastChatTitle", chatTitle);
      }
      // setAiReply(res?.data);
      setUserInput("");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
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
    console.log("use efefect", guestUser);
    getAiModels();
    const user = getItemLocalStorage("userDetails");
    if (user) {
      setShowLogin(true);
    }
    const guestUserInfo = getItemLocalStorage("guestUser");
    if (guestUserInfo) {
      setShowLogin(true);
    }
    const storedChats = guestUser
      ? []
      : getItemLocalStorage("chatHistory") || [];
    setPreviousChats(storedChats);

    const lastChat = guestUser ? "" : getItemLocalStorage("lastChatTitle");
    setCurrentTitle(lastChat);
  }, [guestUser]);
  const getAiModels = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/aiModels`);
      setAiModels(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    googleLogout();
    removeItemLocalStorage("userDetails");
    setShowLogin(false);
    // if (guestUser) {
    //   clearAllChatHistory();
    // }
    setGuestUser(false);
    console.log("logout", guestUser);
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [currentChat, isLoading]);
  return (
    <>
      <ToastContainer />
      {!showLogin ? (
        <div className="signin-page">
          <div className="login">
            <div>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const userDetails = jwtDecode(credentialResponse.credential);
                  // console.log(credentialResponse);

                  console.log(userDetails);
                  if (userDetails) {
                    setShowLogin(true);
                  }

                  setItemLocalStorage("userDetails", userDetails?.name);
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
            </div>
            <div>
              <button className="guest-user-button" onClick={guestUserLogin}>
                SingIn Guest User
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="app">
          <div
            className="user"
            title={
              guestUser ? "Guest User" : getItemLocalStorage("userDetails")
            }
          >
            <div className="user-name">
              {getItemLocalStorage("userDetails")}
            </div>
            <UserCircleIcon width={30} />
          </div>
          <button
            className="menu-btn"
            title="menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
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
            <div className="button-container">
              <button
                className="clear-chat-button"
                onClick={clearAllChatHistory}
              >
                Clear All Chats
              </button>
              <button
                type="submit"
                onClick={logout}
                className="logout-button"
                onTouchMove="Hii"
              >
                Log Out
              </button>
            </div>
            <nav>
              <p>Made By Dhivahar</p>
            </nav>
          </section>
          <section className="main">
            <h1 className="main-heading">ChatGpt</h1>
            <ul className="feed">
              {currentChat?.map((chat, index) => (
                <>
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
                </>
              ))}
              {isLoading && <p>Loading.... ⏳</p>}
              <div ref={bottomRef}></div>
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
                    disabled={isLoading}
                  >
                    {isLoading ? <span>⏳</span> : <span>➤</span>}
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

export default App;
