
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [width, setWidth] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    // Function to check screen width
    const checkWidth = () => {
      setWidth(window.innerWidth)
    }
    
    // Initial check
    checkWidth()
    
    // Add event listener for resize
    window.addEventListener("resize", checkWidth)
    
    // Also use matchMedia for better compatibility
    const mobileMql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mobileMql.addEventListener("change", checkWidth)
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkWidth)
      mobileMql.removeEventListener("change", checkWidth)
    }
  }, [])

  const currentWidth = width || 0
  
  return {
    isMobile: currentWidth < MOBILE_BREAKPOINT,
    isTablet: currentWidth >= MOBILE_BREAKPOINT && currentWidth < TABLET_BREAKPOINT,
    isDesktop: currentWidth >= TABLET_BREAKPOINT,
    // Add a simple boolean property for backward compatibility
    value: currentWidth < MOBILE_BREAKPOINT
  }
}

// For direct boolean usage - this allows code that expects boolean to continue working
export function useIsMobileValue(): boolean {
  const { isMobile } = useIsMobile()
  return isMobile
}
