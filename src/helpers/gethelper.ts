/**
 * 
 * @param model model: Mongoose model on which to execute the query.
 * @param filters (optional): An object containing filter conditions (e.g., { name: 'John' }).
 * @param projection  (optional): An object or string specifying which fields to return (e.g., { name: 1, age: 1 } or 'name age').
 * @param options (optional): Object that can contain additional query options like:
 *         sort: An object specifying sort order (e.g., { name: 1 } for ascending or { name: -1 } for descending).
           limit: Number of documents to return.
           skip: Number of documents to skip (useful for pagination).
           populate: String or object specifying population rules for referencing other collections.
 * @returns 
 */
export async function getData(
  model,
  filters = {},
  projection = null,
  options = {},
) {
  try {
    const { sort = {}, limit = 0, skip = 0, populate = '' } = options as any;

    // Query the database
    let query = model.find(filters, projection);

    // Apply sorting if provided
    if (sort && Object.keys(sort).length) {
      query = query.sort(sort);
    }

    // Apply pagination (limit and skip)
    if (limit) {
      query = query.limit(limit);
    }

    if (skip) {
      query = query.skip(skip);
    }

    // Apply population if needed
    if (populate) {
      query = query.populate(populate);
    }

    const results = await query.exec();
    return results;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}
