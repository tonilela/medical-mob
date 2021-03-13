import React, { useState, useContext } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text, Button } from 'react-native-paper'
import _ from 'lodash'

import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import { theme } from '../assets/theme'
import { AppContext } from '../provider/AppContext'

import { loginUser, sendCode, getUserByOIB } from "../helper/user";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [error, setError] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [validEmail, setValidEmail] = useState(false)
  const [pass, setPass] = useState('')
  const [buttonBlock, setButton] = useState(false)

  const {setUser} = useContext(AppContext);

  const onLoginPressed = async() => {
    setButton(true)
    setError(false)
    const login = await loginUser(email.value)
    if(_.isEmpty(login)) {
      setError(true)
      setButton(false)
      return
    }

    setValidEmail(true)
    setButton(false)
  }

  const onPassPressed = async() => {
    const resp = await sendCode(pass)
    if(_.isEmpty(resp)) {
      setCodeError(true)
      return
    }

    const user = _.get(resp, 'data')
    setUser(user)

    if(user.title === 'patient') {

      const data = await getUserByOIB(user.oib)
      navigation.replace('Profile', {
        data: data
      })
    } else {
        navigation.replace('TabOneScreen', {
          data: user
        })
    }
  }

  const newLogin = () => {
    setValidEmail(false)
  }

  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      <Header>Welcome back.</Header>
      {!validEmail &&
      <View>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description=''
        />
        {error && <Text style={styles.link}>Error happened while trying to Login</Text>}
        <Button
          onPress={onLoginPressed}
          style={styles.button}
          disabled={buttonBlock}
        >
          Login
        </Button>
        </View>}
        {validEmail && <View>
          <View style={{justifyContent: 'center',alignItems: 'center'}}>
            <TextInput
              label="Code"
              returnKeyType="next"
              value={pass}
              onChangeText={(text) => setPass(text)}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              description=''
              // style={styles.codeText}
            />
          </View>

          {codeError && <Text style={styles.link}>Code is not valid</Text>}
          <View style={styles.buttons}>
             <Button
              onPress={onPassPressed}
              style={styles.button}
              >
              Submit code
            </Button>
             <Button
              style={styles.button}
              onPress={newLogin}
            >
              Go back to Login
            </Button>
          </View>
        </View>
        }
      {/* <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      /> */}
      {/* <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View> */}
      {/* <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
        </TouchableOpacity>
      </View> */}
    </Background>
  )
}

const styles = StyleSheet.create({
  codeText: {
    textAlign: "center",
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderTopLeftRadius: 1,
    borderStyle:'solid',
    margin: 10,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})

export default LoginScreen