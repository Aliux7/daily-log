"use client";
import React, { useEffect } from "react";
import "./Clock.css";

const Clock: React.FC = () => {
  useEffect(() => {
    const hour = document.getElementById("clock-hour") as HTMLDivElement,
      minutes = document.getElementById("clock-minutes") as HTMLDivElement,
      seconds = document.getElementById("clock-seconds") as HTMLDivElement,
      textHour = document.getElementById("text-hour") as HTMLDivElement,
      textMinutes = document.getElementById("text-minutes") as HTMLDivElement,
      textSeconds = document.getElementById("text-seconds") as HTMLDivElement,
      textAmPm = document.getElementById("text-ampm") as HTMLDivElement,
      dateDay = document.getElementById("date-day") as HTMLDivElement,
      dateMonth = document.getElementById("date-month") as HTMLDivElement,
      dateYear = document.getElementById("date-year") as HTMLDivElement,
      themeButton = document.getElementById(
        "theme-button"
      ) as HTMLButtonElement;

    const clock = () => {
      let date = new Date();

      let hh = date.getHours() * 30,
        mm = date.getMinutes() * 6,
        ss = date.getSeconds() * 6;

      // Add rotation to the elements
      if (hour) hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
      if (minutes) minutes.style.transform = `rotateZ(${mm}deg)`;
      if (seconds) seconds.style.transform = `rotateZ(${ss}deg)`;
    };
    setInterval(clock, 1000);

    const clockText = () => {
      let date = new Date();

      let hh = date.getHours(),
        ampm,
        mm = date.getMinutes(),
        ss = date.getSeconds(),
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear();

      if (hh >= 12) {
        ampm = "PM";
      } else {
        ampm = "AM";
      }

      textHour && hh < 10
        ? (textHour.innerHTML = `0${hh}:`)
        : (textHour.innerHTML = `${hh}:`);
      textMinutes && mm < 10
        ? (textMinutes.innerHTML = `0${mm}:`)
        : (textMinutes.innerHTML = `${mm}:`);
      textSeconds && ss < 10
        ? (textSeconds.innerHTML = `0${ss}`)
        : (textSeconds.innerHTML = `${ss}`);
      if (textAmPm) textAmPm.innerHTML = ampm;

      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      if (dateDay) dateDay.innerHTML = day.toString();
      if (dateMonth) dateMonth.innerHTML = ` ${months[month]}, `;
      if (dateYear) dateYear.innerHTML = year.toString();
    };
    setInterval(clockText, 1000);

    const getCurrentTheme = () =>
      document.body.classList.contains("dark-theme") ? "dark" : "light";
    const getCurrentIcon = () =>
      themeButton?.classList.contains("bxs-moon") ? "bxs-moon" : "bxs-sun";

    const selectedTheme = localStorage.getItem("selected-theme");
    const selectedIcon = localStorage.getItem("selected-icon");

    if (selectedTheme) {
      document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        "dark-theme"
      );
      themeButton?.classList[selectedIcon === "bxs-moon" ? "add" : "remove"](
        "bxs-moon"
      );
    }

    themeButton?.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      themeButton?.classList.toggle("bxs-moon");
      localStorage.setItem("selected-theme", getCurrentTheme());
      localStorage.setItem("selected-icon", getCurrentIcon());
    });
  }, []);

  return (
    <div className="clock__container grid">
      <div className="clock__content grid">
        <div className="clock__circle">
          <span className="clock__twelve"></span>
          <span className="clock__three"></span>
          <span className="clock__six"></span>
          <span className="clock__nine"></span>

          <div className="clock__rounder"></div>
          <div className="clock__hour" id="clock-hour"></div>
          <div className="clock__minutes" id="clock-minutes"></div>
          <div className="clock__seconds" id="clock-seconds"></div>
        </div>

        <div className="py-3 px-5 rounded-lg">
          <div className="clock__date text-sm">
            <span id="date-day"></span>
            <span id="date-month"></span>
            <span id="date-year"></span>
          </div>
          <div className="clock__text">
            <div className="clock__text-hour" id="text-hour"></div>
            <div className="clock__text-minutes" id="text-minutes"></div>
            <div className="clock__text-minutes" id="text-seconds"></div>
          </div>
          <div
            className="clock__text-ampm text-center text-sm"
            id="text-ampm"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
