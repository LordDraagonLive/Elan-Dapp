import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import ElanHome from './src/ElanHome';
import CreateBackup from './src/CreateBackup';

const AppStack = createStackNavigator({
  ElanHome: ElanHome,
  CreateBackup: CreateBackup
});

export default createAppContainer(AppStack);