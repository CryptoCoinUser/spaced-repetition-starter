import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as Cookies from 'js-cookie';
import * as actions from '../actions/index';

import { slide as Menu } from 'react-burger-menu'

export const Navigation = props => {

    const logout = e => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if(accessToken) {
            props.dispatch(
                actions.logoutCurrentUser(accessToken)
            )
        }
    }
    
    const buildLinks = [
            {route: '/demo', text: "How to"}, 
            {route: '/about-bitcoin', text: "About Bitcoin"}, 
            {route: '/app', text: 'Try it'}
        ].map((link, i) => {
        const selected = link.route == props.location.pathname
            ? 'selected'
            : ""
        return <li key={i} className={selected}><Link to={link.route}>{link.text}</Link></li> 
    })



    let buttons
       props.currentUser
        ? buttons = <button onClick={(e => logout(e))} className="btn btn-default"><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</button>
        : buttons = <form action="/api/auth/google">
                            <button className="btn btn-success" type="submit"><i className="fa fa-sign-in" aria-hidden="true"></i> Try it - Login with Google</button>
                    </form>
    let links;
       props.currentUser
        ? links = <ul>{buildLinks}</ul>
        : links = <ul>{buildLinks.slice(0,2)}</ul>

    return (
        <nav>
            <span className="logo"><a href="/"><i className="fa fa-binoculars" aria-hidden="true"></i> Watch My Address</a></span>
            <span className="login-logout">{buttons}</span>
            {links}
            
            <div className="clr"></div>
        </nav>
    )
}

const mapStateToProps = state => ({
    currentUser: state.currentUser
}) 

export default connect(mapStateToProps)(Navigation)



















