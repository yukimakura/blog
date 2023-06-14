import { graphql, useStaticQuery } from "gatsby"
import ArticleItem from './ArticleItem'
import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div

const List = styled.div

const SectionTitle = styled.h2

const Sidebar = () => {
  const data = useStaticQuery(graphql`
  query MyQuery {
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
  `)

  const posts = data.allMarkdownRemark.edges
  return (
    <Wrapper>
      <SectionTitle>新着記事</SectionTitle>
      <List>
        {posts.map(({ node }) => {
          return (
            <ArticleItem
              key={node.fields.slug}
              title={node.frontmatter.title}
              slug={node.fields.slug}
            />
          )
        })}
      </List>
    </Wrapper>
  )
}

export default Sidebar