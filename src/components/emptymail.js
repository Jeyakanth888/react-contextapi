import React from 'react';
class EmptyMail extends React.Component {

    render() {
        return (
            <div className="empty-mail-view">
                <i className="fa fa-envelope msg-icon" aria-hidden="true"></i>
                <p>Select an item to read</p>
                <p>Click here to always select the first item in the list.</p>
            </div>
        )
    }
}
export default EmptyMail;