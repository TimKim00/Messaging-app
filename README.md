# Messaging-app

The Odin Project style messaging app implementation. View [site](https://messaging-app-2hys.onrender.com/).

## Features
1. Authorization/authentication
2. Session management
3. Customizing user profile
4. Real-time messaging + images
5. Friends list
6. Private and public rooms
7. Group chat

## Feature implementation

*While I think SSR with template engines are better, for the purpose of learning I decide to use React and Client side rendering (CSR) for this project*  
### Layout
Using `pug` templating engine, create a layout. There should be a navigation panel on the left side of the screen, and the content panel should have different screens, with footer attached on the bottom for copyright information. Refer below page from @JaeG for ideas.

The nav bar should contain a redirect logo to the root, my rooms (`rooms/`), users (`users/`), public rooms page(`explore`), and logout button.

### Paths
`/fweeChat/` : Origin address. Redirects to `/login` when there's no access token, and `/` when there is one. 
`/`: Home page of the website. Displays a welcoming message with brief user history dashboard, explore section, and 'coming soon!' area.
`/chat/:chatId`: Chatting area from the chatroom associated with `roomId`. 
`/login`: Log in page for the website. 
`/users`: Users search page.
`/users/:userId`: user profile for user with `userId`. 
`/users/:userId/<update|remove>`: update or remove user profile.
`/explore`: public rooms page.

### Requests
**`/login/`**
* `GET`: displays a login screen. %% Frontend %%
* `POST`: send the user with the provided credentials. %% Backend %%
	* <font style="color:lime">Success</font>: returns the user object in json. Redirect to homepage.
	* <font style="color:orangered">Failure</font>: sends error.

**`/register/`**
* `GET`: displays a sign in screen. %% Frontend %%
* `POST`: create the user with the provided credentials. Return the user object. %% Backend %%
	* <font style="color:lime">Success</font>: returns the user object in json. Redirect to homepage.
	* <font style="color:orangered">Failure</font>: sends an error message (most likely repeated username).

**`/logout/`**
* `POST`: logs out the user by destroying the session id. %% Backend %%
	* <font style="color:lime">Success</font>: returns a "log out successful" json message.
	* <font style="color:orangered">Failure</font>: sends an error message.

**`/users/`**
* `GET`: gets all the users (except for a guest user) in the user database. %% Frontend + Backend %%
	* <font style="color:lime">Success</font>: returns (at most 50) user objects in json.
	* <font style="color:orangered">Failure</font>: sends an error message.

**`/users/friends/`**
* `GET`: displays a page. %% Frontend + Backend %%
	* <font style="color:lime">Success</font>: returns the trimmed (no private information) user's friends' information object in json.
	* <font style="color:orangered">Failure</font>: sends error.

**`/users/friends/:userId`**
* `POST`: adds the user with `userId` to the session user's friend list. %% Backend %%
	* <font style="color:lime">Success</font>: returns the new user object in json.
	* <font style="color:orangered">Failure</font>: sends an error message.
* `DELETE`: remove the friend from the session user's friend list. %% Backend %%
	* <font style="color:lime">Success</font>: returns the new user object in json.
	* <font style="color:orangered">Failure</font>: sends an error message.

`users/profile/:userId`
* `GET`: displays the user `userId`'s profile information. %% Frontend + Backend %%
	* <font style="color:lime">Success</font>: Displays the user profile.
	* <font style="color:orangered">Failure</font>: sends an error message
* `PATCH`: modifies the user `userId`'s profile information.  %% Backend %%
	* <font style="color:lime">Success</font>: Return a new profile information.
	* <font style="color:orangered">Failure</font>: sends an error message

**`/explore/:chatId`** 
* `GET`: displays all the public chatrooms.%% Frontend %%

**`/chat/`**
* `GET`: displays all the chat rooms in a reduced form that the current session user is in. %% Frontend + Backend %%
	* <font style="color:lime">Success</font>: Display all chatroom belonging to the session user.
	* <font style="color:orangered">Failure</font>: sends an error message.
* `POST`: create a chatroom. %% Backend %%
	* <font style="color:lime">Success</font>: Create a room, with users in `req.body.users` to the room's participants list and redirect to the chatroom.
	* <font style="color:orangered">Failure</font>: sends an error message.

`/chat/getMessages/`
* `GET`: Retreives the message with `msgId`.
	* <font style="color:lime">Success</font>: Returns the messages.
	* <font style="color:orangered">Failure</font>: sends an error message.

**`/chat/:chatId`**
* `GET`: displays the chat room with the most recent messages, divided by dates and such. %% Frontend + Backend %%
	* <font style="color:lime">Success</font>: Display the chatroom.
	* <font style="color:orangered">Failure</font>: sends an error message.
* `POST`: sends a message to the chatroom with `chatId`. %% Backend %%
	* <font style="color:lime">Success</font>: Send the message. Return the new chatroom object with the added message.
	* <font style="color:orangered">Failure</font>: sends an error message.
* `PATCH`: alters the room's information. %% Backend %%
	* <font style="color:lime">Success</font>: Send the new chatroom object
	* <font style="color:orangered">Failure</font>: sends an error message.

**`/chat/:chatId/:msgId`**
* `DELETE`: removes a message `msgId` from a chatroom `chatId`. %% Frontend + Backend %%
	* <font style="color:lime">Success</font>: Returns the new chatroom object with updated message. 
	* <font style="color:orangered">Failure</font>: sends an error message

### Database
I will use MongoDB and mongoose for ODM. I will have a database named `messageBoard`, with `users`, `rooms`, `messages`. Here's the schema definition, written in javascript.

```javascript
const UserSchema = new Schema({
	username: { type: String, requierd: true },
	h_password: { type: String, required: true}, //hashed password
	rooms: [{type: Schema.Types.ObjectId, ref: "Room"}],
	friends: [{type: Schema.Types.ObjectId, ref: "User"}],
	profileId: { type: Schema.Type.ObjectId, required: true, ref: "Profile" },
}); // As User

const RoomSchema = new Schema({
	name: { type: String, required: true},
	tags: { type: String, enum: ["Sports", "Gaming", "Politics", "Others"], default: "Others"},
	users: [{type: Schema.Types.ObjectId, ref: "User"}],
	messages: [{type: Schema.Types.ObjectId, ref: "Message"}],
	recentMessage: { type: Schema.Types.ObjectId, ref: "Message" },
	private: { type: Boolean, default: false },
	accessCode: { type: String },
	isGroup: {type: Boolean, default: false },
	createTime: { type: Date, required: true },
	updateTime: { type: Date, required: true },
}); // As Room

const MessageSchema = new Schema({
	userId: { type: Schema.Type.ObjectId, required: true, ref: "User" },
	roomId: { type: Schema.Type.ObjectId, required: true, ref: "Room"}, 
	message: { type: String },
	iMessage: { type: buffer }
	isImage: { type: Bool, default: false},
	createTime: { type: Date },
	flagged: { type: Bool, default: false},
}) // As Message

const ProfileSchema = new Schema({
	userId: { type: Schema.Type.ObjectId, required: true, ref: "User" },
	displayName: { type: String },
	bio: { type: String },
	profilePicture: { type: buffer },
	email: { type: String },
	// feed: { type: }
}) // As Profile
```
#### Authorization and authentication
Implement Authorization and authentication using `passport.js`. I will use localStorage feature of `passport-local` so that I can directly manage my users in my custom Mongo Database. However, to mimic the access token features from OAuth 2.0 protocols, I will generate token using `jsonwebtoken` library. When the user logs in or creates an account, the user's information gets tokenized and stored inside the cookie with 1 day expiration (so that we can test well). 

This token will have all the user information stored in the database.
#### Session management
I will use tokens and `express-session` to manage sessions and cookies. Each session is to last for 1 day, and I will invalidate the token afterwards. Upon log out, I will just overwrite cookie for this project. However, this is not the best practice!!

*Remove JWT part and just go with express-session*

#### Customizing user profile
I will store the user profile information in database with `UserSchema` model. Though I do not have profile image or room image as current feature, it is planned to be added in the future.

#### Real-time messaging + images
I will use `socket.io` to configure real-time communication. `socket.io` allows `express-session` and usage of cookies for implementation. 

#### Friends list
Using the `friends` field of the `UserSchema` model, implement friend feature. 

#### Private & Public rooms
Using the `private` field of the `RoomSchema` model, implement the private room. Rooms that are private will require a special access code. The access code will be hashed into the database. 

Only users whose `userId` is inside the `users` field of the room will be able to view the content. If not, it will be marked with "Join Room" template, which will be different among private and public rooms.
#### Group Chat
All Rooms are, by design, group chats. Individual chats will have `isGroup` field to be false and it will be private. 

Individual chats will only be initiated when you press "Send Message" button that should be visible in `/users/:userId` page. When clicked, a new chatroom will be created. In the future, we can do a more dynamic scoping in regards to chats, implementing things like blocked users and such. 


## Implementation Steps
1. Create SPA webpage with appropriate styling. Let each features be present in a separate path to see whether each features look correct.
2. Test Frontend features. 
3. Create appropriate databases, routes.
4. Create controllers for User data and implement CRUD features. 
5. Test user CRUD features.
6. Implement Rooms and Messaging features.
7. Test extended user, room, and messages and testing frameworks like `jest` or `mocha`. 
8. Connect Frontend and Backend part by 
9. Implement real-time communication with `socket.io`.
10. Test the project for the final time.
11. Modify environment variables and set environment to production. Add rate limiting and other production features, retest the program, and then deploy the frontend and backend servers. 


---

## Frontend Architecture
This project will be made as an SPA, therefore using `react-router` library. The layout will be the following. The app will have, in the broader scheme of things, main screen and authentication screen.

The main screen will have a nav-bar consisting of the home logo, my rooms, friends/users, public rooms, settings, and logout logos. The authentication screen refers to a simple login/signup screen. 

### Contexts
We need a global context of a user authentication information. This context will be useful for feeding all the necessary user information needed for our app.

**UserContext**
Wraps around the App.

### Pages
#### Root
The root page. All the pages that are to follow will be an Outlet of this area (excluding Log in and Sign in areas).

The Root will be wrapped around the `UserContextProvider` and `ThemeContextProvider`, which each provides the userContext and themeContext. All the descendants will be able to have access to the user's information (user's Id, username, friends, etc.), which can then be used make RESTful requests to the backend server.

The root will contain just a Navbar component and an outlet to either Home, Users, Chat, or Profile pages. If the userContext is not provided, then the root redirects to `LoginPage`
#### Home
The Home page contains the basic information about the user, with all the public rooms it can join and some additional feeds. It's like a dashboard.
#### Users
The users page contains A list of all users that are online and offline. Clicking a user's information pops up a new popup/toast in that area with additional options (view profile, start messaging, etc)

The users page uses `useContext` to retrieve context about the user, and fetch all socket user data and displays a profile page for any user in the database. There is a 'add friend' and 'send a message' functionality that is visible for any user that is not the user himself or herself.

#### Chat
The chat page displays all the chatrooms that the current user is part of. This information is transferred to the frontend server by fetching an api request from the backend server. The chat automatically updates when a new chat arrives. 
