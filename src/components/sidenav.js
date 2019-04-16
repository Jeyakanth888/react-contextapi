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
        this.state = { showModal: false };
    }

    countComponentRender = (countNo) => {
        return countNo !== 0 ? <span className="mails-count">  {countNo} </span> : '';
    }

    componentWillReceiveProps =(nextprops) => {
        console.log(nextprops);
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
                                            <li><Link to={'inbox'}>Inbox {this.countComponentRender(context.inboxUnreadMailsCount)}</Link></li>
                                            <li><Link to={'sent'}>Sent Items  {this.countComponentRender(context.sent.length)}</Link></li>
                                            <li><Link to={'spam'}>Spam {this.countComponentRender(context.spamUnreadMailsCount)}</Link></li>
                                            <li><Link to={'deleted'}>Deleted {this.countComponentRender(context.deleted.length)}</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <Route exact path="/" component={() => <AllMails mailStates={context} selected="inbox" />} />
                                <Route path={`/inbox`} component={() => <AllMails mailStates={context} selected="inbox" />} />
                                <Route path={`/spam`} component={() => <AllMails mailStates={context} selected="spam" />} />
                                <Route path={`/sent`} component={() => <AllMails mailStates={context} selected="sent" />} />
                                <Route path={`/deleted`} component={() => <AllMails mailStates={context} selected="deleted" />} />
                            </React.Fragment>
                        )
                    }}
                </AppConsumer>
            </Router>
        )
    }
}
export default SideNav;