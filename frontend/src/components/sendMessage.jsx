import PropTypes from "prop-types";
import useSendMessage from "../hooks/useSendMessage";
import { useState, useRef, useEffect, lazy, Suspense } from "react";
const EmojiPicker = lazy(() => import("emoji-picker-react")); // Adjust the import as necessary
import SendIcon from "../assets/send.svg";

// images
import Emoji from "../assets/emoji.svg";

const SendMessage = ({ roomId }) => {
  const { error, sendMessage, isLoading, newMessage, setNewMessage } =
    useSendMessage();
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojis(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleType = (e) => {
    e.preventDefault();
    setNewMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(roomId);
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prevState) => {
      return prevState + emojiObject.emoji;
    });
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white shadow-md">
        <div className="w-full flex items-center bg-gray-100 p-2 rounded-full shadow-inner">
          <button
            className="text-xl ml-2"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <img className="w-6 h-auto" src={Emoji} alt="" />
          </button>
          {showEmojis && (
            <div ref={emojiPickerRef} className="absolute bottom-12 left-4">
              <Suspense fallback={<div>Loading...</div>}>
                <EmojiPicker onEmojiClick={onEmojiClick} preload />
              </Suspense>
            </div>
          )}
          <textarea
            className="flex-grow mx-2 p-2 bg-gray-100 border-none resize-none focus:outline-none rounded-full"
            value={newMessage}
            onChange={handleType}
            placeholder="Send your message..."
          />
          <button
            className={`text-3xl mr-2 ${
              !newMessage ? "cursor-not-allowed" : ""
            } transition duration-200`}
            onClick={handleSend}
            disabled={!newMessage}
          >
            <img className="w-8 h-auto" src={SendIcon} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

SendMessage.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default SendMessage;
