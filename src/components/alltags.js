import { graphql, useStaticQuery, Link } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { Stack, Box, HStack } from "@chakra-ui/react";

const AllTags = (querydata) => {

    const Wrapper = styled.div`
  `


    const TagBox = styled.div`
        float: left;
    `


    const { allMarkdownRemark } = useStaticQuery(graphql`
    query tagnameQuery {
        allMarkdownRemark {
          distinct(field: {frontmatter: {tags: SELECT}})
        }
      }
  `)

    console.log(allMarkdownRemark);
    return (
        <Wrapper >
            <center>
                <h4>タグ</h4>
            </center>
            <div>
                {allMarkdownRemark.distinct && allMarkdownRemark.distinct.length > 0 && allMarkdownRemark.distinct?.map(tag => {
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
            </div>
        </Wrapper>
    )
}

export default AllTags

