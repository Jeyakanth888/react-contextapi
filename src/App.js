import React, { Component } from 'react';
import './App.css';
import { AppProvider, AppConsumer } from './context';
import TopHeader from './components/header';
import SideNav from './components/sidenav';
//const inboxMails = require('./jsons/inbox.json');
//const spamMails = require('./jsons/spam.json');

class App extends Component {
  /* state = {
     selected: 'inbox', inboxTotalMails: 0, inboxUnreadMailsCount: 0, spamUnreadMailsCount: 0,
     inbox: inboxMails, spam: spamMails, deleted: [], sent: []
   };*/
  render() {
    return (
      <div className="App">
        <AppProvider >
          <Header />
        </AppProvider>
        <div className="container-fluid">
          <div className="row">
            <AppConsumer>
              {context => {
                return (
                  <SideNav values={context} />
                )
              }}
            </AppConsumer>
          </div>
        </div>
      </div>
    );
  }
}


const Header = () => {
  return (<TopHeader />)
}


export default App;
