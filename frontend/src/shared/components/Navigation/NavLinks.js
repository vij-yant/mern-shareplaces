import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';

import {AuthContext} from '../../context/auth-context';

import './NavLinks.css';

const NavLinks = () => {
    const auth = useContext(AuthContext);
    return <ul className ="nav-links">
        <li>
            <NavLink to="/" exact>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn &&<li>
            <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
        }
        {auth.isLoggedIn && <li>
            <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
        }
        {!auth.isLoggedIn && <li>
            <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
        }
        {auth.isLoggedIn && <l1>
            <button onClick = {auth.logout}>LOGOUT</button>    
        </l1>
        }
    </ul>
}

export default NavLinks;