import { useState, useEffect } from "react";
import useFetchUsers from "../../hooks/useFetchUsers";
import { socket } from "../../socket";

export default function UserPage() {
    // Retreive the list of users.
    const { error, fetchUsers, isLoading, globalUsers } = useFetchUsers();
    const [parsedUsers, setParsedUsers] = useState([]);

    useEffect(() => {
        const parseUsers = (onlineUsers) => {
            const onlineSet = new Set(onlineUsers); // Hashset.
            const tempArr = [];

            globalUsers.forEach((user) => {
                if (onlineSet.has(user)) {
                    tempArr.push({user, online: true});
                } else {
                    tempArr.push({user, online: false});
                }
            })
            setParsedUsers(tempArr);
        }
        socket.on("getUser", parseUsers);

        return () => {
            socket.off("getUser", parseUsers);
        }
    }, [globalUsers])



  return;
}
