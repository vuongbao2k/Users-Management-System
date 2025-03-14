import React from 'react'

const FooterComponent = () => {
    return (
        <div>
            <footer className='footer'>
                <span>JB Dev | All Right Reserved &copy; {new Date().getFullYear()} </span>
            </footer>
        </div>
    )
}

export default FooterComponent