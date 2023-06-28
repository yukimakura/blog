import * as React from "react"
import { Link } from "gatsby"
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import { Stack, Box } from '@chakra-ui/react';
import Sidebar from "../components/sidebar"
import Bio from "../components/bio"
import { BrowserView, MobileView } from "react-device-detect"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  header = (
    <div>
      <BrowserView>
        <h1 className="main-heading">
          <Link to="/">{title}</Link>
        </h1>
      </BrowserView>
      <MobileView>
        <h3 className="main-heading-moblie">
          <Link to="/">{title}</Link>
        </h3>
      </MobileView>
    </div>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <center>

        <header className="global-header">{header}</header>
      </center>
      <Bio />
      <BrowserView>
        <Stack direction spacing='3em'>
          <Box mwxW="250px" w="250px" h="100%" className="sidebar-wrapper">
            <Sidebar />
          </Box>
          <Box maxW="65em">
            <main className="main-body">{children}</main>
          </Box>
        </Stack>
      </BrowserView>
      <MobileView>
        <main>{children}</main>
        <Sidebar />
      </MobileView>
      <footer>
        <center>
          © {new Date().getFullYear()} yukimakura All rights reserved, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </center>
      </footer>
    </div>
  )
}

export default Layout
