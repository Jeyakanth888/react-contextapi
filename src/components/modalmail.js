import React from 'react';
import classnames from 'classnames';

class ModalMail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {to:'', mailsubject:''} ;
    }

    handleUserInput() {

    }

    render() {
        const classes = classnames('card card-default', { active: this.props.open });
        return (
            <div className={classes}>
                <div className="card-header">
                    <div className="send-btn">
                        <button className="btn btn-default btn-send"> <i className="fa fa-paper-plane" aria-hidden="true"></i> Send </button>
                    </div>
                    <div className="send-details">
                        <div className="input-label"><label>To</label></div> <div className="input-field"><input type="text" /> </div>
                        <div className="input-label"><label>Subject</label></div> <div className="input-field"><input type="text" /> </div>
                    </div>
                </div>
                <div className="card-body">

                </div>
                <div className="card-footer"></div>
            </div>
        )
    }
}
export default ModalMail;