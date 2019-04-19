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
        this.state = { paths: [], loadMailType: this.props.selected, hover: true, mailStates: this.props.mailStates };
        this.otherRef = this.focusedRef = this.mailsRef = React.createRef();
    }

    componentWillReceiveProps = (nextProps) => {
        console.log(nextProps);
        this.setState({ loadMailType: nextProps.selected });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.mailStates !== nextState.tempMailStates;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState({ mailStates: prevState.tempMailStates });
        console.log(this.state.mailStates);
    }

    componentDidMount() {
        console.log(this.state.mailStates);
    }

    renderMails = (mailStates) => {

        if (mailStates && mailStates !== undefined) {
            const loadMailType = this.state.loadMailType;

            const getMails = mailStates[loadMailType];
            return getMails.map((mail, i) => {
                const classes = mail.unread ? classnames('mails', 'read') : classnames('mails', 'unread');
                const pathUrl = loadMailType;
                this.state.paths.push(pathUrl);
                const mailContent = mail.content.slice(0, 50).replace(/<\/?[^>]+(>|$)/g, "");
                const setRowId = loadMailType + '_' + i;

                return (<li className={classes} key={i} id={setRowId} onMouseOver={() => { this.handleOnHoverIn(setRowId) }} onMouseOut={() => { this.handleOnHoverOut(setRowId) }}> <Link to={{ pathname: pathUrl, replace: true, search: '?mId=' + mail.mId }} >
                    <h5 className="mail-from">Outlook Team</h5>
                    <p className="mail-subject">{mail.subject}</p>
                    <p className="mail-content">{mailContent}</p>
                </Link > {this.renderDeleteIcon(loadMailType, i, setRowId)}<div className='tooltip' >{mailContent}</div></li>
                );
            });
        }
    }

    renderDeleteIcon = (loadMailType, i, setRowId) => {
        if (loadMailType !== 'deleted')
            return <span className='delete-icon' onClick={() => this.handleDeleteMail(loadMailType, i)} ><i className="fa fa-trash" aria-hidden="true"></i></span>
    }

    handleOnHoverIn = (rowId) => {
        //  this.setState({ hover: true });
        this.handleClassAddTooltip(rowId);
    }

    handleOnHoverOut = (rowId) => {
        //  this.setState({ hover: false });
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
            element.classList.add(findLiId === rowId ? 'tooltip-on-hover' : 'hoverout');
            if (findLiId === rowId) {
                element.classList.add('hover-li');
            } else {
                element.classList.remove('hover-li');
            }
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