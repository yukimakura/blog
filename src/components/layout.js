import * as React from "react"
import { Link } from "gatsby"
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import { Stack, Box } from '@chakra-ui/react';
import Sidebar from "../components/sidebar"
const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  header = (
    <h1 className="main-heading">
      <Link to="/">{title}</Link>
    </h1>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>

      <Stack direction spacing='0px'>
        <Box maxW="45em" mx="auto">
          <main>{children}</main>
        </Box>

        <Box justify='start' maxH="100%" w="300px" h="100%" mx="auto" bgColor="gray" className="sidebar-wrapper">
          <Sidebar />
        </Box>
      </Stack>
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
