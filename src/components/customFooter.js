import { Link, graphql, useStaticQuery } from "gatsby"
import * as React from "react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Sidetoc from '../components/sidetoc'
import ShareButtonList from "../components/sharebuttonlist";
import { Stack, Box, HStack } from "@chakra-ui/react";
import { BrowserView, MobileView } from "react-device-detect"
import { Disqus } from 'gatsby-plugin-disqus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import styled from '@emotion/styled'

const CustomFooter = ({ post , previous , next }) => {

  const data = useStaticQuery(graphql`
  query customFooterQuery {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
  `)

  const site = data.site;
  const siteTitle = site.siteMetadata?.title || `Title`

  const disqusConfig = {
    url: `${encodeURI(site.siteMetadata?.siteUrl + '/blog' + post.fields?.slug)}`,
    identifier: post.id,
    title: siteTitle,
  }

  return (
    <>
      <footer>
        このポエムを轟かせたいと思ったらシェアやで
        <br />
        <br />
        <BrowserView>
          <ShareButtonList title={`${post.frontmatter.title} - ${site.siteMetadata?.title}`} url={`${encodeURI(site.siteMetadata?.siteUrl + '/blog' + post.fields?.slug)}`} />
        </BrowserView>
        <MobileView>
          <center>
            <ShareButtonList title={`${post.frontmatter.title} - ${site.siteMetadata?.title}`} url={`${encodeURI(site.siteMetadata?.siteUrl + '/blog' + post.fields?.slug)}`} />
          </center>
        </MobileView>
        ↓この広告はゆきまくらと一切関係ございません。DISQUSが勝手につけてるだけです。
        <Disqus config={disqusConfig} />
      </footer>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  )
}

export default CustomFooter