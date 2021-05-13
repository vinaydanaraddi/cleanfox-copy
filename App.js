/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {Node, useEffect, useState} from 'react';
import React from 'react';
import {Alert, SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

const App: () => Node = () => {
  const [currentUrl, setCurrentUrl] = useState('https://accounts.google.com');
  const myScript = `
  window.ReactNativeWebView.postMessage(
    {},
    "*"
  );
  true; // note: this is required, or you'll sometimes get silent failures
`;

  const [hasTwoFactorAuthentication, setHasTwoFactorAuthentication] =
    useState(false);
  const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);

  const onMessage = e => {
    if (
      e.nativeEvent.url.includes('signin/challenge/pwd') &&
      !isPasswordSubmitted
    )
      setIsPasswordSubmitted(true);

    if (isPasswordSubmitted) {
      if (e.nativeEvent.url.includes('signin/challenge/ipp')) {
        setHasTwoFactorAuthentication(true);
      } else {
        setCurrentUrl(
          'https://myaccount.google.com/signinoptions/two-step-verification/enroll-welcome',
        );
      }
    }
  };

  useEffect(() => {
    if (hasTwoFactorAuthentication) {
      Alert.alert('Congrats!', 'Has Two Factor Authentication!');
    }
  }, [hasTwoFactorAuthentication]);

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      <WebView
        source={{uri: currentUrl}}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled
        domStorageEnabled
        bounces={false}
        onMessage={onMessage}
        injectedJavaScript={myScript}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
