import { graphql, useStaticQuery } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'
import { Timeline } from 'react-twitter-widgets'
import MonthlyArchives from "./monthlyarchives"
import AllTags from "./alltags"
import { Stack, Box } from '@chakra-ui/react';

const Sidebar = () => {

  const data = useStaticQuery(graphql`
  query sidebarQuery {
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
    <Stack>

      <MonthlyArchives />
      <AllTags />
      <Timeline
        dataSource={{
          sourceType: 'profile',
          screenName: 'yukimakura86'
        }}
        options={{
          height: '1500'
        }}
      />
    </Stack>
  )
}

export default Sidebar