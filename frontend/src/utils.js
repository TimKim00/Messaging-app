const rootPath =
  import.meta.env.MODE === "production"
    ? "https://messaging-app-2hys.onrender.com"
    : "http://localhost:5173";
const fetchRootPath =
  import.meta.env.MODE === "production"
    ? "https://messaging-app-backend-ywju.onrender.com"
    : "http://localhost:3000";

const getPath = (type, demo = false) => {
  let path = rootPath;
  if (demo) {
    path += "/demo";
  }
  switch (type) {
    case "login":
      return path + "/login";
    case "users":
      return path + "/users";
    default:
      return path;
  }
};

const fetchPath = (path) => {
  return fetchRootPath + path;
};

const fetchWithCredentials = async (url, options = {}) => {
  const defaultOptions = {
    // credentials: "include", // Include credentials (cookies)
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      withCredentials: true,
      ...options.headers,
    },
  };
  const mergedOptions = { ...defaultOptions, ...options };
  const response = await fetch(url, mergedOptions);
  return response;
};

function groupMessages(messages) {
  const groupedMessages = [];
  let currentBlock = [];
  const thirtyMinutes = 30 * 60 * 1000;

  messages.forEach((message) => {
    const messageTime = new Date(message.createTime);

    // Check if current block is empty or if the message belongs in the current block
    if (
      currentBlock.length === 0 ||
      (message.userId === currentBlock[0].userId &&
        messageTime - new Date(currentBlock[0].createTime) <= thirtyMinutes)
    ) {
      currentBlock.push(message);
    } else {
      // Push the current block to groupedMessages and start a new block
      groupedMessages.push(currentBlock);
      currentBlock = [message];
    }
  });

  // Push the last block if it has messages
  if (currentBlock.length > 0) {
    groupedMessages.push(currentBlock);
  }

  return groupedMessages;
}

export { getPath, fetchPath, fetchWithCredentials, groupMessages };
