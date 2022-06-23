import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Recorder from "../components/Recorder";
import Sheet from "../components/Sheet";

const Screens = {
  Recorder: {
    screen: Recorder,
  },
  Sheet: {
    screen: Sheet,
  },
};
const homeStack = createStackNavigator(Screens);

export default createAppContainer(homeStack);
