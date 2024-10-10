"use client";
import React, { useState } from "react";
import { checkCompanyName, registerNewCompany } from "./actions";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/components/ui/Loading/Loading";
import { useRouter } from "next/navigation";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [usaha, setUsaha] = useState("");
  const [errorUsaha, setErrorUsaha] = useState<string | null>(null);

  const [telepon, setTelepon] = useState("");
  const [errorTelepon, setErrorTelepon] = useState<string | null>(null);

  const [emailOwner, setEmailOwner] = useState("");
  const [errorEmailOwner, setErrorEmailOwner] = useState<string | null>(null);

  const [passwordOwner, setPasswordOwner] = useState("");
  const [errorPasswordOwner, setErrorPasswordOwner] = useState<string | null>(
    null
  );

  const [emailAdmin, setEmailAdmin] = useState("");
  const [errorEmailAdmin, setErrorEmailAdmin] = useState<string | null>(null);

  const [passwordAdmin, setPasswordAdmin] = useState("");
  const [errorPasswordAdmin, setErrorPasswordAdmin] = useState<string | null>(
    null
  );

  const handleCompanyNameInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    value = value
      .replace(/[_ ]/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    setUsaha(value);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    setTelepon(value);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleValidationInput = () => {
    let valid = true;

    if (usaha.length < 3 || usaha.length > 25) {
      setErrorUsaha("Harap memasukan 3 - 25 karakter.");
      valid = false;
    } else {
      setErrorUsaha("");
    }

    if (
      telepon.length < 7 ||
      (!telepon.startsWith("08") && !telepon.startsWith("628"))
    ) {
      setErrorTelepon("Harap memasukan telepon dengan benar.");
      valid = false;
    } else {
      setErrorTelepon("");
    }

    if (!validateEmail(emailOwner)) {
      setErrorEmailOwner("Harap memasukan format email dengan benar.");
      valid = false;
    } else {
      setErrorEmailOwner(" ");
    }

    if (
      passwordOwner.length < 5 ||
      passwordOwner.toLowerCase() == passwordOwner ||
      passwordOwner.toUpperCase() == passwordOwner
    ) {
      setErrorPasswordOwner("Minimal 5 Karakter dengan huruf besar dan kecil");
      valid = false;
    } else {
      setErrorPasswordOwner("");
    }

    if (!validateEmail(emailAdmin)) {
      setErrorEmailAdmin("Harap memasukan format email dengan benar.");
      valid = false;
    } else {
      setErrorEmailAdmin(" ");
    }

    if (
      passwordAdmin.length < 5 ||
      passwordAdmin.toLowerCase() == passwordAdmin ||
      passwordAdmin.toUpperCase() == passwordAdmin
    ) {
      setErrorPasswordAdmin("Minimal 5 Karakter dengan huruf besar dan kecil");
      valid = false;
    } else {
      setErrorPasswordAdmin("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const valid = handleValidationInput();
    if (!valid) {
      setLoading(false);
      return;
    }

    const validateCompanyName = await checkCompanyName(usaha);
    if (
      validateCompanyName.exists == true ||
      validateCompanyName.success == false
    ) {
      setErrorUsaha("Nama usaha telah digunakan.");
      setLoading(false);
      return;
    }

    const result = await registerNewCompany(
      usaha,
      emailOwner,
      passwordOwner,
      emailAdmin,
      passwordAdmin,
      telepon
    );

    if (result.success) {
      toast({
        title: "Pendaftaran Berhasil ! !",
        description: "Usaha anda telah berhasil terdaftar. Selamat Datang.",
        type: "background",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      toast({
        title: "Pendaftaran Gagal ! !",
        description: "Mohon Maaf, Silakan hubungan layanan bantuan.",
        type: "foreground",
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white w-96 h-fit max-h-[80vh] min-h-[400px] overflow-y-auto shadow-2xl rounded-xl p-5">
      <div className="p-5 space-y-4 md:space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Membuat akun baru <span className="text-first-color">!</span>
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="nama_usaha"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nama Usaha
            </label>
            <input
              type="text"
              name="nama_usaha"
              id="nama_usaha"
              value={usaha}
              maxLength={25}
              onChange={handleCompanyNameInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="AbsenKu"
              required
            />
            {errorUsaha && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {errorUsaha}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="nomor_telepon"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="nomor_telepon"
              id="nomor_telepon"
              value={telepon}
              maxLength={25}
              onChange={handlePhoneInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="08xxxxxxxxxx"
              required
            />
            {errorTelepon && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {errorTelepon}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email_owner"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email Owner
            </label>
            <input
              value={emailOwner}
              onChange={(e) => setEmailOwner(e.target.value)}
              type="email"
              name="email_owner"
              id="email_owner"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="example@gmail.com"
              required
            />
            {errorEmailOwner && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {errorEmailOwner}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password_owner"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password Owner
            </label>
            <input
              type="password"
              name="password_owner"
              id="password_owner"
              placeholder="••••••••••••••••"
              value={passwordOwner}
              onChange={(e) => setPasswordOwner(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            {errorPasswordOwner && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {errorPasswordOwner}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email_admin"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email Admin
            </label>
            <input
              value={emailAdmin}
              onChange={(e) => setEmailAdmin(e.target.value)}
              type="email"
              name="email_admin"
              id="email_admin"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="admin@perusahaan.com"
              required
            />
            {errorEmailAdmin && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {errorEmailAdmin}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password_admin"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password Admin
            </label>
            <input
              type="password"
              name="password_admin"
              id="password_admin"
              placeholder="••••••••••••••••"
              value={passwordAdmin}
              onChange={(e) => setPasswordAdmin(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-first-color focus:border-first-color block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            {errorPasswordAdmin && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                {errorPasswordAdmin}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white bg-first-color hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-first-color dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Daftar
          </button>
          <div className="flex items-center justify-center">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
              Sudah Punya Akun?{" "}
              <a
                href="/login"
                className="font-medium text-first-color hover:underline dark:text-primary-500"
              >
                Login Sekarang
              </a>
            </p>
          </div>
        </form>
      </div>
      {loading && <Loading />}
      <Toaster />
    </div>
  );
};

export default page;
