import { FC } from "react";
import SlideOver from "./SlideOver";

const SettingsPage: FC<{}> = ({ children }) => {
  return (
    <div>
      <SlideOver>
        <div className="flex flex-col space-y-3">
          <p>Show timestamp</p>
          <p>Show name</p>
          <div>
            <p>Show emotes</p>
            <div className="ml-4">
              <p>FFZ emotes</p>
              <p>BTTV emotes</p>
              <p>7tv emotes(?)</p>
              <p>Sub emotes(?)</p>
            </div>
          </div>
          <p>Twitch chat mode(?)</p>
          <p>/me lines</p>
          <p>Bots messages</p>
          <p>Sort: (✔️) Newest (❌) Oldest</p>
        </div>
      </SlideOver>
    </div>
  );
};

export default SettingsPage;
