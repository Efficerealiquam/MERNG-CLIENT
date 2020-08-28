import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function AuthRoute({ component: Component, ...rest }) {
    /* el ...rest , es solo el resto de los componentes , ejemplo =
    exact path='/login' y en ...props es loq esta dentro del componente */
    const { user } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={props =>
                user ? <Redirect to="/" /> : <Component {...props} />
            }
        />
    )
}

export default AuthRoute; 