import bgimage from "./../../assets/images/uppermustang2.png";
import sherapsherpa from "./../../assets/images/sherapsherpa.jpg";
import roshan from "./../../assets/images/roshan.jpg";
import pawan from "./../../assets/images/pawan.jpg";
import nimadorje from "./../../assets/images/Nima-Dorje.jpg";
import manohar from "./../../assets/images/manohar.jpg";
import team from "./../../assets/images/whoweare.jpg";
import cover from "./../../assets/images/aboutuscover.jpg";

import { useEffect } from "react";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${cover})`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1
              className="mb-5 font-bebas text-7xl font-bold"
              style={{ color: "#fdb913", letterSpacing: "0.1em" }}
            >
              About Us
            </h1>
          </div>
        </div>
      </div>
      <div className="grid grid-col-2 p-10">
        <div className="flex gap-10">
          <div className="w-1/2 pl-15 pr-10">
            <h1
              className="flex text-4xl font-bold font-poppins uppercase justify-center items-center"
              style={{ lineHeight: 2 }}
            >
              Who We Are
            </h1>
            <div className="font-nunito text-justify">
              <p className="pb-3">
                Wild Tracks is a touring company specializing in high quality
                adventure motorbike tours. Wild Tracks offers fully guided
                motorcycle tours in Nepal, Tibet, Bhutan and some parts of India
                on classic Royal Enfield 500cc bikes and Enfield Himalayan
                411cc.
              </p>

              <p className="pb-3">
                All our tours are carefully designed by professional, well
                qualified and a passionate rider Sherap Sherpa, who is also a
                keen photographer and an avid traveller with more than 20 years
                of riding experience.
              </p>
              <p className="pb-3">
                Our unique itineraries are designed with great attention to give
                you maximum fun, thrills and a riding experience of a lifetime
                on two wheels with support of our ever-smiling guide, driver and
                mechanics.
              </p>
            </div>
          </div>
          <div className="w-1/2">
            <img src={team} />
          </div>
        </div>
      </div>

      <div className="grid grid-col-2 p-10 mt-15">
        <div className="flex gap-10">
          <div className="w-1/2 pl-15 pr-10">
            <h1
              className="flex text-2xl font-bold font-poppins uppercase justify-center items-center"
              style={{ lineHeight: 2, letterSpacing: "0.1em" }}
            >
              Sherap Sherpa - Tour Leader
            </h1>
            <div className="font-nunito " style={{ textAlign: "justify" }}>
              <p className="pb-3">
                Sherap Sherpa, an arts and IT graduate and a passionate rider
                for more than 25 years is the proud owner of Wild Tracks Nepal.
                Most of the tours of Wild Tracks are lead personally by Sherap
                with safety and his unmatched hospitality as his primary assets.
              </p>

              <p className="pb-3">
                A self styled Solo explorer, photographer and a Foodie, Sherap
                has travelled extensively all over Nepal, Bhutan, India and some
                parts of Tibet and Thailand on motorbike. Sherap (a former web
                and graphic designer) has a small collection of vintage
                motorcycles and is an avid reader too.
              </p>
              <p className="pb-3">
                “Thanks for visiting my website. I look forward to show you my
                beautiful places on two wheels.” - Sherap Sherpa
              </p>
            </div>
          </div>
          <div className="w-1/2">
            <img src={sherapsherpa} />
          </div>
        </div>
      </div>

      {/*Nima Dorje*/}
      <div className="m-15 min-h-40 bg-[#dddd] flex justify-around ">
        <div className="col-span-2 pt-10 pr-5">
          <h2
            className="flex font-bold uppercase font-poppins justify-center"
            style={{
              letterSpacing: "0.05em",
            }}
          >
            Nima Dorje - Assistant Tour Leader
          </h2>
          <p className="pr-5 font-nunito pl-5">
            Nima, a young and energetic rider accompanies most of our tours as
            assistant guide. He is the one who makes sure no-one is left behind
            or stuck due bike issues during our tour. He loves talking and his
            sense of humour is out of this world.
          </p>
        </div>

        <div className="flex w-[300px] h-[300px] justify-end shrink-0">
          <img className="h-full object-cover w-full" src={nimadorje} />
        </div>
      </div>

      {/*Pumar Kumar Limbu*/}
      <div
        className="m-15 min-h-40 flex justify-around "
        style={{ backgroundColor: "#dddd" }}
      >
        <div className="col-span-2 pt-10 pr-5">
          <h2
            className="flex font-bold uppercase font-poppins justify-center"
            style={{
              letterSpacing: "0.05em",
            }}
          >
            Pumar Kumar Limbu - Overseas contact
          </h2>
          <p className="pr-5 font-nunito pl-5 pb-5">
            Pumar Kumar Limbu or we simply call him Paone Bhai originally from
            Dharan, East Nepal, currently living in Hobart, Tasmania is our
            contact for Australian Continent. A young and passionate rider with
            years of experience. Wild Tracks is proud to have him onboard our
            team. <br />
            Glenorchy, Tasmania. 0410755315. Email: limbpa1@gmail.com
          </p>
        </div>

        <div className="flex w-[300px] h-[300px] justify-end shrink-0">
          <img className="h-full object-cover w-full" src={pawan} />
        </div>
      </div>

      {/*Roshan Tamang */}
      <div
        className="m-15 min-h-40 flex justify-around "
        style={{ backgroundColor: "#dddd" }}
      >
        <div className="col-span-2 pt-10 pr-5">
          <h2
            className="flex font-bold uppercase font-poppins justify-center"
            style={{
              letterSpacing: "0.05em",
            }}
          >
            Roshan Tamang - our patient driver
          </h2>
          <p className="pr-5 font-nunito pl-5">
            Roshan has been with us since August 2016. He has been working as a
            professional driver for more than a decade and has travelled all
            over Nepal with us
          </p>
        </div>

        <div className="flex w-[300px] h-[300px] justify-end shrink-0">
          <img className="h-full object-cover w-full" src={roshan} />
        </div>
      </div>

      {/*Manohar Muhammud*/}
      <div
        className="m-15 min-h-40 flex justify-around "
        style={{ backgroundColor: "#dddd" }}
      >
        <div className="col-span-2 pt-10 pr-5">
          <h2
            className="flex font-bold uppercase font-poppins justify-center"
            style={{
              letterSpacing: "0.05em",
            }}
          >
            Manohar Muhammud - Our bike doctor
          </h2>
          <p className="pr-5 font-nunito pl-5">
            Manohar - our bike doctor can figure out most bike problems by
            listening to the sound. He accompanies us as our official mechanic
            in all our tours. Manohar originally comes from Bihar, India and
            runs a motorcycle service center in Kathmandu when not touring with
            us.
          </p>
        </div>

        <div className="flex w-[300px] h-[300px] justify-end shrink-0">
          <img className="h-full object-cover w-full" src={manohar} />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
