import React from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from 'apollo-link-context'/* esto es para que a cada rato
no estemos enviando el encabezado del Token, es como un Middleware */

const httpLink = createHttpLink({
    uri: 'https://secret-temple-45277.herokuapp.com/'
  });
  
  const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    };
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)