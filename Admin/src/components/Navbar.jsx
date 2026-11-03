import React, { useRef,useState,useEffect,useCallback,useLayoutEffect } from 'react'
import {navbarStyles as ns} from '../assets/dummyStyles'
import logoImg from "../assets/logo.png"
import { Link,NavLink,useLocation, useNavigate } from 'react-router-dom'
import {Calendar, Grid, Home, List, Menu, PlusSquare, UserPlus, Users, X} from 'lucide-react'
import { useAuth, useClerk, useUser} from '@clerk/react'

const Navbar = () => {
    const [open, setopen] = useState(false)
    const navInnerRef = useRef(null)
    const indicatorRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    //clerk
    const clerk = useClerk();
    const {getToken, isLoaded:authloaded} = useAuth()
    const {isSignedIn,user,isLoaded:userLoaded} = useUser()

    //sliding active indicator
    const moveIndicator = useCallback(() => {
    const container = navInnerRef.current;
    const ind = indicatorRef.current;
    if (!container || !ind) return;

    const active = container.querySelector(".nav-item.active");
    if (!active) {
      ind.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const width = activeRect.width;

    ind.style.transform = `translateX(${left}px)`;
    ind.style.width = `${width}px`;
    ind.style.opacity = "1";
  }, []);

  //it will be moving in 0.12seconds
  useLayoutEffect(() => {
    moveIndicator();
    const t = setTimeout(() => {
      moveIndicator();
    }, 120);
    return () => clearTimeout(t);
  }, [location.pathname, moveIndicator]);

  //it will help in scrlling on x-axis
  useEffect(() => {
    const container = navInnerRef.current;
    if (!container) return;

    const onScroll = () => {
      moveIndicator();
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      moveIndicator();
    });
    ro.observe(container);
    if (container.parentElement) ro.observe(container.parentElement);

    window.addEventListener("resize", moveIndicator);

    moveIndicator();

    return () => {
      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", moveIndicator);
    };
  }, [moveIndicator]);

  //it will toggle the mobile menu ie: close when we click on escape key

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setopen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

//when user signed in fetch a token and save it in localstorage
useEffect(()=>{
    let mounted = true
    const storeToken = async()=>{
        if(!authloaded || !userLoaded) return 
        if(!isSignedIn){
            try {
                localStorage.removeItem("clerk_token")
            } catch (e) {
                //ignore any error
            }
            return
        }
        try {
            if(getToken){
                const token = await getToken()
                if(!mounted) return
                if(token){
                    try {
                        localStorage.setItem("clerk_token",token)
                    } catch (error) {
                        console.warn("failed to write clerk token in localstorage",error)
                    }
                }
            }
        } catch (error) {
            console.warn("could not retreive clerk token",error)
        }
    }
    storeToken()
    return ()=>{
        mounted = false

    }
},[isSignedIn,authloaded,getToken])

//to open clerk login box
const handleOpenSignIn = () => {
    console.log("LOGIN BUTTON CLICKED")
    console.log("CLERK OBJECT:", clerk)
    console.log("CLERK JS:", clerk?.clerkjs)

    if (!clerk || !clerk.openSignIn) {
        console.warn("Clerk is not available")
        return
    }

    clerk.openSignIn()
}
// const handleOpenSignIn = () =>{
//     if(!clerk||!clerk.openSignIn){
//         console.warn("clerk is not availaible")
//         return
//     }
//     clerk.openSignIn()
//     // navigate("/h")
// }
//to signout
const handleSignOut= async()=>{
     if(!clerk||!clerk.signOut){
        console.warn("clerk is not availaible")
        return
    }
    try {
        await clerk.signOut()
    } catch (err) {
        console.error("sign out failed",err)
    }
    finally{
       try {
         localStorage.removeItem("clerk_token")
       } catch (error) {
        //ignore
       }
       navigate("/")
    }
}


  return (
    <header className = {ns.header}>
        <nav className={ns.navContainer}>
            <div className={ns.flexContainer}>
                <div className={ns.logoContainer}>
                    <img src={logoImg} alt="logo" className = {ns.logoImage} />
                    <Link to='/'>
                    <div className={ns.logoLink}>
                        Medicare
                        </div>
                        <div className={ns.logoSubtext}>Healthcare Solutions</div>
                        </Link>
                </div>
                {/*center navigation*/}
                <div className={ns.centerNavContainer}>
                    <div className={ns.glowEffect}>
                        <div className={ns.centerNavInner}>
                            <div ref={navInnerRef} tabIndex={0} className={ns.centerNavScrollContainer}
                                style={{
                                    WebkitOverflowScrolling:"touch"
                                }}>
                                     <CenterNavItem
                    to="/h"
                    label="Dashboard"
                    icon={<Home size={16} />}
                  />
                  <CenterNavItem
                    to="/add"
                    label="Add Doctor"
                    icon={<UserPlus size={16} />}
                  />
                  <CenterNavItem
                    to="/list"
                    label="List Doctors"
                    icon={<Users size={16} />}
                  />
                  <CenterNavItem
                    to="/appointments"
                    label="Appointments"
                    icon={<Calendar size={16} />}
                  />
                  <CenterNavItem
                    to="/service-dashboard"
                    label="Service Dashboard"
                    icon={<Grid size={16} />}
                  />
                  <CenterNavItem
                    to="/add-service"
                    label="Add Service"
                    icon={<PlusSquare size={16} />}
                  />
                  <CenterNavItem
                    to="/list-service"
                    label="List Services"
                    icon={<List size={16} />}
                  />
                  <CenterNavItem
                    to="/service-appointments"
                    label="Service Appointments"
                    icon={<Calendar size={16} />}
                  />
                            </div>
                        </div>
                    </div>

                </div>
                
                {/*right side*/}
                <div className = {ns.rightContainer}>
                    {/*auth*/}
                    {isSignedIn ? (
                        <button onClick={handleSignOut} className={ns.signOutButton+""+ns.cursorPointer}>
                            Sign Out
                        </button>
                    ): (
                        <div className='hidden lg:flex items-center gap-2'>
                            <button onClick={handleOpenSignIn} className={ns.loginButton+""+ns.cursorPointer}>
                                Login
                            </button>
                        </div>
                    )}
                    {/* mobile toggle */}
                    <button onClick={()=> setopen((v)=>!v)} className={ns.mobileMenuButton}>
                        {open ? <X size={18}/> : <Menu size={18}/>}
                    </button>
                </div>
            </div>
                    {/* mobile navigation */}
                {open && (
                    <div className={ns.mobileOverlay} onClick={()=> setopen(false)}/>
                )}
                {open && (
                    <div className={ns.mobileMenuContainer} id="mobile-menu">
                        <div className={ns.mobileMenuInner}>
                          <MobileItem
                to="/h"
                label="Dashboard"
                icon={<Home size={16} />}
                onClick={() => setopen(false)}
              />

              <MobileItem
                to="/add"
                label="Add Doctor"
                icon={<UserPlus size={16} />}
                onClick={() => setopen(false)}
              />
              <MobileItem
                to="/list"
                label="List Doctors"
                icon={<Users size={16} />}
                onClick={() => setopen(false)}
              />
              <MobileItem
                to="/appointments"
                label="Appointments"
                icon={<Calendar size={16} />}
                onClick={() => setopen(false)}
              />

              <MobileItem
                to="/service-dashboard"
                label="Service Dashboard"
                icon={<Grid size={16} />}
                onClick={() => setopen(false)}
              />
              <MobileItem
                to="/add-service"
                label="Add Service"
                icon={<PlusSquare size={16} />}
                onClick={() => setopen(false)}
              />
              <MobileItem
                to="/list-service"
                label="List Services"
                icon={<List size={16} />}
                onClick={() => setopen(false)}
              />
              <MobileItem
                to="/service-appointments"
                label="Service Appointments"
                icon={<Calendar size={16} />}
                onClick={() => setopen(false)}
              />
                        </div>
                    </div>
                )}
        </nav>
    </header>
  )
}

export default Navbar

function CenterNavItem({to,icon,label}){
    return(
        <NavLink to={to} end className={({isActive})=>
            `nav-item ${isActive?"active":""}${ns.centerNavItemBase}${
                isActive ?ns.centerNavItemActive:ns.centerNavItemInactive
            }`
        }>
            <span> {icon}</span>
            <span className="font-medium">{label}</span>
        </NavLink>
    )
}

function MobileItem ({to,icon,label,onClick}){
    return(
        <NavLink to={to} onClick={onClick} className={({isActive})=>
        `${ns.mobileItemBase} ${
            isActive?ns.mobileItemActive:ns.mobileItemInactive
        }`}>
            {icon}
            <span className='font-medium text-sm'>{label}</span>
        </NavLink>
    )
}