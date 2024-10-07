"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { SiCountingworkspro } from "react-icons/si";
import { IoLogOut } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase/firebaseConfig";
import { RiMoneyDollarCircleFill } from "react-icons/ri";



import { useRouter } from "next/navigation";
import { RiFileHistoryFill } from "react-icons/ri";
import { logout } from "@/app/(auth)/login/actions";

const Sidebar = () => {
  const router = useRouter();
  const [items, setItems] = useState([
    {
      name: "Dashboard",
      icon: <MdSpaceDashboard color="#383F6B" className="w-3 h-3" />,
      destination: "/dashboard",
    },
    {
      name: "Absensi",
      icon: <FaClock color="#383F6B" className="w-3 h-3" />,
      destination: "/absensi",
    },
    {
      name: "Rekap",
      icon: <RiFileHistoryFill color="#383F6B" className="w-3 h-3" />,
      destination: "/rekap",
    },
    {
      name: "Karyawan",
      icon: <FaUser color="#383F6B" className="w-3 h-3" />,
      destination: "/karyawan",
    },
    {
      name: "Gaji",
      icon: <RiMoneyDollarCircleFill  color="#383F6B" className="w-3 h-3" />,
      destination: "/karyawan",
    },
    {
      name: "Catatan",
      icon: <PiNotepadFill color="#383F6B" className="w-3 h-3" />,
      destination: "/catatan",
    },
    {
      name: "Log",
      icon: <SiCountingworkspro color="#383F6B" className="w-3 h-3" />,
      destination: "log",
    },
  ]);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const genericHamburgerLine = `h-[0.2rem] my-[0.15rem] rounded-full bg-black transition ease transform duration-300`;

  const handleLogout = async () => {
    await logout();
    Cookies.remove("idToken");
    router.push("/login");
  };

  return (
    <>
      <aside className="h-screen w-fit z-50 bg-background-color rounded-t-2xl">
        <nav
          className={`h-full flex flex-col py-7 px-4 transition-all duration-300 ease-in-out ${
            toggleSidebar ? "w-60" : "w-[5.55rem]"
          }`}
        >
          <div className="flex justify-start items-center gap-4 h-7">
            <button
              className={`flex flex-col h-fit w-fit rounded justify-center items-start group transition-all duration-300 ease-in-out ${
                toggleSidebar ? "ml-2" : "ml-3.5"
              }`}
              onClick={() => setToggleSidebar(!toggleSidebar)}
            >
              <div
                className={`${genericHamburgerLine} ${
                  toggleSidebar
                    ? "rotate-45 translate-y-2 opacity-60 group-hover:opacity-100 w-6"
                    : "opacity-60 group-hover:opacity-100 w-6"
                }`}
              />
              <div
                className={`${genericHamburgerLine} ${
                  toggleSidebar
                    ? "opacity-0"
                    : "opacity-60 group-hover:opacity-100 w-4 bg-first-color"
                }`}
              />
              <div
                className={`${genericHamburgerLine} ${
                  toggleSidebar
                    ? "-rotate-45 -translate-y-2 opacity-60 group-hover:opacity-100 w-6"
                    : "opacity-60 group-hover:opacity-100 w-5"
                }`}
              />
            </button>

            <strong
              className={`text-xl transition-all duration-400 ease-in-out overflow-x-hidden ${
                toggleSidebar ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <Link href="/dashboard">
                AbsenKu<span className="text-first-color">.</span>
              </Link>
            </strong>
          </div>
          <ul className="my-5 font-sans h-full relative">
            {items.map((item, index) => (
              <li key={index}>
                <Link href={item.destination}>
                  <div className="flex justify-start items-center gap-3 px-2.5 py-2 rounded-xl cursor-pointer hover:bg-gray-100">
                    <div className="bg-white rounded-lg shadow-xl p-3">
                      {item.icon}
                    </div>
                    <div
                      className={`transition-all duration-400 ease-in-out overflow-x-hidden ${
                        toggleSidebar ? "opacity-100 w-auto" : "opacity-0 w-0"
                      }`}
                    >
                      <p className="">{item.name}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}

            <li className="absolute bottom-0 w-full">
              <div onClick={handleLogout}>
                <div className="flex justify-start items-center gap-3 px-2.5 py-2 rounded-xl cursor-pointer hover:bg-gray-100">
                  <div className="bg-white rounded-lg shadow-xl p-3">
                    <IoLogOut color="#383F6B" className="w-3 h-3" />
                  </div>
                  <div
                    className={`transition-all duration-400 ease-in-out overflow-x-hidden ${
                      toggleSidebar ? "opacity-100 w-auto" : "opacity-0 w-0"
                    }`}
                  >
                    <p className="">Keluar</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
