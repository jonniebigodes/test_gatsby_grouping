import React from 'react'
import { Link, graphql } from 'gatsby'

const Category = ({ pageContext, data }) => {
  const { cat } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const catHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  }  with category "${cat}"`
  return (
    <div>
      <h1>{catHeader}</h1>
      <ul>
        {edges.map(({ node }) => {
          const { path, title } = node.frontmatter
          return (
            <li key={path}>
              <Link to={path}>{title}</Link>
            </li>
          )
        })}
      </ul>
      {/*
                  This links to a page that does not yet exist.
                  We'll come back to it!
                */}
      <Link to="/category">All categories</Link>
    </div>
  )
}
export default Category
export const pageQuery = graphql`
  query($cat: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { in: [$cat] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            path
          }
        }
      }
    }
  }
`
