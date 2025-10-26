import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { asyncRegister } from "../store/slice/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await dispatch(asyncRegister({ name,email, password })).unwrap();
      navigate('/');
      toast.success('Registration successful! Please login.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration failed:', error);
    }
    console.log('Register:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Register for Task Management</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 bg-opacity-70 text-white text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline hover:text-blue-500 transition-all">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;