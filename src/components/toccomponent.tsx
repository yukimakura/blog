import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import { AnchorLink } from "gatsby-plugin-anchor-links";

export const TableOfContents: React.FC<{
  className?: string, 
  slug: string,
}> = props => (
  <StaticQuery
    query={graphql`
      {
        allMarkdownRemark {
          edges {
            node {
              headings {
                depth
                id
                value
              }
              fields {
                slug
              }
            }
          }
        }

      }
    `}
    render={(data: any) => {
      //graphqlでは全件取得しているため対象を特定
      const headings = data.allMarkdownRemark.edges.find((n:any)=>{
        return n.node.fields.slug == props.slug })?.node?.headings;

      return (headings && <div >
        {headings.map((x:any)=><AnchorLink         
            className={props.className??'' + ' toc-link toc-depth-'+x.depth}

            //末尾にスラッシュを付ける場合はこっち
            to={"/" + props.slug + '#' + x.id}

            //末尾にスラッシュを付けない場合はこっち
            //to={"/" + props.slug.replace('/','') + '#' + x.id}

            stripHash //#表示を追加しない

          >
            {x.value}
          </AnchorLink>
        )}
      </div>);
    }}
  />
);