import React from 'react';
import EmptyMail from '../components/emptymail';
import { AppConsumer } from '../context'


class ViewMail extends React.Component {

    componentDidMount = () => {

    }
    
    renderMailView(mailStates) {
        const URL = window.location.href;
        const arr = URL.split('/');
        const reg = new RegExp('[?&]' + 'mId' + '=([^&#]*)', 'i');
        const string = reg.exec(URL);
        if (arr[3] === '' || string === null) {
            return this.renderEmptyMail();
        } else {
            const getMailType = this.props.selected;
            const getMails = mailStates[getMailType];
            let getMailId = string[1];
            if (getMailId !== '') {
                const viewMail = getMails.filter(mail => mail['mId'] === getMailId);
                return (<div className="selected-mail-view">
                    <h5 className="mail-subject">{viewMail[0].subject}</h5>
                    <p className="mail-body">{viewMail[0].content}</p>
                </div>)
            } else {
                return this.renderEmptyMail();
            }
        }
    }

    renderEmptyMail() {
        return (<EmptyMail />)
    }

    render() {
        return (
            <AppConsumer>
                {context => {
                    return (
                        <div className="mail-view">
                            {this.renderMailView(context)}
                        </div>
                    )
                }
                }
            </AppConsumer>
        );
    }
}
export default ViewMail;