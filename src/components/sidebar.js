import { graphql, useStaticQuery } from "gatsby"
import React from 'react'

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

  // const posts = data.allMarkdownRemark.edges
  return (
    <div >

      <h1>新着記事</h1>
       
  </div>
  )
}

export default Sidebar