const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require("lodash")
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }limit: 1000) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                  path
                  category
                }
              }
            }
          }
      }
    `
  ).then(result=>{
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }
    const blogPost = path.resolve(`./src/templates/blog-post.js`)
    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges
    posts.forEach((post, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })
  })
  .then(()=>{
    return graphql(`
      {
        allDirectory(filter: {relativeDirectory: {eq: ""}}){
          edges{
            node{
              id
              name
            }
          }
        }
      }
    `)
  }).then(result=>{
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }
    const categoriesTemplate= path.resolve('./src/templates/categories.js')
    const categoryList= result.data.allDirectory.edges
    let categories=[]
    _.each(categoryList,edge=>{
      if (_.get(edge,"node.name")){
            categories = categories.concat(edge.node.name)
      }
    })
    categories=_.uniq(categories)
    categories.forEach(item=>{
      createPage({
        path: `/categories/${_.kebabCase(item)}/`,
        component:categoriesTemplate,
        context:{
          cat:item
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
