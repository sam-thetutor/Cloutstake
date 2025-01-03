import React from "react";
import { FaTwitter, FaDiscord, FaTelegram } from "react-icons/fa";
import Img from "../assets/clout.png";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const Homepage = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "white",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  };

  return (
    <div className="relative w-full flex-col h-[100vh] bg-[#151719] gap-8 flex justify-center items-center">
      {/* <Particles id="tsparticles" init={particlesInit} options={particlesOptions} /> */}
      {/* <div className="absolute bottom-4 right-4 flex space-x-4">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-white text-2xl" />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <FaDiscord className="text-white text-2xl" />
        </a>
        <a
          href="https://telegram.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram className="text-white text-2xl" />
        </a>
      </div> */}
      <div className="relative flex w-full  justify-center items-center">
        <img
          src={Img}
          alt="Clout"
          className="w-64 h-64 rounded-full animate-blink"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-64 h-64 rounded-full border-4 border-white animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <button className="flex bg-[#1a233f] text-white  justify-center items-center">
          <a
            href="https://app.icpswap.com/swap?input=ryjl3-tyaaa-aaaaa-aaaba-cai&output=2dw2h-gyaaa-aaaam-qcu3a-cai"
            target="_blank"
            style={{textDecoration:"none",color:"white"}}
          >
            ICPSwap
          </a>
        </button>
        <button className="flex bg-green-900  justify-center items-center">
          <a
          className="flex "
            href="https://www.kongswap.io/swap?from=ryjl3-tyaaa-aaaaa-aaaba-cai&to=2dw2h-gyaaa-aaaam-qcu3a-cai"
            target="_blank"
            style={{textDecoration:"none",color:"white"}}
          >
            KongSwap
          </a>
        </button>
        <button className="flex bg-blue-900 justify-center items-center">
          <a
          className="flex "
            href="https://x.com/goty2025"
            target="_blank"
            style={{textDecoration:"none",color:"white"}}
          >
            Twitter
          </a>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
