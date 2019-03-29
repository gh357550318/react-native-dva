import React, { PureComponent } from 'react'
import { BackHandler } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationActions,
  createSwitchNavigator
} from 'react-navigation'
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import { Provider } from '@ant-design/react-native'
import zhCN from '@ant-design/react-native/lib/locale-provider/zh_CN'
import Loading from './containers/Loading'
import Login from './containers/Login'
import Home from './containers/Home'
import Account from './containers/Account'
import Detail from './containers/Detail'


// 底部 Tab 导航
const HomeNavigator = createBottomTabNavigator({
  Home: Home ,
  Account: Account
},
)

HomeNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index]

  return {
    headerTitle: routeName,
    headerBackTitle:null
  }
}

const MainNavigator = createStackNavigator(
  {
    HomeNavigator: HomeNavigator ,
    Detail: Detail ,
  },
)

const MainNav = createStackNavigator(
  {
    Main: MainNavigator ,
    Login: Login ,
  },
  {
    headerMode: 'none',
    mode: 'modal',
  }
)

const AuthStack = createStackNavigator({
  Login: Login,
})

const AppNavigator = createSwitchNavigator(
  {
 
    All: MainNav,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
  }
)


export const routerReducer = createNavigationReducer(AppNavigator)

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)

const App = reduxifyNavigator(AppNavigator, 'root')

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

@connect(({ app, router }) => ({ app, router }))
class Router extends PureComponent {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getActiveRouteName(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {
    const { app, dispatch, router } = this.props
    if (app.loading) return <Loading />

    return (
    <Provider locale={zhCN}>
    <App dispatch={dispatch} state={router} />
    </Provider>
    )
  }
}

export default Router
