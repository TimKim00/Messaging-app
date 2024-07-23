const rootPath = "http://localhost:5173";
const fetchRootPath = "http://localhost:3000";

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

export { getPath, fetchPath };
