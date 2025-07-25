import { graphql, useStaticQuery, Link } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'

const MonthlyArchives = () => {

    const Wrapper = styled.div`
  `

    const groupBy = (array, getKey) =>
        Array?.from(
            array?.reduce((map, cur, idx, src) => {
                const key = getKey(cur, idx, src);
                const list = map.get(key);
                if (list) list.push(cur);
                else map.set(key, [cur]);
                return map;
            }, new Map())
        );


    const data = useStaticQuery(graphql`
  query monthlyArchiveQuery {
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
    if ((data.allMarkdownRemark.edges?.length ?? 0) <= 0) {
        return (
            <Wrapper >
                <center>
                    <h4>月別アーカイブ</h4>
                </center>
            </Wrapper>
        )
    }
    let groupingData = groupBy(data.allMarkdownRemark.edges?.map(item => [item.node.frontmatter.date.substring(0, 7), item.node]), item => item);
    let yearGropuingData = groupBy(groupingData?.map(x => [x[0][0].substring(0, 4), x]), x => x[0]);
    return (
        <Wrapper >
            <center>
                <h4>月別アーカイブ</h4>
            </center>
            <ol style={{ listStyle: `none`, paddingLeft: '1em' }}>
                {yearGropuingData?.sort((a,b) => b[0] - a[0]).map(yearGr => {
                    return (
                        <li>
                            <details>
                                <summary>{yearGr[0]}({yearGr[1]?.map(x => x[0][1][1]).flat(Infinity).length})</summary>
                                <ol style={{ listStyle: `none`, paddingLeft: '1em' }}>
                                    {groupBy(yearGr[1]?.map(x => [x[1][0][0], x[1][0][1]]), x => x[0])?.sort().map(month => {
                                        return (
                                            <li>
                                                <details>
                                                    <summary>{month[0]}({month[1]?.map(x => x[1]).flat(Infinity).length})</summary>
                                                    <ol style={{ listStyle: `none`, paddingLeft: '1em' }}>
                                                        {month[1].sort((a, b) => a[1].frontmatter.date - b[1].frontmatter.date)?.map(days => {
                                                            return (
                                                                <li>
                                                                    <Link to={days[1].fields.slug} itemProp="url">
                                                                        <span>{days[1].frontmatter.title}</span>
                                                                    </Link>
                                                                </li>
                                                            )
                                                        })}
                                                    </ol>
                                                </details>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </details>
                        </li>
                    )
                }
                )
                }
            </ol>
        </Wrapper>
    )
}

export default MonthlyArchives