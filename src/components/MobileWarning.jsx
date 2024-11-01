import {React, useEffect, useState} from 'react'

const MobileWarning = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        handleResize();

        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
        }, []);

        if (isMobile) { 
            return (
                <div className='mobile-warning'>
                    <p>This website is best viewed on a desktop. Please open it on a larger screen for an optimal experience.</p>
                </div>
            )
        }

}
export default MobileWarning
