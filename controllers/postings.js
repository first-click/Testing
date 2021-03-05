// //@desc search Post
// //@route GET /api/v1/posts
// //@access Public
// exports.getP = asyncHandler(async (req, res) => {
//   const post = await sequelize.query(
//     `
// SELECT *
// FROM ${Post.tableName}
// WHERE _search @@ plainto_tsquery('english', :query);
// `,
//     {
//       model: Post,
//       replacements: { query: 'one1' },
//     }
//   );
//   res.json(post);
// });
