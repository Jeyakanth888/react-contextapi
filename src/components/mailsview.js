import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import EmptyMail from '../components/emptymail';
import ViewMail from '../components/viewmail';
import { AppConsumer } from '../context'
import { createBrowserHistory } from "history";
import classnames from 'classnames';

const history = createBrowserHistory();


class AllMails extends React.Component {

    constructor(props) {
        super(props);
        let mailStates;
        if (localStorage.getItem('mailStates')) {
            mailStates = JSON.parse(localStorage.getItem('mailStates'));
        } else {
            mailStates = this.props.mailStates;
            localStorage.setItem('mailStates', JSON.stringify(mailStates));
        }
        this.state = { paths: [], loadMailType: this.props.selected, hover: true, mailStates: mailStates };
        this.otherRef = this.focusedRef = this.mailsRef = React.createRef();
    }

    componentWillReceiveProps = (nextProps) => {

        this.setState({ loadMailType: nextProps.selected });
    }

    shouldComponentUpdate(nextProps, nextState) {

        return this.state.mailStates !== nextState.tempMailStates;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.tempMailStates !== undefined) {
            localStorage.setItem('mailStates', JSON.stringify(prevState.tempMailStates));
            this.setState({ mailStates: prevState.tempMailStates });
        }
    }

    componentDidMount() {

    }

    renderMails = (mailStates) => {

        if (mailStates && mailStates !== undefined) {
            const loadMailType = this.state.loadMailType;

            const getMails = mailStates[loadMailType];
            return getMails.map((mail, i) => {
                const classes = mail.unread ? classnames('mails', 'unread') : classnames('mails', 'read');
                const pathUrl = loadMailType;
                this.state.paths.push(pathUrl);
                const mailContent = mail.content.slice(0, 50).replace(/<\/?[^>]+(>|$)/g, "");
                const setRowId = loadMailType + '_' + i;

                return (<li className={classes} key={i} id={setRowId} onMouseOver={() => { this.handleOnHoverIn(setRowId) }} onMouseOut={() => { this.handleOnHoverOut(setRowId) }}> <Link to={{ pathname: pathUrl, replace: true, search: '?mId=' + mail.mId }} >
                    <h5 className="mail-from">Outlook Team</h5>
                    <p className="mail-subject">{mail.subject}</p>
                    <p className="mail-content">{mailContent}</p>
                </Link > {this.renderDeleteFlagIcon(loadMailType, i, mail.mId)}<div className='tooltip' >{mailContent}</div></li>
                );
            });
        }
    }

    renderDeleteFlagIcon = (loadMailType, i, mailId) => {

        const flagMailAvail = this.checkFlagMailAvail(loadMailType, mailId);
        const classes = flagMailAvail ? classnames('flag-icon', 'flag-added') : classnames('flag-icon', '');

        if (loadMailType !== 'deleted')
            return <div>
                <span className={classes} onClick={() => this.handleFlagMail(loadMailType, mailId)} ><i className="fa fa-flag" aria-hidden="true"></i> </span>
                <span className='delete-icon' onClick={() => this.handleDeleteMail(loadMailType, i)} ><i className="fa fa-trash" aria-hidden="true"></i></span>
            </div>
    }

    handleOnHoverIn = (rowId) => {
        //  this.setState({ hover: true });
        this.handleClassAddTooltip(rowId);
    }

    handleOnHoverOut = (rowId) => {
        //  this.setState({ hover: false });
    }

    checkFlagMailAvail = (mailType, mailId) => {
        const flagedMails = this.state.mailStates.flaged;
        const typeflagedMails = flagedMails.filter(mail => mail['type'] === mailType && mail['mId'] === mailId);
        return typeflagedMails.length > 0;
    }

    handleFlagMail = (mailType, mailId) => {

        const flagedMails = this.state.mailStates.flaged;
        const flagMailAvail = this.checkFlagMailAvail(mailType, mailId);
        let tempMailStates = Object.assign({}, this.state.mailStates);

        if (!flagMailAvail) {
            const newFlagMailObj = { type: mailType, mId: mailId };
            tempMailStates.flaged = Object.freeze(flagedMails.concat(newFlagMailObj));

        } else {
            const getFlagedMail = flagedMails.filter(mail => mail['type'] === mailType && mail['mId'] === mailId);
            const flagedMail = getFlagedMail[0];
            let newFMailsArr = [];
            getFlagedMail.map((mail) => {
                if (mail.mid !== flagedMail.mId && mail.type !== flagedMail.type) {
                    newFMailsArr.push(mail);
                }
            });
            tempMailStates.flaged = newFMailsArr;
        }
        this.setState({ tempMailStates });

    }

    handleDeleteMail = (mailType, rowIndex) => {
        const mailData = this.state.mailStates[mailType][rowIndex];
        this.callApiDeleteMailAction(mailType, mailData);
    }

    callApiDeleteMailAction = async (mailType, mailData) => {

        const deletedMails = this.state.mailStates.deleted;
        const checkFlag = deletedMails.map(function (e) { return e.mId; }).indexOf(mailData.mId) > -1;
        if (!checkFlag) {
            const getMails = this.state.mailStates[mailType];
            const getMailIndex = getMails.map(function (o) { return o.mId; }).indexOf(mailData.mId);
            const readStatus = getMails[getMailIndex].unread;
            let tempMailStates = Object.assign({}, this.state.mailStates);
            if (!readStatus) {
                tempMailStates.inboxUnreadMailsCount = mailType === 'inbox' ? tempMailStates.inboxUnreadMailsCount - 1 : tempMailStates.inboxUnreadMailsCount;
                tempMailStates.spamUnreadMailsCount = mailType === 'spam' ? tempMailStates.spamUnreadMailsCount - 1 : tempMailStates.spamUnreadMailsCount;
            }
            tempMailStates[mailType] = getMails.slice(0, getMailIndex).concat(getMails.slice(getMailIndex + 1, getMails.length))
            const frozenObj = Object.freeze(mailData);
            tempMailStates.deleted = Object.freeze(deletedMails.concat(frozenObj));
            this.setState({ tempMailStates });
            const getDeletedCount = document.getElementById('deleted-count').innerText;
            const count = parseInt(getDeletedCount) + 1;
            document.getElementById('deleted-count').innerText = count;
        }
        /*  const response = await fetch('/api/deleteMail',
              {
                  method: 'POST',
                  body: JSON.stringify({
                      mailData
                  }),
                  headers: { "Content-Type": "application/json" }
              });
          const body = await response.json();
          if (response.status !== 200) throw Error(body.message);
          if (body.status === "OK") {
  
          }*/
    }

    handleClassAddTooltip = (rowId) => {
        const getElements = this.mailsRef.current;
        const allLi = getElements.querySelectorAll('li');
        // const hoverState = this.state.hover;
        allLi.forEach((element) => {
            const findLiId = element.getAttribute('id');
            element.classList.remove('hover-li');
            element.classList.remove('hoverout');
            element.classList.add(findLiId === rowId ? 'hover-li' : 'hoverout');
        });
    }

    changeMailOptions = (type) => {
        if (type === 'focused') {
            this.otherRef.current.classList.remove('active');
            this.focusedRef.current.classList.add('active');
        } else {
            this.otherRef.current.classList.add('active');
            this.focusedRef.current.classList.remove('active');
        }
    }

    render() {
        return (
            <Router history={history}>
                <AppConsumer>
                    {context => {
                        return (
                            <React.Fragment>
                                <div className="all-mails-block">
                                    <div className="all-mails-inbox">
                                        <ul className="focused-other">
                                            <li ref={this.focusedRef} className="active" onClick={() => { this.changeMailOptions('focused') }}>Focused</li>
                                            <li ref={this.otherRef} className="" onClick={() => { this.changeMailOptions('other') }}>Other</li></ul>
                                        <ul ref={this.mailsRef}>
                                            {this.renderMails(this.state.mailStates)}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mail-view-block">
                                    <Route exact path="/" component={EmptyMail} />
                                    <Route path={`/inbox`} component={() => <ViewMail mailStates={context} selected='inbox' />} />
                                    <Route path={`/spam`} component={() => <ViewMail mailStates={context} selected='spam' />} />
                                    <Route path={`/sent`} component={() => <ViewMail mailStates={context} selected='sent' />} />
                                    <Route path={`/deleted`} component={() => <ViewMail mailStates={context} selected='deleted' />} />
                                </div>
                            </React.Fragment>
                        )
                    }}
                </AppConsumer>
            </Router>
        )
    }
}

export default AllMails;