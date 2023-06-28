import * as React from "react"
import { Link, graphql } from "gatsby"
import 'katex/dist/katex.min.css';

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

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const timetoread = post.timeToRead || 0

  let disqusConfig = {
    url: `${encodeURI(site.siteMetadata?.siteUrl + '/blog' + post.fields?.slug)}`,
    identifier: post.id,
    title: siteTitle,

  }
  let tags = post.frontmatter.tags
  console.log(tags)
  return (

    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <BrowserView>
          <Stack direction spacing='2em'>
            <Box w="50em" maxW="50em">
              <header>
                <h1 itemProp="headline">{post.frontmatter.title}</h1>
                <p>{post.frontmatter.date}</p>
                <HStack>

                  {tags && tags.length > 0 && tags?.map(tag => {
                    return (
                      <Box >
                        <a href="" className="tag-button">
                          <FontAwesomeIcon icon={faHashtag} />
                          {" " + tag}
                        </a>
                      </Box>
                    )
                  }
                  )
                  }
                </HStack>
                <p><b>この記事は{timetoread}分ぐらいで読めるっぽいよ。</b></p>
              </header>
              <section
                dangerouslySetInnerHTML={{ __html: post.html }}
                itemProp="articleBody"
              />
            </Box>
            <Box maxW="20em">
              <Sidetoc tocdata={post.tableOfContents} />
            </Box>
            <hr />
          </Stack>
        </BrowserView>
        <MobileView>
          <header>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
            <p>{post.frontmatter.date}</p>

              {tags && tags.length > 0 && tags?.map(tag => {
                return (
                  <Box >
                    <a href="" className="tag-button">
                      <FontAwesomeIcon icon={faHashtag} />
                      {" " + tag}
                    </a>
                  </Box>
                )
              }
              )
              }
            <p><b>この記事は{timetoread}分ぐらいで読めるっぽいよ。</b></p>
          </header>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
        </MobileView>
        <hr />
        <footer>
          このポエムを轟かせたいと思ったらシェアやで
          <br />
          <br />
          <ShareButtonList title={`${post.frontmatter.title} - ${site.siteMetadata?.title}`} url={`${encodeURI(site.siteMetadata?.siteUrl + '/blog' + post.fields?.slug)}`} />
          {/* <Bio /> */}
          <Disqus config={disqusConfig} />
        </footer>
      </article>
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
      {/* <Sidebar /> */}
    </Layout >
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
      fields{
        slug
      }
      tableOfContents
      timeToRead
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
