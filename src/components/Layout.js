import React from 'react'
import Menu from '../pages/Menu'


const Layout = ({children}) => {
  return (
    <div >
<Menu/>

        {
            children
        }
    </div>
  )
}

export default Layout