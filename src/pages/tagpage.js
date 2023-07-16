import * as React from "react"
import { Link, graphql } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { Stack, Box, HStack } from "@chakra-ui/react";

import Layout from "../components/layout"
import styled from '@emotion/styled'

const TagPage = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`
    const posts = data.allMarkdownRemark.nodes

    const params = new URLSearchParams(location.search);
    const tagname = params.get("tag");

    const TagBox = styled.div`
    float: left;
  `

    return (
        <Layout location={location} title={siteTitle}>
            <h1>タグ:{tagname}に属する記事一覧</h1>
            <ol style={{ listStyle: `none` }}>
                {posts.filter(post => post.frontmatter.tags?.some(x => x === tagname) ?? false).map(post => {
                    const title = post.frontmatter.title || post.fields.slug

                    return (
                        <li key={post.fields.slug}>
                            <article
                                className="post-list-item"
                                itemScope
                                itemType="http://schema.org/Article"
                            >
                                <header>
                                    <Stack>
                                        <Box>

                                            <h2>
                                                <Link to={post.fields.slug} itemProp="url">
                                                    <span itemProp="headline">{title}</span>
                                                </Link>
                                            </h2>
                                        </Box>
                                        <Box>
                                            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && post.frontmatter.tags?.map(tag => {
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
                                            <small>{post.frontmatter.date}</small>
                                        </Box>
                                    </Stack>
                                </header>
                                <section>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: post.frontmatter.description || post.excerpt,
                                        }}
                                        itemProp="description"
                                    />
                                </section>
                            </article>
                        </li>
                    )
                })}
            </ol>
        </Layout>
    )
}

export default TagPage

export const pageQuery = graphql`
{
  site {
    siteMetadata {
      title
    }
  }
  allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
    nodes {
      excerpt
      fields {
        slug
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
}
`