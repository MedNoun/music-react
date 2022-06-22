import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Recorder from "../components/recorder/Recorder";
import Sheet from "../components/sheet-music/Sheet";

const screens = {
  Recorder: {
    screen: Recorder,
  },
  Sheet: {
    screen: Sheet,
  },
};
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
