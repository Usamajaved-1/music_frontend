// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//  const handleAuth = async (e: React.FormEvent) => {
//   e.preventDefault();

//   const url = isLogin
//     ? 'http://127.0.0.1:8000/login'
//     : 'http://127.0.0.1:8000/register';

//   const headers = {
//     'Content-Type': isLogin
//       ? 'application/x-www-form-urlencoded'
//       : 'application/json',
//   };

//   const body = isLogin
//     ? new URLSearchParams({ username, password })
//     : JSON.stringify({ username, email, password });

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers,
//       body,
//     });

//     if (!response.ok) {
//       const errData = await response.json();
//       throw new Error(errData.detail || 'Authentication failed');
//     }

//     const data = await response.json();

//     if (isLogin) {
//       localStorage.setItem('token', data.access_token);
//       if (data.role === 'admin') {
//         alert('Login as admin successful!');
//       } else {
//         alert('Login successful!');
//       }
//       router.push('/');
//     } else {
//       // ✅ Auto-login after successful registration
//       const loginRes = await fetch('http://127.0.0.1:8000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           username,
//           password,
//         }),
//       });

//       if (!loginRes.ok) throw new Error('Auto-login failed after registration');

//       const loginData = await loginRes.json();
//       localStorage.setItem('token', loginData.access_token);

//       if (loginData.role === 'admin') {
//         alert('Registered & logged in as admin!');
//       } else {
//         alert('Registered & logged in!');
//       }

//       router.push('/');
//     }
//   } catch (err: any) {
//     setError(err.message);
//   }
// };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         {isLogin ? 'Login' : 'Register'}
//       </h1>

//       {error && <p className="text-red-500 mb-2">{error}</p>}

//       <form onSubmit={handleAuth} className="flex flex-col gap-4">
//         {!isLogin && (
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="border p-2 rounded text-black"
//           />
//         )}
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={e => setUsername(e.target.value)}
//           className="border p-2 rounded text-black"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           className="border p-2 rounded text-black"
//         />

//         <button type="submit" className="bg-blue-600 text-white py-2 rounded">
//           {isLogin ? 'Login' : 'Register'}
//         </button>
//       </form>

//       <p className="mt-4 text-center text-sm">
//         {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
//         <button
//           onClick={() => {
//             setIsLogin(!isLogin);
//             setError('');
//           }}
//           className="text-blue-600 underline"
//         >
//           {isLogin ? 'Register here' : 'Login here'}
//         </button>
//       </p>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isLogin
      ? "http://127.0.0.1:8000/login"
      : "http://127.0.0.1:8000/register";

    const headers = {
      "Content-Type": isLogin
        ? "application/x-www-form-urlencoded"
        : "application/json",
    };

    const body = isLogin
      ? new URLSearchParams({ username, password })
      : JSON.stringify({ username, email, password });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Authentication failed");
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem("token", data.access_token);
        alert(
          data.role === "admin"
            ? "Login as admin successful!"
            : "Login successful!"
        );
        router.push("/");
      } else {
        const loginRes = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username,
            password,
          }),
        });

        if (!loginRes.ok)
          throw new Error("Auto-login failed after registration");

        const loginData = await loginRes.json();
        localStorage.setItem("token", loginData.access_token);

        alert(
          loginData.role === "admin"
            ? "Registered & logged in as admin!"
            : "Registered & logged in!"
        );

        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2">
          Welcome to
        </h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Music Learning School
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`px-4 py-2 rounded-full transition font-semibold ${
              isLogin
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-blue-600 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`px-4 py-2 rounded-full transition font-semibold ${
              !isLogin
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-blue-600 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
              required
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
