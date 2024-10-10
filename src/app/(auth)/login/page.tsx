"use client";
import Loading from "@/app/components/ui/Loading/Loading";
import React, { useEffect, useState } from "react";
import { login } from "./actions";
import Cookies from "js-cookie";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setError(null);
      Cookies.set("idToken", result.idToken, { expires: 7 });
      window.location.href = "/dashboard"; //Pakek window buat refresh javascript biar trigger useContext kalau router ngk ke trigger useContext
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-96 h-fit shadow-2xl rounded-xl p-5">
      <div className="p-5 space-y-4 md:space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Masukkan akun anda <span className="text-first-color">!</span>
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              maxLength={30}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="role@perusahaan.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            {error && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white bg-first-color hover:bg-first-color/hover font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Masuk
          </button>
          <div className="flex items-center justify-between">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              <a
                href="/daftar"
                className="font-medium text-first-color hover:underline dark:text-primary-500"
              >
                Daftar Sekarang
              </a>
            </p>
            <del
              // href="#"
              className="text-sm font-medium text-first-color italic"
            >
              Lupa Password?
            </del>
          </div>
        </form>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default page;
