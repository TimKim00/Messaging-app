import Tooltip from "../components/Tooltip";

// HomePage Component
export default function HomePage() {
  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row lg:space-x-4">
      <aside className="lg:w-1/4 mb-4 lg:mb-0">
        <div className="p-4 bg-white rounded-lg shadow-md">
          {/* User Profile Section */}
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="mt-4 text-xl text-center font-bold">User Name</h2>
          <p className="mt-2 text-center text-gray-600">
            <Tooltip direction="left">User bio goes here.</Tooltip>
          </p>
        </div>
      </aside>
      <main className="lg:w-1/2 mb-4 lg:mb-0">
        {/* Posts Section */}
        <div className="p-4 bg-white rounded-lg shadow-md mb-4">
          <div className="flex items-center mb-2">
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-bold">Post User</h3>
              <p className="text-sm text-gray-500">Timestamp</p>
            </div>
          </div>
          <p>Post content goes here.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md mb-4">
          <div className="flex items-center mb-2">
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-bold">Post User</h3>
              <p className="text-sm text-gray-500">Timestamp</p>
            </div>
          </div>
          <p>Post content goes here.</p>
        </div>
      </main>
      <aside className="lg:w-1/4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          {/* Suggested Friends Section */}
          <h2 className="text-xl font-bold mb-4">Suggested Friends</h2>
          <div className="flex items-center mb-4">
            <img
              src="https://via.placeholder.com/50"
              alt="Friend"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-bold">Friend Name</h3>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <img
              src="https://via.placeholder.com/50"
              alt="Friend"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-bold">Friend Name</h3>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
