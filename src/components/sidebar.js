import { graphql, useStaticQuery } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'
import { Timeline } from 'react-twitter-widgets'
import MonthlyArchives from "./monthlyarchives"
import AllTags from "./alltags"
import { Stack, Box } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { MobileView } from "react-device-detect"

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
    site {
      siteMetadata {
        social {
          twitter
          github
        }
      }
    }
  }
  `)

  // const posts = data.allMarkdownRemark.edges
  return (
    <Stack>
      <MobileView>
        <center>
          <Box>
            <a
              style={{
                fontSize: `2.5em`,
                color: `#007fff`,
                boxShadow: `none`,
              }}
              href={`https://twitter.com/${data.site.siteMetadata.social.twitter}`}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              style={{
                fontSize: `2.5em`,
                color: `#000`,
                boxShadow: `none`,
              }}
              href={`https://github.com/${data.site.siteMetadata.social.github}`}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </Box>
        </center>
      </MobileView>
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