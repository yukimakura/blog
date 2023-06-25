/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Stack, Box } from '@chakra-ui/react';

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <Stack direction spacing='3px' justifyContent='center' >
        <Box alignContent='center'>
          <Stack spaceing='0px'>
            <Box marginLeft='0em'>
              <StaticImage
                className="bio-avatar"
                layout="fixed"
                formats={["auto", "webp", "avif"]}
                src="../images/yukimakuraicon.jpeg"
                width={55}
                height={55}
                quality={95}
                alt="Profile picture"
              />
            </Box>
            <Box>
            <a
              style={{
                fontSize: `1.35em`,
                color: `#007fff`,
                boxShadow: `none`,
              }}
              href={`https://twitter.com/${social.twitter}`}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              style={{
                fontSize: `1.35em`,
                color: `#000`,
                boxShadow: `none`,
              }}
              href={`https://github.com/${social.github}`}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            </Box>
          </Stack>
        </Box>
        <Box >

          {author?.name && (
            <p>
              {author?.summary || null}<br></br>
              {` `}
              <a href="https://yukihurumakura.blogspot.com/" target="_blank" rel="noopener noreferrer">旧サイトはこちら！</a>
            </p>
          )}
        </Box>
      </Stack>
    </div>
  )
}

export default Bio
