const rootPath = "http://localhost:5173/fweechat";

const getPath = (type, demo=false) => {
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
}

export { getPath, }