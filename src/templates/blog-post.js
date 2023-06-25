import * as React from "react"
import { Link, graphql } from "gatsby"
import 'katex/dist/katex.min.css';

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Sidetoc from '../components/sidetoc'
import ShareButtonList from "../components/sharebuttonlist";
import { Stack, Box } from "@chakra-ui/react";

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const timetoread = post.timeToRead || 0
  return (

    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <Stack direction spacing='1em'>
          <Box maxW="45em">
            <header>
              <h1 itemProp="headline">{post.frontmatter.title}</h1>
              <p>{post.frontmatter.date}</p>
            <p>この記事は{timetoread}分ぐらいで読めるっぽいよ。</p>
            </header>
            <section
              dangerouslySetInnerHTML={{ __html: post.html }}
              itemProp="articleBody"
            />
          </Box>
          <Box maxW="20em">
            <Sidetoc tocdata={post.tableOfContents}/>
          </Box>
          <hr />
        </Stack>
        <hr/>
        <footer>
          このポエムを轟かせたいと思ったらシェアやで
          <br />
          <br />
          <ShareButtonList title={`${post.frontmatter.title} - ${site.siteMetadata?.title}`} url={`${encodeURI(site.siteMetadata?.siteUrl+post.fields?.slug)}`} />
          {/* <Bio /> */}
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
    </Layout>
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
