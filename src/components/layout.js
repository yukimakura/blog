import * as React from "react"
import { Link } from "gatsby"
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import { Stack, Box } from '@chakra-ui/react';
import Sidebar from "../components/sidebar"
import Bio from "../components/bio"
import { BrowserView, MobileView } from "react-device-detect"
import { PixiJsBackgroundComponent } from "./pixijsBackgroundComponent";
import styled from 'styled-components';

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header
  let data = { teat: "te" };

  const CanScroll = styled.div`
  overflow: auto;
`;



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
      <PixiJsBackgroundComponent />
      <CanScroll>

        <center>

          <header className="global-header">{header}</header>
        </center>
        <Bio />
        <BrowserView>
          <Stack direction spacing='3em'>
            <Box mwxW="300px" w="300px" h="100%" className="sidebar-wrapper">
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
      </CanScroll>
    </div>
  )
}

export default Layout
