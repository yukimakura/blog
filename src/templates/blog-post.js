import * as React from "react"
import { Link, graphql } from "gatsby"
import 'katex/dist/katex.min.css';

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Sidetoc from '../components/sidetoc'
import CustomFooter from '../components/customFooter'
import ShareButtonList from "../components/sharebuttonlist";
import { Stack, Box, HStack } from "@chakra-ui/react";
import { BrowserView, MobileView } from "react-device-detect"
import { Disqus } from 'gatsby-plugin-disqus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import styled from '@emotion/styled'


const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const timetoread = post.timeToRead || 0

  let tags = post.frontmatter.tags
  console.log(tags)

  const TagBox = styled.div`
  float: left;
`
  const FloatCancelBox = styled.div`
  float: none;
`

  return (

    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <BrowserView>
          <Stack direction spacing='2em'>
            <Box w="40em" maxW="40em">
              <header>
                <Stack>

                  <h1 itemProp="headline">{post.frontmatter.title}</h1>
                  <p>{post.frontmatter.date}</p>
                  <Box>

                    {tags && tags.length > 0 && tags?.map(tag => {
                      return (
                        <TagBox >
                          <Link to={"/tagpage/?tag=" + tag} rel="prev" className="tag-button">
                            <FontAwesomeIcon icon={faHashtag} />
                            {" " + tag}
                          </Link>
                        </TagBox>
                      )
                    }
                    )
                    }
                  </Box>
                  <Box>
                    <p><b>この記事は{timetoread}分ぐらいで読めるっぽいよ。</b></p>
                  </Box>
                </Stack>
              </header>
              <section
                dangerouslySetInnerHTML={{ __html: post.html }}
                itemProp="articleBody"
              />
              <hr/>
              <CustomFooter post={post} next={next} previous={previous} />
            </Box>
            {/* <Box w="13em" maxW="13em">
              <Sidetoc tocdata={post.tableOfContents} />
            </Box> */}
          </Stack>
        </BrowserView>
        <MobileView>
          <header>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
            <p>{post.frontmatter.date}</p>

            {tags && tags.length > 0 && tags?.map(tag => {
              return (
                <Box >
                  <Link to={"/tagpage/?tag=" + tag} rel="prev" className="tag-button">
                    <FontAwesomeIcon icon={faHashtag} />
                    {" " + tag}
                  </Link>
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
      </article >
      <MobileView>
        <CustomFooter post={post} next={next} previous={previous} />
      </MobileView>
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
