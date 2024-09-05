const MessageIntro = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-12 rounded-lg shadow-xl max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-700">Welcome to Flashchat!</h1>
        <p className="text-xl mb-4 text-gray-700">Get started with messaging!</p>
        <p className="text-gray-600 mb-6">Here are a few steps to get you started:</p>
        <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
          <li>Create an account or log in if you already have one.</li>
          <li>Find your friends using the search feature.</li>
          <li>Start a conversation and enjoy seamless messaging.</li>
        </ul>
      </div>
    </div>
  );
};

export default MessageIntro;
