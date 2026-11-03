import React, { useRef,useState,useEffect } from 'react'
import {navbarStyles} from '../assets/dummyStyles'
import { useClerk,Show,UserButton } from '@clerk/react'
import { useNavigate,useLocation,Link } from 'react-router-dom'
import { Users,Key, X, Menu } from 'lucide-react';
import logo from '../assets/logo.png';

const STORAGE_KEY = "doctorToken_v1";
const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];
  

const Navbar = () => {
     const [isOpen, setisOpen] = useState(false)
     const [showNavbar, setshowNavbar] = useState(true)
     const [lastScrolly, setlastScrolly] = useState(0)
     const [isDoctorLoggedIn, setisDoctorLoggedIn] = useState(()=>{
        try{
            return Boolean(localStorage.getItem(STORAGE_KEY));
        }catch{return false;}
     })
     const location = useLocation();
     const navRef = useRef(null)
     const clerk = useClerk();
     const navigate = useNavigate()

     useEffect(() => {
      const handle=(e)=>{
        const currentscrolly = window.scrollY
        if(currentscrolly>lastScrolly && currentscrolly>80){
          setshowNavbar(false)
        }
        else{
          setshowNavbar(true)
        }
      }
      window.addEventListener("scroll",handle,{passive:true})
      return()=>window.removeEventListener("scroll",handle)
     }, [lastScrolly])
     

     useEffect(() => {
      const onStorage = (e)=>{
        if(e.key===STORAGE_KEY){
          setisDoctorLoggedIn(boolean(e.newValue))
        }
      }
      window.addEventListener("storage",onStorage)
      return()=>window.removeEventListener("storage",onStorage)
     },[])
     
     useEffect(() => {
       const handleopen=(e)=>{
        if(isOpen && navRef.current && !navRef.current.contains(event.target)){
          setisOpen(false)
        }
       }
       document.addEventListener("mousedown",handleopen)
       return ()=> window.removeEventListener("mousedown",handleopen)
     }, [isOpen])
     
  return (
    <>
    <div className={navbarStyles.navbarBorder}>
      <nav ref={navRef} className={`${navbarStyles.navbarContainer}${
        showNavbar?navbarStyles.navbarVisible:navbarStyles.navbarHidden
      }`}>
        <div className={navbarStyles.contentWrapper}>
        <div className={navbarStyles.flexContainer}>
            <Link to='/' className={navbarStyles.logoLink}>
            <div className={navbarStyles.logoContainer}>
                <div className={navbarStyles.logoImageWrapper}>
                    <img src={logo} alt="logo" className={navbarStyles.logoImage} />
                </div>
            </div>
            <div className={navbarStyles.logoTextContainer}>
              <h1 className={navbarStyles.logoTitle}>
                Medicare
              </h1>
              <p className={navbarStyles.logoSubtitle}>
                Healthcare Solutions
              </p>
            </div>
                </Link>
                <div className={navbarStyles.desktopNav}>
                  <div className={navbarStyles.navItemsContainer}>
                    {navItems.map((item)=>{
                      const isActive=location.pathname===item.href;
                      return(
                        <Link key={item.href} to={item.href} className={`${navbarStyles.navItem}${
                          isActive ? navbarStyles.navItemActive:navbarStyles.navItemInactive
                        }`}>
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              {/* right side*/}
              <div className={navbarStyles.rightContainer}>
                <Show when={'signed-out'}> 
                  <Link to='/doctor-admin/login' className={navbarStyles.doctorAdminButton}>
                  <Users className={navbarStyles.doctorAdminIcon}/>
                  <span className={navbarStyles.doctorAdminText}> 
                    Doctor Admin
                  </span>
                  </Link>

                  {/*patient login*/}
                  <button onClick={()=>clerk.openSignIn()} className={navbarStyles.loginButton}>
                    <Key className={navbarStyles.loginIcon}/>Login
                  </button>
                </Show>
                <Show when={'signed-in'}>
                  <UserButton afterSignedOut="/"/>
                </Show>

                {/*to toggle*/}
                <button onClick={()=> setisOpen(!isOpen)} className={navbarStyles.mobileToggle}>
                  {isOpen ?(
                    <X className={navbarStyles.toggleIcon}/>
                  ):(
                    <Menu className={navbarStyles.toggleIcon}/>
                  )}
                </button>
              </div>
        </div>
        {/* mobile navigation*/}
        {isOpen && (
          <div className={navbarStyles.mobileMenu}> 
          {navItems.map((item,idx)=>{
            const isActive=location.pathname === item.href;
            return(
              <Link key={idx} to={item.href} onClick={()=>setisOpen(false)} className={`${navbarStyles.mobileMenuItem}
              ${ isActive ? navbarStyles.mobileMenuItemActive
                          :navbarStyles.mobileMenuItemActive}`}>
                {item.label}
              </Link>
            )
          })}
          <Show when={'signed-out'}>
            <Link to='/doctor-admin/login' className={navbarStyles.mobileDoctorAdminButton}
            onClick={()=> setisOpen(false)}>
              Doctor Admin
            </Link>

            <div className={navbarStyles.mobileLoginContainer}>
              <button onClick={()=>{setisOpen(false);
                clerk.openSignIn()
              }} className={navbarStyles.mobileLoginButton}>Login</button>

            </div>
          </Show>
          </div>
        )}
        </div>
        <style>{navbarStyles.animationStyles}</style>
      </nav>
    </div>
    </>
  )
}

export default Navbar
