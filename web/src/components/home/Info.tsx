import React from 'react';
import Image from 'next/image';

import LaptopScreen from './LaptopScreen';
import LabReport from '../../public/promo/Lab-Report-Example.png';
import ShareExample from '../../public/promo/Share-Example.png';
import MathExample from '../../public/promo/Math-Example.png';
import SearchExample from '../../public/promo/Search-Example.png';

const Info = () => (
  <div className="max-w-4xl mx-auto">
    <p className="flex flex-col items-center m-8 mx-auto text-6xl font-bold text-center">
      Collaborate
    </p>
    <p className="my-8 text-2xl font-bold">
      Collaborate effortlessly with Note Rack and work together with classmates.
      No more endless scrolling through handwritten notes or spending
      hours trying to find the right information.
    </p>

    <div className="flex w-full mx-8 my-24">
      <div className="w-1/2">
        <p className="text-4xl font-bold">
          Share
        </p>
        <p className="my-2 text-lg font-bold">
          Share your notes with ease using Note Rack
          and collaborate seamlessly with your classmates.
          No more emailing or printing notes for group projects.
        </p>
      </div>
      <div className="flex items-center justify-center w-1/2 h-full">
        <div className="relative flex">
          <LaptopScreen>
            <Image
              src={LabReport}
              className="rounded-md aspect-square"
              height={300}
              width={300}
            />
          </LaptopScreen>
          <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%]">
            <LaptopScreen>
              <Image
                src={ShareExample}
                className="rounded-md"
                width={177}
                height={137}
              />
            </LaptopScreen>
          </div>
        </div>
      </div>
    </div>

    <div className="flex w-full mx-8 my-24">
      <div className="flex items-center justify-center w-1/2 h-full">
        <div className="relative flex">
          <LaptopScreen>
            <Image
              src={MathExample}
              className="rounded-md"
              height={300}
              width={365}
            />
          </LaptopScreen>
          <div className="absolute bottom-0 left-0 -translate-x-[20%] translate-y-[20%]">
            <LaptopScreen>
              <Image
                src={SearchExample}
                className="rounded-md"
                width={300}
                height={93}
              />
            </LaptopScreen>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <p className="text-4xl font-bold">
          Search
        </p>
        <p className="my-2 text-lg font-bold">
          Easily find the notes you need with Note Rack's powerful
          search function. Spend less time searching and more time studying.
        </p>
      </div>
    </div>
  </div>
);

export default Info;
