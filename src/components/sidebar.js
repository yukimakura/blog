import { graphql, useStaticQuery } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'
import { Timeline } from 'react-twitter-widgets'
import MonthlyArchives from "./monthlyarchives"


const Sidebar = () => {

  const Wrapper = styled.div`
  `

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
    <Wrapper >
      <MonthlyArchives />
      <Timeline
        dataSource={{
          sourceType: 'profile',
          screenName: 'yukimakura86'
        }}
        options={{
          height: '1500'
        }}
      />
    </Wrapper>
  )
}

export default Sidebar