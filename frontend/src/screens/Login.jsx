import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { asyncLogin, loggedInUser } from "../store/slice/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
       await dispatch(asyncLogin({ email, password })).unwrap();
       toast.success('Login successful!');
       navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login to Task Management</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline hover:text-blue-500 transition-all">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;