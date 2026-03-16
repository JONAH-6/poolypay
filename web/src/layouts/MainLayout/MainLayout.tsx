import { ReactNode, useEffect, useState, useRef } from 'react'

import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from 'framer-motion'

import { Link, routes, useLocation } from '@redwoodjs/router'

import { useAuth } from 'src/context/authcontext'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth()
  const [username, setUsername] = useState('User')
  const [profileImg, setProfileImg] = useState('/default-avatar.png')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Scroll hide/show logic
  const [showHeader, setShowHeader] = useState(true)
  const [showBottomNav, setShowBottomNav] = useState(true)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - lastScrollY.current
    if (Math.abs(delta) > 5) {
      if (delta > 0) {
        setShowHeader(true)
        setShowBottomNav(false)
      } else {
        setShowHeader(false)
        setShowBottomNav(true)
      }
      lastScrollY.current = latest
    }
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load user data
  useEffect(() => {
    if (user?.email) {
      // Use email as fallback username, but you can also store a displayName in Firebase
      setUsername(user.email?.split('@')[0] || 'User')
    } else {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) setUsername(storedUser)
    }

    const savedImg = localStorage.getItem('profileImg')
    if (savedImg) setProfileImg(savedImg)
  }, [user])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setProfileImg(result)
      localStorage.setItem('profileImg', result)
    }
    reader.readAsDataURL(file)
    setDropdownOpen(false) // close dropdown after upload
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Clear any user-specific local storage if desired
      // localStorage.clear()
      // Redirect to login – the Private wrapper will handle it, but we can also force navigate
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setDropdownOpen(false)
    }
  }

  const navItems = [
    {
      to: routes.home(),
      icon: 'fa-solid fa-house',
      label: 'Home',
      activeColor: '#FFD43B',
    },
    {
      to: routes.tasks(),
      icon: 'fa-solid fa-list-check',
      label: 'Tasks',
      activeColor: '#f44336',
    },
    {
      to: routes.withdraw(),
      icon: 'fa-solid fa-arrow-up-right-dots',
      label: 'Withdraw',
      activeColor: '#f44336',
    },
    {
      to: routes.invite(),
      icon: 'fa-solid fa-user-plus',
      label: 'Invite',
      activeColor: '#FFD43B',
    },
  ]

  const headerVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: '-100%', opacity: 0 },
  }

  const bottomNavVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: '100%', opacity: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-background to-gray-900">
      {/* Glass Header */}
      <motion.header
        variants={headerVariants}
        initial="visible"
        animate={showHeader ? 'visible' : 'hidden'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 z-40 w-full border-b border-white/20 bg-white/10 px-4 py-2 text-white shadow-2xl backdrop-blur-lg sm:px-6 sm:py-3"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={routes.home()} className="flex items-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/Green_Black_Professional_Minimal_Fashion_Brand_Logo-removebg-preview.png"
              alt="PoolyPay"
              className="h-16 w-16 rounded-full border-2 border-cyan-400 object-cover shadow-lg sm:h-20 sm:w-20 md:h-24 md:w-24"            />
          </Link>

          {/* Welcome text - hidden on mobile, visible on sm+ */}
          <div className="hidden text-center sm:block">
            <h2 className="text-sm font-medium text-gray-300">Welcome back</h2>
            <p className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-lg font-bold text-transparent">
              {username}
            </p>
          </div>

          {/* Profile image with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={profileImg}
                alt="Profile"
                className="h-8 w-8 rounded-full border-2 border-cyan-400 object-cover shadow-lg sm:h-10 sm:w-10"
              />
            </motion.div>

            {/* Dropdown menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-lg"
                >
                  {/* Upload option */}
                  <label className="block w-full cursor-pointer px-4 py-2 text-sm text-white transition hover:bg-white/20">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </label>

                  {/* Logout option */}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 transition hover:bg-white/20"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile welcome (only on small screens) */}
        <div className="mt-1 text-center sm:hidden">
          <p className="text-xs text-gray-300">Welcome,</p>
          <p className="text-sm font-bold text-cyan-400">{username}</p>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="pb-24 pt-16 sm:pt-20">{children}</main>

      {/* Bottom Navigation */}
      <motion.nav
        variants={bottomNavVariants}
        initial="visible"
        animate={showBottomNav ? 'visible' : 'hidden'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed bottom-0 left-0 z-50 w-full border-t border-white/20 bg-white/10 px-2 py-2 backdrop-blur-lg"
      >
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <li key={item.label} className="flex-1">
                <Link
                  to={item.to}
                  className="group relative flex flex-col items-center py-1"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <i
                      className={`${item.icon} text-xl transition-colors ${
                        isActive
                          ? 'text-' + item.activeColor
                          : 'text-gray-400 group-hover:text-white'
                      }`}
                      style={{ color: isActive ? item.activeColor : undefined }}
                    ></i>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                        style={{ backgroundColor: item.activeColor }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`mt-1 text-xs ${
                      isActive ? 'font-bold text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </motion.nav>

      {/* Floating background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-purple-700/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-700/20 blur-3xl"></div>
      </div>
    </div>
  )
}

export default MainLayout
