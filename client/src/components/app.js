import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';

import axios from 'axios';
import moment from 'moment';

import * as actions from '../actions/index';
import LoginPage from './login-page';
import AddressesPage from './addresses-page';


export class App extends React.Component {
    constructor(props) {
        super(props);
        this.saveMyAddress = this.saveMyAddress.bind(this);
        this.saveOrUpdateEmail = this.saveOrUpdateEmail.bind(this);
    }

    // componentDidMount() {

    //     const accessToken = Cookies.get('accessToken');
        
    //     if(accessToken) {
    //         this.props.dispatch(
    //             actions.isUserLoggedIn(accessToken),
    //             actions.getWatchedAddresses(accessToken)
    //         )
    //     }
    //     this.props.dispatch(
    //         actions.fetchLatestBlock(),
    //         actions.updateApiRemaining()
    //     )
    // }

    updateApiRemaining(e) {
        e.preventDefault();
        this.props.dispatch(
            actions.updateApiRemaining()
        )
    }



    getUnconfirmedAddress(e){
        e.preventDefault();
        this.props.dispatch(
            actions.getUnconfirmedAddress()
        )
    }

    saveRandomAddress(e){
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(accessToken, this.props.randomAddress, true)
            )
        }
        // error handling if no access token
    }

    saveMyAddress(e) {
        e.preventDefault();

        const myAddress     = this.myAddressInput.value;
        let myAddressNote = this.myAddressNoteInput.value;
        if(!myAddressNote){
            myAddressNote = "Address saved on " + moment(Date.now()).format("YYYY-MM-DD, HH:mm")
        }

        const accessToken = Cookies.get('accessToken');


        if(accessToken) {
            this.props.dispatch(
                actions.saveAddress(accessToken, myAddress, false, myAddressNote)
            )
        }
         this.myAddressInput.value = "";
         this.myAddressNoteInput.value = "";
    }

    saveOrUpdateEmail(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const accessToken = Cookies.get('accessToken');
         if(accessToken) {
            this.props.dispatch(
                actions.saveOrUpdateEmail(accessToken, email)
            )
        }
        this.emailInput.value = "";
    }


    render() {

        if(!this.props.currentUser){
            return <LoginPage />
        }
    
        const addrBaseUrl = 'http:\//api.blockcypher.com/v1/btc/main/addrs/';
        const addrLiveBaseURL = 'https:\//live.blockcypher.com/btc/address/';

        return (
            
            <div id="main">
                            
                <h2>Add Bitcoin Address</h2>
                <div id="addAddressesWrapper">
                    <div id="randomAddressWrapper">
                        <h4>Add a random address (from some recent transaction) to watch list</h4>
                        
                        <button id="getRandomAddress"  className="btn btn-info" 
                            onClick={(e => this.getUnconfirmedAddress(e))}
                         >
                            Get Random Address
                        </button>
                        <div id="randomAddressAndButton">
                            <span id="randomAddress"> {this.props.randomAddress} </span>
                            {this.props.randomAddress ?
                                <button id="watchRandomAddress" className="btn btn-success" 
                                    onClick={(e => this.saveRandomAddress(e))} 
                                    > Watch This Address
                                </button>
                                : ""

                            }
                        </div>
                        {this.props.randomAddressError}
                    </div>


                    <form id="myAddressForm">
                        <h4>Add a specific address to watch list</h4>
                        <input type="text" placeholder="Paste your address" id="myAddress" size="40" 
                        ref={ref => this.myAddressInput = ref} />
                        <input type="text" placeholder="Note" id="myAddressNote" size="20" 
                        ref={ref => this.myAddressNoteInput = ref} />
                        <button id="watchMyAddress" className="btn btn-success" 
                            onClick={this.saveMyAddress}
                        >Watch My Address</button>
                    </form>
                </div>
                {(this.props.addresses.length) > 0 ? "" : ""}
                    <div className="wrapper">
                        <h2>Address Watch List</h2>
                        <div id="addressesWrapper">
                            <AddressesPage />
                            <div id="notificationEmail">
                                <h4>Email for Notifications about an Address</h4>
                                <form>
                                    <input type ="email" size="50" placeholder={this.props.email} ref={ref => this.emailInput = ref} />
                                    <button id="saveOrUpdateEmail" className="btn btn-success"  onClick = {(e => this.saveOrUpdateEmail(e))}>Save / Update Email</button>
                                </form>
                            
                           </div>
                       </div>
                   </div>
                
               {(this.props.apiRemaining.hits) < 150 ? 
                   <div className="wrapper">
                        <h2>API Limits</h2>
                        <div id="apiLimits">
                            <p><strong>{this.props.apiRemaining.hits}</strong> of 200 requests remaining this hour</p>
                            <p><strong>{this.props.apiRemaining.hooks}</strong> of 200 webhooks (for email notications) remaining this hour</p>
                            <button id="refreshRemaining" className="btn btn-info"  onClick={(e => this.updateApiRemaining(e))}>Refresh Count</button>
                            <p>BlockCypher's hourly limits renew at the top of each hour.<br /> Activity of other users of this app also counts towards the limit.<br />If limit is reached, app will stop responding until next hour.</p>
                        </div>
                    </div>
                : ""}
                <p id="logout"><button onClick={(e => this.logout(e))}>Logout</button></p>
            </div>
        )

    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    latestBlock: state.latestBlock,
    latestBlockHeight: state.latestBlockHeight,
    randomAddress: state.randomAddress,
    randomAddressError: state.randomAddressError,
    email: state.email,
    apiRemaining: state.apiRemaining,
    addresses: state.addresses
})

export default connect(mapStateToProps)(App);
