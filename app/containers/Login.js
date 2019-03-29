import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import { Button } from '../components'

import { NavigationActions } from '../utils'

@connect(({ app }) => ({ ...app }))
class Login extends Component {
  static navigationOptions = {
    title: 'Login',
  }

  onLogin = () => {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Home' }))
  }


  render() {
    return (
      <View style={styles.container}>
          <Button text="Login" onPress={this.onLogin}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 30,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'gray',
  },
})

export default Login
