
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to check if the screen is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for resize
    window.addEventListener("resize", checkMobile)
    
    // Also use matchMedia for better compatibility
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
      mql.removeEventListener("change", checkMobile)
    }
  }, [])

  return {
    isMobile: !!isMobile,
    isTablet: window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  }
}
