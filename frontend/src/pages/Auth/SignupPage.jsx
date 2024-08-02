import { useState } from "react";
import Logo from "../../assets/logo.svg";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import useSignup from "../../hooks/useSignup";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { error, signup, isLoading, setIsLoading, setError } = useSignup();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Add your signup logic here
    await signup(username, password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Signup */}
      <section className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Logo and Signup Message */}
        <div className="text-center mb-8">
          <img src={Logo} alt="logo" className="mx-auto h-24 w-auto" />
          <h1 className="text-2xl font-bold">
            <span>Create an Account</span>
          </h1>
        </div>
        {/* Forms */}
        <form onSubmit={handleSignupSubmit}>
          <div id="username-field" className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              USERNAME
            </label>
            <div className="mt-1">
              <input
                type="text"
                placeholder="Your username"
                name="username"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div id="password-field" className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              PASSWORD
            </label>
            <div className="mt-1">
              <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <Loading
                visible={true}
                dim={16}
                color="white"
              />
            ) : (
              <span>Sign Up</span>
            )}
          </button>
          {error ? <Error error={error} /> : <></>}
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500"> Login </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
