import React from 'react';

import LaptopScreen from './LaptopScreen';

interface InfoPanelProps {
  children: React.ReactNode,
  title: string,
  description: string,
  direction?: 'forward' | 'reverse'
}

const InfoPanel = (props: InfoPanelProps) => {
  const {
    children, title, description, direction,
  } = props;

  return (
    <div className={`flex w-full mx-8 my-24 gap-2 ${direction === 'reverse' ? 'md:flex-row-reverse flex-col' : 'md:flex-row flex-col'}`}>
      <div className="w-4/5 md:w-1/2">
        <p className="text-4xl font-bold">
          {title}
        </p>
        <p className="my-2 text-lg font-bold">
          {description}
        </p>
        <br />
      </div>
      <div className="flex items-center w-4/5 justify-center md:w-1/2 h-full">
        {
          children
        }
      </div>
    </div>
  );
};

InfoPanel.defaultProps = {
  direction: 'forward',
};

const Info = () => (
  <div className="max-w-4xl mx-auto md:overflow-visible overflow-hidden pb-20">
    <p className="flex flex-col items-center m-8 mx-auto text-6xl font-bold text-center">
      Collaborate
    </p>
    <p className="my-8 text-2xl font-bold md:mx-0 mx-8">
      Collaborate effortlessly with Note Rack and work together with classmates.
      No more endless scrolling through handwritten notes or spending
      hours trying to find the right information.
    </p>

    <InfoPanel
      title="Share"
      description="
        Share your notes with ease using Note Rack
        and collaborate seamlessly with your classmates.
        No more emailing or printing notes for group projects.
      "
    >
      <div className="relative flex">
        <div className="w-4/5 md:w-full">
          <LaptopScreen>
            <img
              src="/promo/Lab-Report-Example.png"
              className="rounded-md max-w-[365px] w-full aspect-auto"
              alt="Lab Report Example"
            />
          </LaptopScreen>
        </div>
        <div className="flex absolute max-w-3/5 bottom-0 right-0 md:translate-x-[40%] translate-x-[20%] translate-y-[20%]">
          <LaptopScreen>
            <img
              src="/promo/Share-Example.png"
              className="rounded-md max-w-[177px] w-full aspect-auto"
              alt="Share Example"
            />
          </LaptopScreen>
        </div>
      </div>
    </InfoPanel>

    <InfoPanel
      title="Search"
      description="
        Easily find the notes you need with Note Rack&apos;s powerful
        search function. Spend less time searching and more time studying.
      "
      direction="reverse"
    >
      <div className="relative flex">
        <div className="w-4/5 md:w-full">
          <LaptopScreen>
            <img
              src="/promo/Math-Example.png"
              className="rounded-md max-w-[365px] w-full aspect-auto"
              alt="Math Example"
            />
          </LaptopScreen>
        </div>
        <div className="absolute w-4/5 bottom-0 md:left-0 md:-translate-x-[20%] right-0 translate-x-[10%] translate-y-[20%]">
          <LaptopScreen>
            <img
              src="/promo/Search-Example.png"
              className="rounded-md max-w-[300px] w-full aspect-auto"
              alt="Search Example"
            />
          </LaptopScreen>
        </div>
      </div>
    </InfoPanel>

    <InfoPanel
      title="Chat"
      description="
        Maximize your note-taking potential with ChatGPT integration!
        Through Note Rack, our AI-powered bot utilizes OpenAI's
        GPT technology to provide personalized study assistance
        and answer your questions in real-time based on the information
        you write in your notes.
      "
    >
      <div className="relative flex">
        <div className="w-4/5 md:w-full">
          <LaptopScreen>
            <img
              src="/promo/Biology-Notes-Example.png"
              className="rounded-md max-w-[365px] w-full aspect-auto"
              alt="Lab Report Example"
            />
          </LaptopScreen>
        </div>
        <div className="flex absolute md:w-4/5 w-3/5 -bottom-20 right-10 md:translate-x-[40%] translate-x-[20%] translate-y-[20%]">
          <LaptopScreen>
            <img
              src="/promo/Chat-Example.png"
              className="rounded-md max-h-[240px] w-full aspect-auto"
              alt="Share Example"
            />
          </LaptopScreen>
        </div>
      </div>
    </InfoPanel>
  </div>
);

Info.InfoPanel = InfoPanel;

export default Info;
