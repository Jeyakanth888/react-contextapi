import React from 'react';
class TopHeader extends React.Component {
    render() {
        return (
            <header className="App-header">
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <i className="fa fa-th grid-icon" aria-hidden="true"></i> <a className="navbar-brand" href="http://localhost:3000">Sample Mail</a>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}
export default TopHeader;