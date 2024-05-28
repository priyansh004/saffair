import React, { useState, useEffect } from 'react'
import './navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import {
  Avatar,
  Button,
  Dropdown,
  TextInput,
  Navbar as Nb,
} from 'flowbite-react'
import { useSelector, useDispatch } from 'react-redux'

import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { SearchpostContext } from '../../page/Home'
import { signoutSuccess } from '../../redux/user/userSlice'
import { FaMoon, FaSun } from 'react-icons/fa'
import { toggleTheme } from '../../redux/theme/themeSlice'

// import { Dropdown } from "flowbite-react";

export default function Navbar({ _id }) {
  const { currentUser } = useSelector((state) => state.user)
  // const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch()

  const { search, setSearch } = useContext(SearchpostContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [posts, setPosts] = useState([])
  const [isTitleClicked, setIsTitleClicked] = useState(false)
  const [coin, setCoin] = useState('')

  // const handleTitleClick = () => {
  //   setIsTitleClicked(!isTitleClicked); // Set the state to true when a title is clicked
  // };

  const id = currentUser ? currentUser._id : null
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:6600/api/user/${id}`)

        if (res.ok) {
          const data = await res.json()
          setCoin(data.totalCoins)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    // Fetch posts from the server
    fetch('http://localhost:6600/post')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        return response.json()
      })
      .then((posts) => {
        setPosts(posts)
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
      })
  }, [])

  useEffect(() => {
    // Filter posts based on search keyword
    if (search.trim() !== '') {
      const filteredResults = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      )
      setSearchResults(filteredResults)
    } else {
      setSearchResults([])
    }
  }, [search, posts])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const isTop = scrollTop < 50

      setIsScrolled(!isTop)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  // console.log(currentUser.profilePicture);
  const handleSignout = async () => {
    try {
      const res = await fetch('http://localhost:6600/api/user/signout', {
        method: 'POST',
      })
      const data = await res.json()
      console.log('this is data : ' + data)
      if (!res.ok) {
        // console.log(data.message);
      } else {
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <div
      // className={`navbarContainer fixed top-0 ${isScrolled ? "scrolled" : ""}`}
      className={`navbarContainer  top-0 ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="leftNevbar">
        <div className="logoContainer">
          <img
            className="logoNevbar"
            src="./assets/transperent logo 1.svg"
            alt="logo"
          />
        </div>
        <div className="centerItems">
          <Link to="/" className="links">
            <a className="centerItem" onClick={scrollToTop}>
              Home
            </a>
          </Link>
          <a className="centerItem" onClick={scrollToTop}>
            Calculator
          </a>
          <div className="centerItem lg:flex items-center gap-4">
            <Dropdown
              label="Readings"
              size="2xl"
              color="black"
              fontSize="15px"
              arrowIcon={false}
            >
              <Link to="/blog" className="links">
                {' '}
                <Dropdown.Item>Blogs</Dropdown.Item>
              </Link>
              <Link to="/news" className="links">
                <Dropdown.Item>News</Dropdown.Item>
              </Link>
              <Link to="/Update" className="links">
                <Dropdown.Item>Updates</Dropdown.Item>
              </Link>
            </Dropdown>
            <Link to="/events">
              <a className="centerItem" onClick={scrollToTop}>
                Campaigns
              </a>
            </Link>
          </div>
          {/* <Link to="/readings">
            <a className="centerItem" onClick={scrollToTop}>
              Readings
            </a>
          </Link> */}
          <Link to="/aboutus">
            <a className="centerItem" onClick={scrollToTop}>
              About Us
            </a>
          </Link>
          <Link to="/contactus">
            <a className="centerItem" onClick={scrollToTop}>
              Contact Us
            </a>
          </Link>

          {/* <Link to="/privacypolicy">
            <a className="centerItem">Privacy Policy</a>
          </Link> */}
        </div>
      </div>
      <div className="rightNevbar">
        {/* <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button> */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <>
                <div
                  className="flex items-center p-0.5 rounded-full"
                  style={{ border: '0.5px solid #2196ba' }}
                >
                  <Avatar
                    alt="user"
                    img={currentUser.profilePicture}
                    rounded
                    className="userprofile"
                  />
                  <p className="mx-2 text-l hidden sm:block">
                    {currentUser.username}
                  </p>
                  <div className="border-l border-black h-7 p-1"></div>

                  <Avatar
                    alt="user"
                    img="../assets/coin2.png"
                    rounded
                    className="userprofile"
                  />
                  <p className="mx-2 text-l hidden sm:block">{coin}</p>
                </div>
              </>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            {currentUser.isAdmin ? (
              <Link to={'/dashboard?tab=profile'} onClick={scrollToTop}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
            ) : (
              <>
                <Link to={'/dashboard?tab=profile'} onClick={scrollToTop}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Link
                  to={
                    currentUser.isContributor
                      ? '/createblog'
                      : '/dashboard?tab=be-a-contributor'
                  }
                  onClick={scrollToTop}
                >
                  <Dropdown.Item>
                    {currentUser.isContributor
                      ? "Let's Contribute"
                      : "Let's Contribute"}
                  </Dropdown.Item>
                </Link>
              </>
            )}
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                handleSignout()
                scrollToTop()
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <div className="community">
            <Link to="/login">
              <button
                className="hidden sm:flex"
                style={{
                  backgroundColor: '#1896ba',
                  color: 'white',
                  padding: '11px',
                  borderRadius: '5px',
                }}
              >
                Join Community
              </button>
            </Link>
          </div>
        )}

        <Link to="/searchpage" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon" />
        </Link>
        <div className="menu">
          <a href="#" id="dropdownLink" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faBars} />
          </a>
          <div
            className="dropbox"
            id="dropdownMenu"
            style={{ display: isOpen ? 'block' : 'none' }}
          >
            <div>
              <FontAwesomeIcon
                icon={faXmark}
                style={{
                  top: '20px',
                  left: '20px',
                  position: 'absolute',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
                onClick={toggleDropdown}
              />
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
              <a className="dropdown-item" href="#" onClick={toggleDropdown}>
                Home
              </a>
            </Link>
            <a className="dropdown-item" href="#" onClick={toggleDropdown}>
              Calculator
            </a>
            <Link to="/blog">
              <a className="dropdown-item" href="#" onClick={toggleDropdown}>
                Blog
              </a>
            </Link>
            <a className="dropdown-item" href="#" onClick={toggleDropdown}>
              News
            </a>
            <a className="dropdown-item" href="#" onClick={toggleDropdown}>
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}