import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import AllMails from '../components/mailsview';
import ModalMail from '../components/modalmail.js';
import { createBrowserHistory } from "history";
import { AppConsumer } from '../context';


const history = createBrowserHistory();

class SideNav extends React.Component {
    constructor(props) {
        super(props);
        let mailStates ;
        if (localStorage.getItem('mailStates')) {
            mailStates = JSON.parse(localStorage.getItem('mailStates'));
            if(mailStates===undefined) {
                mailStates  = this.props.values;
            }
        } else {
            mailStates  = this.props.values;
            localStorage.setItem('mailStates', JSON.stringify(mailStates));
        }
       
        this.state = { showModal: false, values: mailStates };
    }

    countComponentRender = (countNo,type) => {
        return countNo !== 0 ? <span className="mails-count" id= {type}>  {countNo} </span> : '';
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps);
    }

    render() {
        return (
            <Router history={history}>
                <ModalMail open={this.state.showModal} />
                <AppConsumer>
                    {context => {
                        return (
                            <React.Fragment>
                                <div className="side-nav-block">
                                    <div className="side-nav">
                                        <p className="sent-mail-btn" onClick={() => this.setState({ showModal: true })}><i className="fa fa-envelope-o" aria-hidden="true"></i> New Mail</p>
                                        <p><i className="fa fa-arrow-up" aria-hidden="true"></i> Folders</p>
                                        <ul>
                                            <li><Link to={'inbox'}>Inbox {this.countComponentRender(this.state.values.inboxUnreadMailsCount, 'inbox-count')}</Link></li>
                                            <li><Link to={'sent'}>Sent Items  {this.countComponentRender(this.state.values.sent.length, 'sent-count')}</Link></li>
                                            <li><Link to={'spam'}>Spam {this.countComponentRender(this.state.values.spamUnreadMailsCount, 'spam-count')}</Link></li>
                                            <li><Link to={'deleted'}>Deleted {this.countComponentRender(this.state.values.deleted.length, 'deleted-count')}</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <Route exact path="/" component={() => <AllMails mailStates={this.state.values} selected="inbox" />} />
                                <Route path={`/inbox`} component={() => <AllMails mailStates={this.state.values} selected="inbox" />} />
                                <Route path={`/spam`} component={() => <AllMails mailStates={this.state.values} selected="spam" />} />
                                <Route path={`/sent`} component={() => <AllMails mailStates={this.state.values} selected="sent" />} />
                                <Route path={`/deleted`} component={() => <AllMails mailStates={this.state.values} selected="deleted" />} />
                            </React.Fragment>
                        )
                    }}
                </AppConsumer>
            </Router>
        )
    }
}
export default SideNav;